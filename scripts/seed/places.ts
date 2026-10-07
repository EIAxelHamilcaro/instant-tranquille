import type { Payload } from "payload";
import type { PlaceCategory } from "../../src/lib/places";
import { PLACES } from "./content/places";

export interface SeedPlace {
  key: string;
  name: string;
  nameEn?: string;
  category: PlaceCategory;
  commune: string;
  lat: number;
  lng: number;
  driveKm: number;
  driveMin: number;
  website?: string;
  summary: string;
  summaryEn: string;
  featured?: boolean;
  events?: { name: string; period: string; periodEn: string }[];
}

export type PlaceIds = Record<string, number>;

const SEEDED = { skipRouting: true };

export async function seedPlaces(payload: Payload) {
  const ids: PlaceIds = {};

  for (const place of PLACES) {
    const existing = await payload.find({
      collection: "places",
      where: { name: { equals: place.name } },
      locale: "fr",
      limit: 1,
      depth: 0,
    });

    const data = {
      name: place.name,
      category: place.category,
      commune: place.commune,
      lat: place.lat,
      lng: place.lng,
      driveKm: place.driveKm,
      driveMin: place.driveMin,
      website: place.website ?? null,
      summary: place.summary,
      featured: place.featured ?? false,
      events: place.events?.map(({ name, period }) => ({ name, period })) ?? [],
    };
    const current = existing.docs[0];
    const saved = current
      ? await payload.update({
          collection: "places",
          id: current.id,
          locale: "fr",
          data,
          context: SEEDED,
        })
      : await payload.create({
          collection: "places",
          locale: "fr",
          data,
          context: SEEDED,
        });

    await payload.update({
      collection: "places",
      id: saved.id,
      locale: "en",
      context: SEEDED,
      data: {
        name: place.nameEn ?? place.name,
        summary: place.summaryEn,
        events: saved.events?.map((event, index) => ({
          id: event.id,
          name: event.name,
          period: place.events?.[index]?.periodEn,
        })),
      },
    });

    ids[place.key] = saved.id;
  }

  console.log(`Places ready: ${Object.keys(ids).length}`);
  return ids;
}
