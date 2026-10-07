import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
nextEnv.loadEnvConfig(root);

const databaseHost = new URL(process.env.DATABASE_URL ?? "").hostname;
const isLocal = ["127.0.0.1", "localhost", "::1"].includes(databaseHost);

if (!isLocal && process.env.SEED_ALLOW_REMOTE !== "1") {
  console.error(
    `Seed refused: DATABASE_URL points to ${databaseHost}. Point it to a local database, or set SEED_ALLOW_REMOTE=1 if you really mean to seed this one.`,
  );
  process.exit(1);
}

const { getPayload } = await import("payload");
const { default: config } = await import("../../src/payload.config");
const { seedAdmin } = await import("./admin");
const { seedMedia } = await import("./media");
const { seedSettings } = await import("./settings");
const { seedPricing } = await import("./pricing");
const { seedCottage } = await import("./cottage");
const { seedPlaces } = await import("./places");
const { seedGuides } = await import("./guides");
const { retireGuides } = await import("./retire");
const { seedOfficialSites } = await import("./official-sites");
const { seedPages } = await import("./pages");
const { seedPhotos, attachPhotos } = await import("./photos");
const { PLACE_PHOTOS, GUIDE_PHOTOS } = await import("./content/place-photos");

const payload = await getPayload({ config });

await seedAdmin(payload);
const media = await seedMedia(payload, path.join(root, "public/images"));
await seedSettings(payload);
await seedPricing(payload);
await seedCottage(payload);
const places = await seedPlaces(payload);
await retireGuides(payload);
const guides = await seedGuides(payload, { media, places });

const placePhotos = await seedPhotos(
  payload,
  path.join(root, "scripts/seed/assets/places"),
  PLACE_PHOTOS,
);
const guidePhotos = await seedPhotos(
  payload,
  path.join(root, "scripts/seed/assets/guides"),
  GUIDE_PHOTOS,
);
await attachPhotos(payload, "places", places, placePhotos);
await attachPhotos(payload, "guides", guides, guidePhotos);

const sites = await seedOfficialSites(payload);

await seedPages(payload, {
  media: { ...media, ...placePhotos },
  guides,
  places,
  sites,
});

console.log("Seed done.");
process.exit(0);
