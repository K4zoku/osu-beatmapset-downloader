import DownloadProvider from "./DownloadProvider";

export default abstract class OsuBeatmapsetDownloader {
  abstract download(beatmapsetId: number, noVideo: boolean): DownloadProvider;
}