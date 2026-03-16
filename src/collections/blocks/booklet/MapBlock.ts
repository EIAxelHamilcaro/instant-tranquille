import type { Block } from "payload";
import { sectionTitleField } from "./sectionTitleField";

export const MapBlock: Block = {
  slug: "map",
  labels: { singular: "Carte des environs", plural: "Carte des environs" },
  fields: [
    sectionTitleField,
    {
      name: "embedUrl",
      type: "text",
      label: "URL de la carte embarquée",
      admin: {
        description:
          "URL d'embed Google Maps ou OpenStreetMap (ex: https://www.google.com/maps/embed?...)",
        placeholder: "https://www.google.com/maps/embed?pb=...",
      },
    },
    {
      name: "address",
      type: "textarea",
      label: "Adresse affichée",
      localized: true,
      admin: {
        description: "Adresse du gîte à afficher sous la carte",
      },
    },
  ],
};
