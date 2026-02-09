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
    livePreview: {
      url: ({ locale }) => previewUrl("/", { locale }),
    },
  },
  fields: [
    {
      name: "description",
      type: "textarea",
      localized: true,
    },
    {
      name: "navColumns",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        {
          name: "links",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true, localized: true },
            { name: "url", type: "text", required: true },
            { name: "isExternal", type: "checkbox", defaultValue: false },
          ],
        },
      ],
    },
    {
      name: "legalText",
      type: "textarea",
      localized: true,
    },
  ],
};
