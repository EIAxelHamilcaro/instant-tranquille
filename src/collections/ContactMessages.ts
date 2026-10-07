import type { CollectionConfig } from "payload";
import { isAuthenticated } from "@/lib/access";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  lockDocuments: false,
  labels: { singular: "Message reçu", plural: "Messages reçus" },
  defaultSort: "-createdAt",
  admin: {
    group: "Avis et réservations",
    useAsTitle: "subject",
    description:
      "Les messages envoyés depuis le formulaire de la page contact. Répondez depuis votre boîte e-mail, puis cochez « Message lu ».",
    defaultColumns: ["subject", "name", "dates", "createdAt", "readStatus"],
    listSearchableFields: ["name", "email", "subject", "message"],
  },
  access: {
    create: () => false,
    read: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: "subject",
      type: "text",
      label: "Objet",
      required: true,
      maxLength: 300,
      admin: { readOnly: true },
    },
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          label: "Nom",
          required: true,
          maxLength: 200,
          admin: { readOnly: true, width: "50%" },
        },
        {
          name: "dates",
          type: "text",
          label: "Dates souhaitées",
          maxLength: 80,
          admin: { readOnly: true, width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "email",
          type: "email",
          label: "E-mail",
          required: true,
          admin: {
            readOnly: true,
            description: "L'adresse à laquelle répondre.",
            width: "50%",
          },
        },
        {
          name: "phone",
          type: "text",
          label: "Téléphone",
          admin: { readOnly: true, width: "50%" },
        },
      ],
    },
    {
      name: "message",
      type: "textarea",
      label: "Message",
      required: true,
      maxLength: 5000,
      admin: { readOnly: true, rows: 10 },
    },
    {
      name: "readStatus",
      type: "checkbox",
      label: "Message lu",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Cochez quand vous avez répondu. Le tableau de bord compte les messages non lus.",
      },
    },
  ],
};
