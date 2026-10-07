import type { CollectionConfig } from "payload";
import { isAuthenticated } from "@/lib/access";
import { screenIntro } from "@/lib/admin-fields";

const SESSION_DAYS = 14;
const LOCK_MINUTES = 10;

export const Users: CollectionConfig = {
  slug: "users",
  lockDocuments: false,
  disableDuplicate: true,
  labels: { singular: "Utilisateur", plural: "Utilisateurs" },
  auth: {
    tokenExpiration: SESSION_DAYS * 24 * 60 * 60,
    maxLoginAttempts: 5,
    lockTime: LOCK_MINUTES * 60 * 1000,
  },
  admin: {
    useAsTitle: "email",
    group: "Réglages",
    description:
      "Les personnes qui peuvent se connecter à cet espace. Pour changer votre mot de passe, ouvrez votre compte.",
    defaultColumns: ["email", "name", "updatedAt"],
    hideAPIURL: true,
    components: {
      Description: screenIntro(
        "Rien n'est affiché : ce sont seulement les comptes qui ouvrent cet espace.",
      ),
    },
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
        description: "Affiché sur le résumé pour vous saluer.",
        placeholder: "Karine",
      },
    },
  ],
};
