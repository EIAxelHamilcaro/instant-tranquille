import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { charCount } from "@/lib/admin-fields";
import { OFFICIAL_SITE_GROUP_OPTIONS } from "@/lib/official-sites";
import { revalidateCollection } from "@/lib/revalidate";
import { validateUrl } from "@/lib/validators";

const DETAIL_MAX = 160;

export const OfficialSites: CollectionConfig = {
  slug: "official-sites",
  lockDocuments: false,
  labels: { singular: "Site officiel", plural: "Sites officiels" },
  hooks: revalidateCollection("official-sites"),
  defaultSort: "order",
  admin: {
    useAsTitle: "name",
    group: "Autour du gîte",
    description:
      "Offices de tourisme, sites institutionnels et mairies cités en bas de la page « Les alentours », à la fin des guides et dans le pied de page.",
    defaultColumns: ["name", "group", "url", "showInFooter", "order"],
    listSearchableFields: ["name", "url"],
    pagination: { defaultLimit: 50 },
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
      label: "Nom du site",
      required: true,
      localized: true,
      maxLength: 70,
      admin: {
        description: "Le nom affiché comme lien.",
        placeholder: "Sologne Tourisme",
      },
    },
    {
      name: "url",
      type: "text",
      label: "Adresse du site",
      required: true,
      validate: validateUrl,
      admin: {
        description:
          "Ouvrez le site et copiez l'adresse affichée en haut du navigateur.",
        placeholder: "https://www.sologne-tourisme.fr/",
      },
    },
    {
      name: "detail",
      type: "textarea",
      label: "Ce qu'on y trouve",
      localized: true,
      maxLength: DETAIL_MAX,
      admin: {
        description:
          "Une phrase affichée sous le lien. Inutile pour une mairie.",
        components: charCount(DETAIL_MAX),
      },
    },
    {
      name: "group",
      type: "select",
      label: "Rubrique",
      required: true,
      options: OFFICIAL_SITE_GROUP_OPTIONS,
      admin: {
        position: "sidebar",
        description: "La rubrique où le lien apparaît sur « Les alentours ».",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Ordre",
      defaultValue: 100,
      min: 0,
      admin: {
        position: "sidebar",
        description: "Les plus petits nombres passent en premier.",
      },
    },
    {
      name: "showInFooter",
      type: "checkbox",
      label: "Afficher dans le pied de page",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Cinq sites au plus, pour que la colonne « Sources officielles » reste courte.",
      },
    },
  ],
};
