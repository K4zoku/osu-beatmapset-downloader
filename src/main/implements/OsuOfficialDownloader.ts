import OsuBeatmapsetDownloader from "../struct/OsuBeatmapsetDownloader";
import DownloadClient from "../struct/DownloadClient";
import Downloader from "../struct/Downloader";

export default class OsuOfficialDownloader extends OsuBeatmapsetDownloader {
  readonly #cookie: string;

  constructor(client: DownloadClient, cookie: string) {
    super(client);
    this.#cookie = cookie;
  }

  download(beatmapsetId: number, noVideo: boolean): Downloader {
    const url = new URL(`https://osu.ppy.sh/beatmapsets/${beatmapsetId}/download`);
    url.searchParams.append("noVideo", noVideo ? "1" : "0");
    const headers = {
      "Cookie": this.#cookie,
      "Referer": url.href
    };
    return this.client.download(url, {headers});
  }
}