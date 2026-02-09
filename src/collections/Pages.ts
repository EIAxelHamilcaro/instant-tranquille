import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateCollection } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const Pages: CollectionConfig = {
  slug: "pages",
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
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "heroTitle",
      type: "text",
      localized: true,
    },
    {
      name: "heroSubtitle",
      type: "text",
      localized: true,
    },
    {
      name: "content",
      type: "richText",
      localized: true,
    },
    {
      name: "seo",
      type: "group",
      fields: [
        {
          name: "metaTitle",
          type: "text",
          localized: true,
        },
        {
          name: "metaDescription",
          type: "textarea",
          localized: true,
        },
        {
          name: "ogImage",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
  ],
};
