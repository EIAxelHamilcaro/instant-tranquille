import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { validatePhone } from "@/lib/validators";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  lockDocuments: false,
  labels: { singular: "Message", plural: "Messages" },
  admin: {
    group: "Contenu",
    useAsTitle: "subject",
    description: "Messages reçus via le formulaire de contact",
    defaultColumns: ["name", "email", "subject", "createdAt", "readStatus"],
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
      maxLength: 200,
      admin: {
        readOnly: true,
        description: "Nom de l'expéditeur (rempli automatiquement depuis le formulaire)",
      },
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      required: true,
      admin: {
        readOnly: true,
        description: "Adresse email de l'expéditeur",
      },
    },
    {
      name: "phone",
      type: "text",
      label: "Téléphone",
      validate: validatePhone,
      admin: {
        readOnly: true,
        description: "Numéro de téléphone de l'expéditeur (optionnel)",
      },
    },
    {
      name: "subject",
      type: "text",
      label: "Sujet",
      required: true,
      maxLength: 300,
      admin: {
        readOnly: true,
        description: "Objet du message",
      },
    },
    {
      name: "message",
      type: "textarea",
      label: "Message",
      required: true,
      maxLength: 5000,
      admin: {
        readOnly: true,
        description: "Contenu du message envoyé via le formulaire de contact",
      },
    },
    {
      name: "readStatus",
      type: "checkbox",
      label: "Lu",
      defaultValue: false,
      access: {
        create: () => false,
      },
      admin: {
        position: "sidebar",
        description: "Cochez quand le message a été traité",
      },
    },
  ],
};
