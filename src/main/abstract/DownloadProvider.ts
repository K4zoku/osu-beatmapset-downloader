import ReadableStream = NodeJS.ReadableStream;
import {Readable} from "stream";

export default abstract class DownloadProvider {
  abstract buffer(): Promise<Buffer>;
  abstract stream(): Promise<ReadableStream | Readable>;
  abstract size(): Promise<number>;
  abstract name(): Promise<string>;
}