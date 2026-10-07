import type { Field } from "payload";
import { charCount } from "@/lib/admin-fields";
import { PLACE_CATEGORY_OPTIONS } from "@/lib/place-categories";
import { headerTab, pageGlobal, sectionTitleField } from "./page-global";

const HEADING_MAX = 80;

const categoryHeadings: Field[] = PLACE_CATEGORY_OPTIONS.filter(
  ({ value }) => value !== "equestre",
).map(({ value, label }) => ({
  name: value,
  type: "text",
  label,
  localized: true,
  maxLength: HEADING_MAX,
  admin: { components: charCount(HEADING_MAX) },
}));

export const SurroundingsPage = pageGlobal({
  slug: "surroundings-page",
  label: "Les alentours",
  path: "/les-alentours",
  description:
    "Que faire autour du gîte. Les lieux eux-mêmes se gèrent dans « Lieux aux alentours ».",
  tabs: [
    headerTab({
      titlePlaceholder: "Que faire autour de Romorantin, en Sologne",
    }),
    {
      label: "Présentation",
      description: "Le texte à côté de la carte des temps de route.",
      fields: [
        {
          name: "intro",
          type: "richText",
          label: "Présentation de la région",
          localized: true,
          admin: {
            description:
              "Où se trouve Romorantin et ce qu'on atteint dans chaque direction.",
          },
        },
      ],
    },
    {
      label: "Titres des catégories",
      description:
        "Le titre affiché au-dessus de chaque groupe de lieux. Une question, telle qu'un voyageur la taperait dans Google, fonctionne bien.",
      fields: [
        {
          name: "headings",
          type: "group",
          label: false,
          fields: categoryHeadings,
        },
      ],
    },
    {
      label: "Cavaliers",
      description:
        "Le bloc sombre réservé aux cavaliers, avec les sites équestres et leurs grands rendez-vous.",
      fields: [
        sectionTitleField(
          "equestrianTitle",
          "Titre",
          "Le titre du bloc pour les cavaliers.",
        ),
        {
          name: "equestrianText",
          type: "richText",
          label: "Texte",
          localized: true,
          admin: {
            description:
              "Ce qui intéresse un cavalier : distance du Parc équestre fédéral de Lamotte-Beuvron, stationnement du van, horaires d'arrivée souples.",
          },
        },
      ],
    },
  ],
});
