import type { Block } from "payload";
import { rowLabel } from "@/lib/admin-fields";

export const GuideProgramme: Block = {
  slug: "programme",
  interfaceName: "GuideProgrammeBlock",
  labels: {
    singular: "Programme heure par heure",
    plural: "Programmes heure par heure",
  },
  fields: [
    {
      name: "steps",
      type: "array",
      label: "Étapes",
      labels: { singular: "Étape", plural: "Étapes" },
      required: true,
      minRows: 2,
      admin: {
        description:
          "Une ligne par étape, dans l'ordre de la journée : l'heure, ce qu'on fait, puis le détail utile (durée, tarif, où se garer).",
        components: { RowLabel: rowLabel("{time} {title}", "Étape") },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "time",
              type: "text",
              label: "Heure",
              required: true,
              maxLength: 20,
              admin: { placeholder: "9 h 30", width: "25%" },
            },
            {
              name: "title",
              type: "text",
              label: "Étape",
              required: true,
              maxLength: 90,
              admin: { placeholder: "Marché de la Halle", width: "75%" },
            },
          ],
        },
        {
          name: "details",
          type: "textarea",
          label: "Détail",
          maxLength: 420,
          admin: {
            description:
              "Durée sur place, tarif, conseil. Deux ou trois phrases au plus.",
          },
        },
      ],
    },
  ],
};
