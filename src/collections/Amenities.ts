import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { advanced, listCell, screenIntro } from "@/lib/admin-fields";
import { AMENITY_ICON_OPTIONS } from "@/lib/amenity-icons";
import { previewUrl } from "@/lib/preview-url";
import { revalidateCollection } from "@/lib/revalidate";

export const Amenities: CollectionConfig = {
  slug: "amenities",
  lockDocuments: false,
  trash: true,
  labels: { singular: "Équipement", plural: "Équipements du gîte" },
  defaultSort: "order",
  hooks: revalidateCollection("amenities"),
  admin: {
    useAsTitle: "name",
    group: "Pages du site",
    description:
      "La liste des équipements affichée sur la page « Le gîte », rangée par catégorie. Elle est aussi transmise à Google.",
    defaultColumns: ["name", "category", "order", "enabled"],
    listSearchableFields: ["name"],
    pagination: { defaultLimit: 50 },
    hideAPIURL: true,
    components: {
      Description: screenIntro(
        "La liste « Équipements » de la page « Le gîte ».",
        "/le-gite",
      ),
    },
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
      label: "Nom de l'équipement",
      required: true,
      localized: true,
      maxLength: 50,
      admin: {
        description: "Un nom court, trois ou quatre mots au plus.",
        placeholder: "Terrasse avec barbecue",
      },
    },
    {
      name: "icon",
      type: "select",
      label: "Pictogramme",
      options: AMENITY_ICON_OPTIONS,
      admin: {
        description: "Le petit dessin affiché à côté du nom.",
      },
    },
    {
      name: "category",
      type: "select",
      label: "Catégorie",
      required: true,
      admin: {
        description:
          "Le groupe où l'équipement apparaît sur la page « Le gîte ».",
      },
      options: [
        { label: "Intérieur", value: "indoor" },
        { label: "Extérieur", value: "outdoor" },
        { label: "Cuisine", value: "kitchen" },
        { label: "Confort", value: "comfort" },
        { label: "Chambre", value: "bedroom" },
        { label: "Salle de bain", value: "bathroom" },
        { label: "Technologie", value: "tech" },
      ],
    },
    {
      name: "enabled",
      type: "checkbox",
      label: "Afficher sur le site",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Décochez pour masquer cet équipement sans le supprimer.",
        components: { Cell: listCell({ yes: "Affiché", no: "Masqué" }) },
      },
    },
    advanced(
      [
        {
          name: "order",
          type: "number",
          label: "Ordre d'affichage",
          defaultValue: 0,
          min: 0,
          admin: {
            description:
              "Les plus petits nombres passent en premier dans leur catégorie. Deux équipements au même nombre sont rangés par ordre alphabétique.",
            placeholder: "10",
          },
        },
      ],
      "sidebar",
    ),
  ],
};
