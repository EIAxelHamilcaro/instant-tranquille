import type { Block } from "payload";
import { sectionTitleField } from "./sectionTitleField";

export const HouseRulesBlock: Block = {
  slug: "houseRules",
  labels: { singular: "Règlement intérieur", plural: "Règlement intérieur" },
  fields: [
    sectionTitleField,
    {
      name: "content",
      type: "richText",
      label: "Règlement intérieur",
      localized: true,
      admin: {
        description:
          "Règles de la maison : bruit, animaux, fumeurs, tri des déchets...",
      },
    },
  ],
};
