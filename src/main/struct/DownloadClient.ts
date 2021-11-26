import Downloader from "./Downloader";

export default abstract class DownloadClient {
  abstract download(url, opts): Downloader;
}