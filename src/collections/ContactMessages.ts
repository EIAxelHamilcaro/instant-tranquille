import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  lockDocuments: false,
  labels: { singular: "Message", plural: "Messages" },
  admin: {
    group: "Contenu",
    useAsTitle: "subject",
    description: "Messages reçus via le formulaire de contact",
    defaultColumns: ["name", "subject", "email", "createdAt"],
  },
  access: {
    create: isPublic,
    read: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nom",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      required: true,
    },
    {
      name: "phone",
      type: "text",
      label: "Téléphone",
    },
    {
      name: "subject",
      type: "text",
      label: "Sujet",
      required: true,
    },
    {
      name: "message",
      type: "textarea",
      label: "Message",
      required: true,
    },
    {
      name: "readStatus",
      type: "checkbox",
      label: "Lu",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Cochez quand le message a été traité",
      },
    },
  ],
};
