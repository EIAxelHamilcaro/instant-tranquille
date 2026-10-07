import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { probeVideos } from "../src/lib/video-probe";

const ROOT = join(import.meta.dirname, "..");
const MANIFEST = "src/lib/video-manifest.json";

const manifest = probeVideos(join(ROOT, "public/videos"));

await writeFile(join(ROOT, MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `${MANIFEST} : ${manifest.files.length} fichiers, film de ${manifest.filmSeconds ?? "?"} s`,
);
