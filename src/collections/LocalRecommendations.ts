import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateCollection } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const LocalRecommendations: CollectionConfig = {
  slug: "local-recommendations",
  lockDocuments: false,
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
      label: "Nom du lieu",
      required: true,
      localized: true,
      admin: {
        description:
          "Nom de l'établissement ou du site",
      },
    },
    {
      name: "description",
      type: "richText",
      label: "Description",
      localized: true,
      admin: {
        description:
          "Présentez ce lieu et pourquoi vous le recommandez",
      },
    },
    {
      name: "category",
      type: "select",
      label: "Catégorie",
      required: true,
      admin: {
        description: "Type d'activité ou de lieu",
      },
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
      label: "Adresse",
      admin: {
        description: "Adresse postale complète",
        placeholder: "41250 Chambord",
      },
    },
    {
      name: "phone",
      type: "text",
      label: "Téléphone",
      admin: {
        description:
          "Numéro pour réserver ou se renseigner",
        placeholder: "+33 2 54 00 00 00",
      },
    },
    {
      name: "website",
      type: "text",
      label: "Site web",
      admin: {
        description:
          "Adresse internet complète (commencez par https://)",
        placeholder: "https://www.exemple.fr",
      },
    },
    {
      name: "distanceFromGite",
      type: "text",
      label: "Distance du gîte",
      admin: {
        description: "Ex: 5 km, 15 min en voiture",
        placeholder: "15 min en voiture",
      },
    },
    {
      name: "coordinates",
      type: "group",
      label: "Coordonnées GPS",
      admin: {
        description:
          "Position sur la carte (optionnel — trouvable via Google Maps, clic droit)",
      },
      fields: [
        {
          name: "lat",
          type: "number",
          label: "Latitude",
          admin: {
            description: "Coordonnée GPS nord/sud",
            placeholder: "47.6161",
          },
        },
        {
          name: "lng",
          type: "number",
          label: "Longitude",
          admin: {
            description: "Coordonnée GPS est/ouest",
            placeholder: "1.5170",
          },
        },
      ],
    },
    {
      name: "photo",
      type: "upload",
      label: "Photo du lieu",
      relationTo: "media",
      admin: {
        description: "Image représentative (optionnel)",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Coup de cœur",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Cochez pour mettre en avant cette adresse",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Ordre d'affichage",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description:
          "Plus le nombre est petit, plus la recommandation apparaît en premier",
      },
    },
  ],
};
