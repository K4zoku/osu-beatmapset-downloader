import DownloadClient from "./DownloadClient";
import Downloader from "./Downloader";

export default abstract class OsuBeatmapsetDownloader {
  readonly client: DownloadClient;

  protected constructor(client: DownloadClient) {
    this.client = client;
  }

  abstract download(beatmapsetId: number, noVideo: boolean): Downloader;
}