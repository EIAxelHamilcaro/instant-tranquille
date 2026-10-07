import { expect, test } from "bun:test";
import path from "node:path";
import manifest from "./video-manifest.json";
import { probeVideos } from "./video-probe";

test("given the files of public/videos, when compared with the versioned manifest, then both match (otherwise run pnpm generate:videos)", () => {
  const onDisk = probeVideos(path.join(import.meta.dir, "../../public/videos"));

  expect(onDisk).toEqual(manifest);
});
