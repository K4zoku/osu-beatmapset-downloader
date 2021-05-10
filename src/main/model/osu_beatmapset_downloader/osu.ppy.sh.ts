import OsuBeatmapsetDownloader from "../../struct/OsuBeatmapsetDownloader";
import DownloadProvider from "../../struct/DownloadProvider";
import {download} from "../download_provider/FetchProvider";
import {Headers} from "node-fetch";

export class OsuOfficialHost extends OsuBeatmapsetDownloader {
  readonly #cookie: string;

  constructor(cookie: string) {
    super();
    this.#cookie = cookie;
  }

  download(beatmapsetId: number, noVideo: boolean): DownloadProvider {
    const url = new URL("/beatmapsets/" + beatmapsetId, "https://osu.ppy.sh"),
      headers = new Headers();
    headers.set("Cookie", this.#cookie);
    headers.set("Referer", url.href);
    url.pathname += "/download";
    url.searchParams.append("noVideo", noVideo ? "1" : "0");
    return download(url, {headers});
  }
}

export default function downloadBeatmapset(cookie: string, beatmapsetId: number, noVideo: boolean = false): DownloadProvider {
  return new OsuOfficialHost(cookie).download(beatmapsetId, noVideo);
}