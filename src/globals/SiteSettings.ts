import type { GlobalConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateGlobal } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Paramètres du site",
  hooks: revalidateGlobal("site-settings"),
  versions: { drafts: true, max: 25 },
  access: {
    read: isPublic,
    update: isAuthenticated,
  },
  admin: {
    livePreview: {
      url: ({ locale }) => previewUrl("/", { locale }),
    },
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      defaultValue: "L'Instant Tranquille",
    },
    {
      name: "tagline",
      type: "text",
      localized: true,
    },
    {
      name: "siteDescription",
      type: "textarea",
      localized: true,
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "contact",
      type: "group",
      fields: [
        { name: "email", type: "email" },
        { name: "phone", type: "text" },
        { name: "address", type: "textarea" },
        {
          name: "coordinates",
          type: "group",
          fields: [
            { name: "lat", type: "number" },
            { name: "lng", type: "number" },
          ],
        },
      ],
    },
    {
      name: "socialLinks",
      type: "group",
      fields: [
        { name: "facebook", type: "text" },
        { name: "instagram", type: "text" },
      ],
    },
    {
      name: "propertyDetails",
      type: "group",
      fields: [
        { name: "maxGuests", type: "number" },
        { name: "bedrooms", type: "number" },
        { name: "bathrooms", type: "number" },
        { name: "surface", type: "number", admin: { description: "En m²" } },
      ],
    },
    {
      name: "defaultSeo",
      type: "group",
      fields: [
        { name: "metaTitle", type: "text", localized: true },
        { name: "metaDescription", type: "textarea", localized: true },
        { name: "ogImage", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
