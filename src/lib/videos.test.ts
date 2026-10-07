import { expect, test } from "bun:test";
import path from "node:path";
import manifest from "./video-manifest.json";
import { probeVideos } from "./video-probe";
import { FILM_PUBLISHED_ON } from "./videos";

test("given the files of public/videos, when compared with the versioned manifest, then both match (otherwise run pnpm generate:videos)", () => {
  const onDisk = probeVideos(path.join(import.meta.dir, "../../public/videos"));

  expect(onDisk).toEqual(manifest);
});

test("given the film publication date, when Google reads it as uploadDate, then it carries a time and a time zone", () => {
  expect(FILM_PUBLISHED_ON).toMatch(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/,
  );
});
