import type { Block } from "payload";

export const CustomBlock: Block = {
  slug: "custom",
  labels: { singular: "Section libre", plural: "Sections libres" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titre",
      required: true,
      localized: true,
      admin: {
        description: "Titre de la section personnalisée",
      },
    },
    {
      name: "content",
      type: "richText",
      label: "Contenu",
      localized: true,
    },
  ],
};
