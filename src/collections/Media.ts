import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateCollection } from "@/lib/revalidate";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Média", plural: "Médias" },
  hooks: revalidateCollection("media"),
  upload: {
    staticDir: "media",
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300 },
      { name: "card", width: 768, height: 512 },
      { name: "hero", width: 1920, height: 1080 },
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
        description:
          "Texte affiché sous l'image (optionnel)",
        placeholder: "Le gîte au printemps",
      },
    },
  ],
};
