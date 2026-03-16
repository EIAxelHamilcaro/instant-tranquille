import type { Block } from "payload";
import { sectionTitleField } from "./sectionTitleField";

export const CheckInOutBlock: Block = {
  slug: "checkInOut",
  labels: { singular: "Arrivée & Départ", plural: "Arrivée & Départ" },
  fields: [
    sectionTitleField,
    {
      name: "checkInTime",
      type: "text",
      label: "Heure d'arrivée",
      localized: true,
      admin: {
        description: "Ex: 'À partir de 16h00'",
        placeholder: "À partir de 16h00",
      },
    },
    {
      name: "checkInInstructions",
      type: "richText",
      label: "Procédure d'arrivée (check-in)",
      localized: true,
      admin: {
        description:
          "Informations pour le jour d'arrivée : accueil, remise des clés...",
      },
    },
    {
      name: "checkOutTime",
      type: "text",
      label: "Heure de départ",
      localized: true,
      admin: {
        description: "Ex: 'Avant 10h00'",
        placeholder: "Avant 10h00",
      },
    },
    {
      name: "checkOutInstructions",
      type: "richText",
      label: "Procédure de départ (check-out)",
      localized: true,
      admin: {
        description:
          "Ce qu'il faut faire avant de partir : clés, poubelles...",
      },
    },
  ],
};
