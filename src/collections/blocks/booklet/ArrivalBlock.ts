import type { Block } from "payload";
import { sectionTitleField } from "./sectionTitleField";

export const ArrivalBlock: Block = {
  slug: "arrival",
  labels: { singular: "Arrivée", plural: "Arrivée" },
  fields: [
    sectionTitleField,
    {
      name: "accessCode",
      type: "text",
      label: "Code d'accès",
      admin: {
        description: "Code d'accès au logement",
        placeholder: "1234#",
      },
    },
    {
      name: "instructions",
      type: "richText",
      label: "Instructions détaillées",
      localized: true,
      admin: {
        description: "Expliquez pas à pas comment entrer dans le gîte",
      },
    },
    {
      name: "parkingInfo",
      type: "textarea",
      label: "Informations parking",
      localized: true,
      admin: {
        description: "Où et comment se garer",
        placeholder: "2 places devant le gîte",
      },
    },
  ],
};
