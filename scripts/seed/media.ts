import fs from "node:fs";
import path from "node:path";
import type { Payload } from "payload";
import sharp from "sharp";
import { IMAGE_MAP } from "./images";

export type MediaIds = Record<string, number>;

export async function seedMedia(payload: Payload, imagesDir: string) {
  const ids: MediaIds = {};

  for (const image of IMAGE_MAP) {
    const key = image.filename.replace(/\.webp$/, "");
    const existing = await payload.find({
      collection: "media",
      where: { alt: { equals: image.altFr } },
      locale: "fr",
      limit: 1,
      depth: 0,
    });

    if (existing.docs[0]) {
      ids[key] = existing.docs[0].id;
      continue;
    }

    const filePath = path.join(imagesDir, image.filename);
    const preview = await sharp(fs.readFileSync(filePath))
      .resize(20, 20, { fit: "inside" })
      .webp({ quality: 40 })
      .toBuffer();

    const created = await payload.create({
      collection: "media",
      filePath,
      locale: "fr",
      data: {
        alt: image.altFr,
        caption: image.captionFr,
        focalX: image.focalX,
        focalY: image.focalY,
        blurDataURL: `data:image/webp;base64,${preview.toString("base64")}`,
      },
    });
    await payload.update({
      collection: "media",
      id: created.id,
      locale: "en",
      data: { alt: image.altEn, caption: image.captionEn },
    });

    ids[key] = created.id;
    console.log(`Media created: ${image.filename}`);
  }

  return ids;
}
