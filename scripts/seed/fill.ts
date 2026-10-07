import type { GlobalSlug, Payload } from "payload";

type Fields = Record<string, unknown>;

const isGroup = (value: unknown): value is Fields =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  !("root" in value);

const isEmpty = (value: unknown) =>
  value === null ||
  value === undefined ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

export function missingFields(current: Fields, wanted: Fields): Fields {
  const missing: Fields = {};

  for (const [key, value] of Object.entries(wanted)) {
    const existing = current[key];

    if (isGroup(value) && isGroup(existing)) {
      const nested = missingFields(existing, value);
      if (Object.keys(nested).length > 0) missing[key] = nested;
      continue;
    }

    if (isEmpty(existing) && !isEmpty(value)) missing[key] = value;
  }

  return missing;
}

export async function fillGlobal(
  payload: Payload,
  slug: GlobalSlug,
  locale: "fr" | "en",
  wanted: Fields,
) {
  const current = await payload.findGlobal({
    slug,
    locale,
    fallbackLocale: false,
    depth: 0,
  });
  const data = missingFields(current as Fields, wanted);
  const fields = Object.keys(data);
  if (fields.length === 0) return;

  await payload.updateGlobal({
    slug,
    locale,
    data: { ...data, _status: "published" },
  });
  console.log(`${slug} (${locale}) filled: ${fields.join(", ")}`);
}
