import type { GlobalConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateGlobal } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const Header: GlobalConfig = {
  slug: "header",
  label: "En-tête",
  hooks: revalidateGlobal("header"),
  versions: { drafts: true, max: 25 },
  access: {
    read: isPublic,
    update: isAuthenticated,
  },
  admin: {
    group: "Mise en page",
    description:
      "Menu de navigation affiché en haut de toutes les pages",
    livePreview: {
      url: ({ locale }) => previewUrl("/", { locale }),
    },
  },
  fields: [
    {
      name: "navItems",
      type: "array",
      label: "Menu de navigation",
      admin: {
        description:
          "Liens affichés dans le menu principal du site",
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Texte du lien",
          required: true,
          localized: true,
          admin: {
            description: "Ce qui s'affiche dans le menu",
            placeholder: "Le Gîte",
          },
        },
        {
          name: "url",
          type: "text",
          label: "Adresse",
          required: true,
          admin: {
            description:
              "Page de destination (ex: /le-gite pour une page du site)",
            placeholder: "/le-gite",
          },
        },
        {
          name: "isExternal",
          type: "checkbox",
          label: "Lien externe",
          defaultValue: false,
          admin: {
            description:
              "Cochez si le lien mène vers un autre site web",
          },
        },
        {
          name: "highlight",
          type: "checkbox",
          label: "Mettre en évidence",
          defaultValue: false,
          admin: {
            description:
              "Affiche ce lien comme un bouton pour attirer l'attention",
          },
        },
      ],
    },
    {
      name: "ctaButton",
      type: "group",
      label: "Bouton d'action",
      admin: {
        description:
          "Bouton principal visible dans l'en-tête (ex: « Réserver »)",
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Texte du bouton",
          localized: true,
          admin: {
            description: "Ce qui s'affiche sur le bouton",
            placeholder: "Réserver",
          },
        },
        {
          name: "url",
          type: "text",
          label: "Lien du bouton",
          admin: {
            description: "Vers quelle page mène ce bouton",
            placeholder: "/tarifs-reservation",
          },
        },
      ],
    },
  ],
};
