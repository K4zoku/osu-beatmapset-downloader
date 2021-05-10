import DownloadProvider from "../../abstract/DownloadProvider";
import fetch, {Response, RequestInfo, RequestInit} from "node-fetch";

const FILENAME_EXTRACTOR = /filename\*?=["]?(?:UTF-\d["]*)?([^;\r\n"]*)["]?;?/i;

export default class FetchProvider extends DownloadProvider {
  readonly #response: Promise<Response>;
  constructor(input: RequestInfo, init: RequestInit) {
    super();
    this.#response = fetch(input, init);
  }

  async buffer(): Promise<Buffer> {
    return (await this.#response).buffer();
  }

  async name(): Promise<string> {
    const response = await this.#response;
    if (response.headers.has("Content-Disposition"))
      return decodeURIComponent(response.headers.get("Content-Disposition").match(FILENAME_EXTRACTOR)[1]);
    const
      url = new URL(response.url),
      paths = decodeURIComponent(url.pathname.substr(1)).split("/");
    return paths.length === 0 ? url.hostname : paths[paths.length - 1];
  }

  async size(): Promise<number> {
    return parseInt((await this.#response).headers.get("Content-Length"));
  }

  async stream(): Promise<NodeJS.ReadableStream> {
    return (await this.#response).body;
  }
}

export function download(input: RequestInfo, init: RequestInit): DownloadProvider {
  return new FetchProvider(input, init);
}
