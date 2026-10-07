import fs from "node:fs";
import path from "node:path";
import type { Payload } from "payload";
import sharp from "sharp";
import type { PlacePhoto } from "./content/place-photos";
import type { MediaIds } from "./media";

export async function seedPhotos(
  payload: Payload,
  directory: string,
  photos: Record<string, PlacePhoto>,
) {
  const ids: MediaIds = {};

  for (const [key, photo] of Object.entries(photos)) {
    const filePath = path.join(directory, photo.file);
    if (!fs.existsSync(filePath)) continue;

    const existing = await payload.find({
      collection: "media",
      where: { alt: { equals: photo.altFr } },
      locale: "fr",
      limit: 1,
      depth: 0,
    });

    if (existing.docs[0]) {
      ids[key] = existing.docs[0].id;
      continue;
    }

    const preview = await sharp(fs.readFileSync(filePath))
      .resize(20, 20, { fit: "inside" })
      .webp({ quality: 40 })
      .toBuffer();

    const created = await payload.create({
      collection: "media",
      filePath,
      locale: "fr",
      data: {
        alt: photo.altFr,
        credit: `${photo.author}, ${photo.license}`,
        creditUrl: photo.sourceUrl,
        focalX: photo.focalX,
        focalY: photo.focalY,
        blurDataURL: `data:image/webp;base64,${preview.toString("base64")}`,
      },
    });
    await payload.update({
      collection: "media",
      id: created.id,
      locale: "en",
      data: { alt: photo.altEn },
    });

    ids[key] = created.id;
  }

  console.log(`Photos ready: ${Object.keys(ids).length}`);

  return ids;
}

export async function attachPhotos(
  payload: Payload,
  collection: "places" | "guides",
  documents: Record<string, number>,
  photos: MediaIds,
) {
  for (const [key, id] of Object.entries(documents)) {
    const image = photos[key];
    if (!image) continue;

    const document = await payload.findByID({ collection, id, depth: 0 });
    if (document.image) continue;

    await payload.update({ collection, id, data: { image } });
  }
}
