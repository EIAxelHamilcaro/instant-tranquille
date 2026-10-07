import { closeSync, fstatSync, openSync, readdirSync, readSync } from "node:fs";
import path from "node:path";
import type { VideoManifest } from "@/lib/videos";

const BOX_HEADER_BYTES = 16;
const FILM_FILE = "film.mp4";

function movieHeaderSeconds(movie: Buffer) {
  const header = movie.indexOf("mvhd", 0, "latin1");
  if (header < 0) return undefined;

  const fields = header + 4;
  const isLong = movie.readUInt8(fields) === 1;
  const timescale = movie.readUInt32BE(fields + (isLong ? 20 : 12));
  const ticks = isLong
    ? Number(movie.readBigUInt64BE(fields + 24))
    : movie.readUInt32BE(fields + 16);

  return timescale > 0 ? ticks / timescale : undefined;
}

function readMp4Seconds(descriptor: number) {
  const { size } = fstatSync(descriptor);
  const box = Buffer.alloc(BOX_HEADER_BYTES);
  let offset = 0;

  while (offset + BOX_HEADER_BYTES <= size) {
    readSync(descriptor, box, 0, BOX_HEADER_BYTES, offset);

    const shortLength = box.readUInt32BE(0);
    const length =
      shortLength === 1 ? Number(box.readBigUInt64BE(8)) : shortLength;
    if (length < 8) return undefined;

    if (box.toString("latin1", 4, 8) === "moov") {
      const movie = Buffer.alloc(Math.min(length, size - offset));
      readSync(descriptor, movie, 0, movie.length, offset);

      return movieHeaderSeconds(movie);
    }

    offset += length;
  }

  return undefined;
}

function mp4Seconds(file: string) {
  const descriptor = openSync(file, "r");

  try {
    return readMp4Seconds(descriptor);
  } catch {
    return undefined;
  } finally {
    closeSync(descriptor);
  }
}

export function probeVideos(directory: string): VideoManifest {
  const files = readdirSync(directory).sort();

  return {
    files,
    filmSeconds: files.includes(FILM_FILE)
      ? mp4Seconds(path.join(directory, FILM_FILE))
      : undefined,
  };
}
