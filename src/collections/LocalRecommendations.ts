import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateCollection } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const LocalRecommendations: CollectionConfig = {
  slug: "local-recommendations",
  labels: { singular: "Recommandation", plural: "Recommandations" },
  hooks: revalidateCollection("recommendations"),
  admin: {
    useAsTitle: "name",
    group: "Contenu",
    description: "Bonnes adresses et lieux à visiter aux alentours",
    defaultColumns: ["name", "category", "distanceFromGite", "featured"],
    livePreview: {
      url: ({ locale }) => previewUrl("/le-gite", { locale }),
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
      name: "name",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "description",
      type: "richText",
      localized: true,
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Restaurants", value: "restaurants" },
        { label: "Châteaux & Monuments", value: "castles" },
        { label: "Nature & Randonnées", value: "nature" },
        { label: "Marchés & Commerces", value: "markets" },
        { label: "Activités & Loisirs", value: "activities" },
        { label: "Services", value: "services" },
      ],
    },
    {
      name: "address",
      type: "text",
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "website",
      type: "text",
    },
    {
      name: "distanceFromGite",
      type: "text",
      admin: {
        description: "Ex: 5 km, 15 min en voiture",
      },
    },
    {
      name: "coordinates",
      type: "group",
      fields: [
        { name: "lat", type: "number" },
        { name: "lng", type: "number" },
      ],
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
      },
    },
  ],
};
