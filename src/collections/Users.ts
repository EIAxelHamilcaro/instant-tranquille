import type { CollectionConfig } from "payload";
import { isAuthenticated } from "@/lib/access";

export const Users: CollectionConfig = {
  slug: "users",
  lockDocuments: false,
  labels: { singular: "Utilisateur", plural: "Utilisateurs" },
  auth: true,
  admin: {
    useAsTitle: "email",
    description: "Comptes administrateurs du site",
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
      label: "Nom complet",
      admin: {
        description: "Votre prénom et nom",
        placeholder: "Marie Dupont",
      },
    },
  ],
};
