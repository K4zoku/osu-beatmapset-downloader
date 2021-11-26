import fetch, {RequestInfo, RequestInit, Response} from "node-fetch";
import Downloader from "../struct/Downloader";

const FILENAME_EXTRACTOR = /filename\*?=["]?(?:UTF-\d["]*)?([^;\r\n"]*)["]?;?/i;

export default class FetchDownloader extends Downloader {
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
    if (response.headers.has("Content-Disposition")) {
      return decodeURIComponent(response.headers.get("Content-Disposition")).match(FILENAME_EXTRACTOR)[1];
    }
    const url = new URL(response.url);
    const paths = decodeURIComponent(url.pathname).split("/");
    return paths.length === 1 ? url.hostname : paths[paths.length - 1];
  }

  async size(): Promise<number> {
    return parseInt((await this.#response).headers.get("Content-Length"));
  }

  async stream(): Promise<NodeJS.ReadableStream> {
    return (await this.#response).body;
  }

  async mime(): Promise<string> {
    const response = await this.#response;
    return response.headers.get("Content-Type");
  }
}
