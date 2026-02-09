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
      label: "Nom de l'équipement",
      required: true,
      localized: true,
      admin: {
        description: "Nom court affiché sur le site",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      localized: true,
      admin: {
        description: "Détails sur cet équipement (optionnel)",
      },
    },
    {
      name: "icon",
      type: "text",
      label: "Icône",
      admin: {
        description:
          "Nom de l'icône Lucide (ex: wifi, bed-double, utensils)",
        placeholder: "wifi",
      },
    },
    {
      name: "category",
      type: "select",
      label: "Catégorie",
      required: true,
      admin: {
        description:
          "Regroupe les équipements par type sur le site",
      },
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
      label: "Photo",
      relationTo: "media",
      admin: {
        description: "Illustre cet équipement (optionnel)",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Ordre d'affichage",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description:
          "Plus le nombre est petit, plus l'équipement apparaît en premier (0, 1, 2...)",
      },
    },
  ],
};
