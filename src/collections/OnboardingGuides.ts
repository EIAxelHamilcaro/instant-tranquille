import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateCollection } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const OnboardingGuides: CollectionConfig = {
  slug: "onboarding-guides",
  labels: { singular: "Livret d'accueil", plural: "Livrets d'accueil" },
  hooks: revalidateCollection("onboarding-guides"),
  admin: {
    useAsTitle: "title",
    group: "Contenu",
    description: "Livrets d'accueil personnalisés pour les voyageurs",
    defaultColumns: ["title", "accessToken", "isActive", "updatedAt"],
    livePreview: {
      url: ({ data, locale }) => {
        const token = (data as Record<string, unknown>).accessToken as string | undefined;
        return previewUrl(`/livret-accueil/${token || ""}`, { locale });
      },
    },
  },
  access: {
    create: isAuthenticated,
    read: isPublic,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "accessToken",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          "Token unique pour l'URL du livret (ex: dupont-2024-mars)",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "arrivalInstructions",
      type: "group",
      localized: true,
      fields: [
        {
          name: "accessCode",
          type: "text",
          admin: { description: "Code d'accès au logement" },
        },
        {
          name: "instructions",
          type: "richText",
        },
        {
          name: "parkingInfo",
          type: "textarea",
        },
      ],
    },
    {
      name: "houseRules",
      type: "richText",
      localized: true,
    },
    {
      name: "wifiInfo",
      type: "group",
      fields: [
        { name: "networkName", type: "text" },
        { name: "password", type: "text" },
      ],
    },
    {
      name: "equipmentGuide",
      type: "array",
      localized: true,
      fields: [
        { name: "name", type: "text", required: true },
        { name: "instructions", type: "richText" },
        { name: "photo", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "emergencyContacts",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "role", type: "text", localized: true },
        { name: "phone", type: "text", required: true },
        { name: "available", type: "text", localized: true },
      ],
    },
    {
      name: "checkInInstructions",
      type: "richText",
      localized: true,
    },
    {
      name: "checkOutInstructions",
      type: "richText",
      localized: true,
    },
    {
      name: "localRecommendations",
      type: "relationship",
      relationTo: "local-recommendations",
      hasMany: true,
    },
  ],
};
