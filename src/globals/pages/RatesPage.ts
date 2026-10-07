import { rowLabel } from "@/lib/admin-fields";
import { headerTab, pageGlobal, sectionTitleField } from "./page-global";

const STEP_COUNT = 3;

export const RatesPage = pageGlobal({
  slug: "rates-page",
  label: "Tarifs et réservation (textes)",
  path: "/tarifs-reservation",
  description:
    "Les textes de la page tarifs. Les prix, les horaires et les conditions se modifient dans « Tarifs et conditions ».",
  tabs: [
    headerTab({
      titlePlaceholder: "Tarifs du gîte et réservation",
    }),
    {
      label: "Comment réserver",
      description:
        "Le bloc sombre qui explique la réservation en trois étapes.",
      fields: [
        sectionTitleField(
          "stepsTitle",
          "Titre",
          "Le titre du bloc « Comment réserver ».",
        ),
        {
          name: "directBooking",
          type: "richText",
          label: "Pourquoi réserver en direct",
          localized: true,
          admin: {
            description:
              "Le paragraphe à droite du titre : ce que les voyageurs gagnent à vous écrire directement.",
          },
        },
        {
          name: "steps",
          type: "array",
          label: "Étapes",
          labels: { singular: "Étape", plural: "Étapes" },
          minRows: STEP_COUNT,
          maxRows: STEP_COUNT,
          admin: {
            description:
              "Trois étapes exactement, affichées en trois colonnes dans cet ordre.",
            components: { RowLabel: rowLabel("{title}", "Étape") },
          },
          fields: [
            {
              name: "title",
              type: "text",
              label: "Titre de l'étape",
              required: true,
              localized: true,
              maxLength: 40,
            },
            {
              name: "text",
              type: "textarea",
              label: "Explication",
              required: true,
              localized: true,
              maxLength: 240,
              admin: {
                description:
                  "Deux phrases. Écrivez {sejour_minimum} pour afficher la durée minimale du séjour réglée dans « Tarifs et conditions ».",
              },
            },
          ],
        },
      ],
    },
  ],
});
