import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import sharp from "sharp";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateCollection } from "@/lib/revalidate";

const webpFormat = { format: "webp" as const, options: { quality: 80 } };

const generateBlurDataURL: CollectionBeforeChangeHook = async ({
  data,
  req,
}) => {
  const buffer = req.file?.data;
  if (!buffer) return data;

  try {
    const lqip = await sharp(buffer)
      .resize(20, 20, { fit: "inside" })
      .webp({ quality: 40 })
      .toBuffer();
    data.blurDataURL = `data:image/webp;base64,${lqip.toString("base64")}`;
  } catch (error) {
    req.payload.logger.error({
      msg: "Échec génération du blurDataURL",
      err: error,
    });
  }

  return data;
};

export const Media: CollectionConfig = {
  slug: "media",
  lockDocuments: false,
  labels: { singular: "Média", plural: "Médias" },
  hooks: {
    ...revalidateCollection("media"),
    beforeChange: [generateBlurDataURL],
  },
  upload: {
    staticDir: "media",
    formatOptions: webpFormat,
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, formatOptions: webpFormat },
      { name: "card", width: 768, height: 512, formatOptions: webpFormat },
      { name: "hero", width: 1920, height: 1080, formatOptions: webpFormat },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
  admin: {
    useAsTitle: "alt",
    description: "Images et fichiers médias du site",
    defaultColumns: ["filename", "alt", "mimeType", "updatedAt"],
  },
  access: {
    create: isAuthenticated,
    read: isPublic,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texte alternatif",
      required: true,
      localized: true,
      admin: {
        description:
          "Décrivez l'image en quelques mots (important pour le référencement)",
        placeholder: "Vue du gîte depuis le jardin",
      },
    },
    {
      name: "caption",
      type: "text",
      label: "Légende",
      localized: true,
      admin: {
        description: "Texte affiché sous l'image (optionnel)",
        placeholder: "Le gîte au printemps",
      },
    },
    {
      name: "blurDataURL",
      type: "text",
      admin: { hidden: true, readOnly: true },
    },
  ],
};
