import type { CollectionConfig } from "payload";
import { isAuthenticated } from "@/lib/access";

export const Users: CollectionConfig = {
  slug: "users",
  lockDocuments: false,
  labels: { singular: "Utilisateur", plural: "Utilisateurs" },
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "Réglages",
    description:
      "Les personnes qui peuvent se connecter à cet espace. Pour changer votre mot de passe, ouvrez votre compte.",
    defaultColumns: ["email", "name", "updatedAt"],
  },
  access: {
    create: isAuthenticated,
    read: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Prénom",
      maxLength: 60,
      admin: {
        description: "Affiché sur le tableau de bord pour vous saluer.",
        placeholder: "Karine",
      },
    },
  ],
};
