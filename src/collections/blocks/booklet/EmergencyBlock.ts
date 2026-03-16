import type { Block } from "payload";
import { validatePhone } from "@/lib/validators";
import { sectionTitleField } from "./sectionTitleField";

export const EmergencyBlock: Block = {
  slug: "emergency",
  labels: { singular: "Contacts d'urgence", plural: "Contacts d'urgence" },
  fields: [
    sectionTitleField,
    {
      name: "emergencyNumber",
      type: "text",
      label: "Numéro d'urgence principal",
      admin: {
        description: "Numéro affiché en bannière (ex: 112, 911)",
        placeholder: "112",
      },
    },
    {
      name: "emergencyLabel",
      type: "text",
      label: "Texte de la bannière d'urgence",
      localized: true,
      admin: {
        description: "Texte affiché à côté du numéro (ex: 'Urgences : 112')",
        placeholder: "Urgences : 112",
      },
    },
    {
      name: "contacts",
      type: "array",
      label: "Contacts d'urgence",
      admin: {
        description: "Numéros utiles pendant le séjour",
      },
      fields: [
        {
          name: "name",
          type: "text",
          label: "Nom",
          required: true,
          admin: {
            description: "Nom de la personne ou du service",
            placeholder: "Marie (propriétaire)",
          },
        },
        {
          name: "role",
          type: "text",
          label: "Rôle",
          localized: true,
          admin: {
            description: "Fonction ou spécialité",
            placeholder: "Propriétaire",
          },
        },
        {
          name: "phone",
          type: "text",
          label: "Téléphone",
          required: true,
          validate: validatePhone,
          admin: {
            description: "Numéro à appeler",
            placeholder: "+33 6 12 34 56 78",
          },
        },
        {
          name: "available",
          type: "text",
          label: "Disponibilité",
          localized: true,
          admin: {
            description: "Quand peut-on appeler",
            placeholder: "Tous les jours 8h-22h",
          },
        },
      ],
    },
  ],
};
