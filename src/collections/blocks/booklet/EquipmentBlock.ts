import type { Block } from "payload";
import { sectionTitleField } from "./sectionTitleField";

export const EquipmentBlock: Block = {
  slug: "equipment",
  labels: { singular: "Équipements", plural: "Équipements" },
  fields: [
    sectionTitleField,
    {
      name: "items",
      type: "array",
      label: "Guide des équipements",
      localized: true,
      admin: {
        description:
          "Mode d'emploi des appareils : machine à café, cheminée, lave-linge...",
      },
      fields: [
        {
          name: "name",
          type: "text",
          label: "Nom de l'appareil",
          required: true,
          admin: {
            description: "Quel équipement",
            placeholder: "Machine à café Nespresso",
          },
        },
        {
          name: "instructions",
          type: "richText",
          label: "Mode d'emploi",
          admin: {
            description: "Expliquez comment utiliser cet appareil",
          },
        },
        {
          name: "photo",
          type: "upload",
          label: "Photo",
          relationTo: "media",
          admin: {
            description:
              "Pour aider le voyageur à repérer l'appareil (optionnel)",
          },
        },
      ],
    },
  ],
};
