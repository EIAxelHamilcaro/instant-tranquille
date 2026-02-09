import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateCollection } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const Amenities: CollectionConfig = {
  slug: "amenities",
  labels: { singular: "Équipement", plural: "Équipements" },
  hooks: revalidateCollection("amenities"),
  admin: {
    useAsTitle: "name",
    group: "Contenu",
    description: "Équipements et commodités du gîte",
    defaultColumns: ["name", "category", "order"],
    livePreview: {
      url: ({ locale }) => previewUrl("/le-gite", { locale }),
    },
  },
  access: {
    create: isAuthenticated,
    read: isPublic,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
    },
    {
      name: "icon",
      type: "text",
      admin: {
        description: "Nom de l'icône Lucide (ex: wifi, bed-double, utensils)",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Intérieur", value: "indoor" },
        { label: "Extérieur", value: "outdoor" },
        { label: "Cuisine", value: "kitchen" },
        { label: "Confort", value: "comfort" },
      ],
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
      },
    },
  ],
};
