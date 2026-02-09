import type { GlobalConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateGlobal } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Pied de page",
  hooks: revalidateGlobal("footer"),
  versions: { drafts: true, max: 25 },
  access: {
    read: isPublic,
    update: isAuthenticated,
  },
  admin: {
    group: "Mise en page",
    description:
      "Pied de page affiché en bas de toutes les pages",
    livePreview: {
      url: ({ locale }) => previewUrl("/", { locale }),
    },
  },
  fields: [
    {
      name: "description",
      type: "textarea",
      label: "Texte de présentation",
      localized: true,
      admin: {
        description:
          "Courte description affichée dans le pied de page",
      },
    },
    {
      name: "navColumns",
      type: "array",
      label: "Colonnes de liens",
      admin: {
        description:
          "Organisez les liens du pied de page en colonnes",
      },
      fields: [
        {
          name: "title",
          type: "text",
          label: "Titre de la colonne",
          required: true,
          localized: true,
          admin: {
            description: "Titre affiché au-dessus des liens",
            placeholder: "Navigation",
          },
        },
        {
          name: "links",
          type: "array",
          label: "Liens",
          admin: {
            description: "Liste des liens dans cette colonne",
          },
          fields: [
            {
              name: "label",
              type: "text",
              label: "Texte du lien",
              required: true,
              localized: true,
              admin: {
                description: "Ce qui s'affiche",
                placeholder: "Mentions légales",
              },
            },
            {
              name: "url",
              type: "text",
              label: "Adresse",
              required: true,
              admin: {
                description: "Page de destination",
                placeholder: "/mentions-legales",
              },
            },
            {
              name: "isExternal",
              type: "checkbox",
              label: "Lien externe",
              defaultValue: false,
              admin: {
                description:
                  "Cochez si le lien mène vers un autre site",
              },
            },
          ],
        },
      ],
    },
    {
      name: "legalText",
      type: "textarea",
      label: "Mentions légales",
      localized: true,
      admin: {
        description: "Ligne de copyright en bas du site",
        placeholder: "© 2024 L'Instant Tranquille",
      },
    },
  ],
};
