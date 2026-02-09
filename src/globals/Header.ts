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
    livePreview: {
      url: ({ locale }) => previewUrl("/", { locale }),
    },
  },
  fields: [
    {
      name: "navItems",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true, localized: true },
        { name: "url", type: "text", required: true },
        { name: "isExternal", type: "checkbox", defaultValue: false },
        {
          name: "highlight",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Afficher comme bouton CTA" },
        },
      ],
    },
    {
      name: "ctaButton",
      type: "group",
      fields: [
        { name: "label", type: "text", localized: true },
        { name: "url", type: "text" },
      ],
    },
  ],
};
