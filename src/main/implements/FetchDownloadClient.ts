import DownloadClient from "../struct/DownloadClient";
import Downloader from "../struct/Downloader";
import FetchDownloader from "./FetchDownloader";

export default class FetchDownloadClient extends DownloadClient {
  download(url, opts): Downloader {
    return new FetchDownloader(url, opts);
  }
}