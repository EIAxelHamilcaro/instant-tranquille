import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateCollection } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const Pages: CollectionConfig = {
  slug: "pages",
  lockDocuments: false,
  labels: { singular: "Page", plural: "Pages" },
  hooks: revalidateCollection("pages"),
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  admin: {
    useAsTitle: "title",
    group: "Contenu",
    description: "Pages principales du site (Accueil, Le Gîte, etc.)",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    livePreview: {
      url: ({ data, locale }) => {
        const slug = (data as Record<string, unknown>).slug as string | undefined;
        const path = !slug || slug === "home" ? "/" : `/${slug}`;
        return previewUrl(path, { locale });
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
      label: "Titre de la page",
      required: true,
      localized: true,
      admin: {
        description:
          "Titre principal affiché en haut de la page",
      },
    },
    {
      name: "slug",
      type: "text",
      label: "Adresse URL",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description:
          "Identifiant pour l'URL (minuscules, tirets, pas d'espaces ni accents). Ne pas modifier sauf si nécessaire",
        placeholder: "le-gite",
      },
    },
    {
      name: "heroImage",
      type: "upload",
      label: "Image de bannière",
      relationTo: "media",
      admin: {
        description:
          "Grande image affichée en haut de la page (1920×1080 recommandé)",
      },
    },
    {
      name: "heroTitle",
      type: "text",
      label: "Titre de la bannière",
      localized: true,
      admin: {
        description: "Grand titre sur l'image de bannière",
      },
    },
    {
      name: "heroSubtitle",
      type: "text",
      label: "Sous-titre de la bannière",
      localized: true,
      admin: {
        description:
          "Texte affiché sous le titre de la bannière",
      },
    },
    {
      name: "content",
      type: "richText",
      label: "Contenu de la page",
      localized: true,
      admin: {
        description:
          "Texte principal de la page. Utilisez la barre d'outils pour mettre en forme",
      },
    },
    {
      name: "seo",
      type: "group",
      label: "Référencement (SEO)",
      admin: {
        description:
          "Ces champs améliorent la visibilité sur Google et les réseaux sociaux",
      },
      fields: [
        {
          name: "metaTitle",
          type: "text",
          label: "Titre Google",
          localized: true,
          admin: {
            description:
              "Titre affiché dans les résultats Google (50-60 caractères). Laissez vide pour utiliser le titre de la page",
            placeholder:
              "L'Instant Tranquille — Gîte en Sologne",
          },
        },
        {
          name: "metaDescription",
          type: "textarea",
          label: "Description Google",
          localized: true,
          admin: {
            description:
              "Texte affiché sous le titre dans Google (150-160 caractères). Donnez envie de cliquer !",
            placeholder:
              "Découvrez notre gîte de charme au cœur de la Sologne...",
          },
        },
        {
          name: "ogImage",
          type: "upload",
          label: "Image de partage",
          relationTo: "media",
          admin: {
            description:
              "Image affichée quand la page est partagée sur Facebook ou Twitter (1200×630 recommandé)",
          },
        },
      ],
    },
  ],
};
