import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import type { GlobalSlug, Payload } from "payload";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
nextEnv.loadEnvConfig(root);

const databaseHost = new URL(process.env.DATABASE_URL ?? "").hostname;
const isLocal = ["127.0.0.1", "localhost", "::1"].includes(databaseHost);

if (!isLocal && process.env.SEED_ALLOW_REMOTE !== "1") {
  console.error(
    `Corrections refused: DATABASE_URL points to ${databaseHost}. Point it to a local database, or set SEED_ALLOW_REMOTE=1 if you really mean to correct this one.`,
  );
  process.exit(1);
}

const { getPayload } = await import("payload");
const { default: config } = await import("../../src/payload.config");
const {
  CONTACT_PAGE,
  COTTAGE_PAGE,
  GUIDES_PAGE,
  HOME_PAGE,
  RATES_PAGE,
  SURROUNDINGS_PAGE,
} = await import("./content/pages");
const { richText } = await import("./rich-text");
const { retireGuides } = await import("./retire");
const { seedRedirects } = await import("./redirects");

type Locale = "fr" | "en";
type Fields = Record<string, unknown>;

interface Row extends Fields {
  id?: string | null;
}

interface PageMeta {
  title: string;
  description: string;
}

const LOCALES: Locale[] = ["fr", "en"];
const GAMES_ROOM = 2;
const FIRST_STEP = 0;
const RENAMED_AMENITIES = [
  {
    from: "Parking privé gratuit",
    fr: "Parking gratuit, 1 place",
    en: "Free parking, 1 space",
  },
];

const same = (current: unknown, wanted: unknown) =>
  JSON.stringify(current ?? null) === JSON.stringify(wanted ?? null);

const plainText = (value: unknown): string => {
  if (!value || typeof value !== "object") return "";
  if (Array.isArray(value)) return value.map(plainText).join("");

  const node = value as Fields;
  const own = typeof node.text === "string" ? node.text : "";
  const separator = node.type === "paragraph" ? "\n" : "";

  return `${own}${plainText(node.children)}${plainText(node.root)}${separator}`;
};

function metaCorrection(current: Fields, wanted: PageMeta) {
  const meta = (current.meta ?? {}) as Fields;
  const next = { title: wanted.title, description: wanted.description };

  if (same({ title: meta.title, description: meta.description }, next)) {
    return {};
  }

  return { meta: { ...meta, ...next } };
}

function textCorrection(current: Fields, field: string, wanted: string) {
  return same(current[field], wanted) ? {} : { [field]: wanted };
}

function richTextCorrection(
  current: Fields,
  field: string,
  wanted: ReturnType<typeof richText>,
) {
  return plainText(current[field]) === plainText(wanted)
    ? {}
    : { [field]: wanted };
}

function rowCorrection(
  current: Fields,
  field: string,
  index: number,
  key: string,
  wanted: string,
) {
  const rows = (current[field] ?? []) as Row[];
  const row = rows[index];

  if (!row) {
    console.warn(`  ${field}[${index}] is missing, ${key} left untouched`);
    return {};
  }
  if (same(row[key], wanted)) return {};

  return {
    [field]: rows.map((item, position) =>
      position === index ? { ...item, [key]: wanted } : item,
    ),
  };
}

async function correct(
  payload: Payload,
  slug: GlobalSlug,
  locale: Locale,
  corrections: (current: Fields) => Fields,
) {
  const current = (await payload.findGlobal({
    slug,
    locale,
    fallbackLocale: false,
    depth: 0,
  })) as Fields;
  const data = corrections(current);
  const fields = Object.keys(data);

  if (fields.length === 0) {
    console.log(`${slug} (${locale}) already corrected`);
    return;
  }

  await payload.updateGlobal({
    slug,
    locale,
    data: { ...data, _status: "published" },
  });
  console.log(`${slug} (${locale}) corrected: ${fields.join(", ")}`);
}

async function guideIds(payload: Payload, slugs: string[]) {
  const { docs } = await payload.find({
    collection: "guides",
    where: { slug: { in: slugs } },
    limit: slugs.length,
    depth: 0,
  });

  return slugs.flatMap((slug) => {
    const guide = docs.find((doc) => doc.slug === slug);
    return guide ? [guide.id] : [];
  });
}

async function renameAmenities(payload: Payload) {
  for (const { from, fr, en } of RENAMED_AMENITIES) {
    const { docs } = await payload.find({
      collection: "amenities",
      where: { name: { equals: from } },
      locale: "fr",
      limit: 1,
      depth: 0,
    });
    const amenity = docs[0];

    if (!amenity) {
      console.log(`amenity "${fr}" already corrected`);
      continue;
    }

    await payload.update({
      collection: "amenities",
      id: amenity.id,
      locale: "fr",
      data: { name: fr },
    });
    await payload.update({
      collection: "amenities",
      id: amenity.id,
      locale: "en",
      data: { name: en },
    });
    console.log(`amenity "${from}" renamed "${fr}"`);
  }
}

const payload = await getPayload({ config });

await retireGuides(payload);
await seedRedirects(payload);
await renameAmenities(payload);

const featuredGuides = await guideIds(payload, HOME_PAGE.featuredGuides);

for (const locale of LOCALES) {
  await correct(payload, "home-page", locale, (current) => ({
    ...(same(current.featuredGuides, featuredGuides) ? {} : { featuredGuides }),
    ...textCorrection(current, "bookingText", HOME_PAGE[locale].bookingText),
    ...metaCorrection(current, HOME_PAGE[locale].meta),
  }));

  await correct(payload, "cottage-page", locale, (current) => ({
    ...richTextCorrection(
      current,
      "description",
      richText(COTTAGE_PAGE[locale].description),
    ),
    ...rowCorrection(
      current,
      "rooms",
      GAMES_ROOM,
      "description",
      COTTAGE_PAGE.rooms[GAMES_ROOM]?.[locale].description ?? "",
    ),
    ...metaCorrection(current, COTTAGE_PAGE[locale].meta),
  }));

  await correct(payload, "surroundings-page", locale, (current) =>
    metaCorrection(current, SURROUNDINGS_PAGE[locale].meta),
  );

  await correct(payload, "guides-page", locale, (current) =>
    metaCorrection(current, GUIDES_PAGE[locale].meta),
  );

  await correct(payload, "rates-page", locale, (current) => ({
    ...textCorrection(current, "lede", RATES_PAGE[locale].lede),
    ...rowCorrection(
      current,
      "steps",
      FIRST_STEP,
      "text",
      RATES_PAGE[locale].steps[FIRST_STEP]?.text ?? "",
    ),
    ...metaCorrection(current, RATES_PAGE[locale].meta),
  }));

  await correct(payload, "contact-page", locale, (current) =>
    metaCorrection(current, CONTACT_PAGE[locale].meta),
  );
}

console.log("Corrections done.");
process.exit(0);
