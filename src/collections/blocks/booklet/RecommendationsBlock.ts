import type { Block } from "payload";
import { sectionTitleField } from "./sectionTitleField";

export const RecommendationsBlock: Block = {
  slug: "recommendations",
  labels: {
    singular: "Recommandations locales",
    plural: "Recommandations locales",
  },
  fields: [
    sectionTitleField,
    {
      name: "items",
      type: "relationship",
      label: "Recommandations locales",
      relationTo: "local-recommendations",
      hasMany: true,
      admin: {
        description:
          "Choisissez les bonnes adresses à inclure dans ce livret",
      },
    },
  ],
};
