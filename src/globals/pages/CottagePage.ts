import { rowLabel } from "@/lib/admin-fields";
import { headerTab, pageGlobal, photoListField } from "./page-global";

export const CottagePage = pageGlobal({
  slug: "cottage-page",
  label: "Le gîte",
  path: "/le-gite",
  description:
    "La visite de la maison, pièce par pièce. Les équipements se gèrent dans « Équipements du gîte ».",
  tabs: [
    headerTab({
      titlePlaceholder: "Une maison de 115 m² pour 6 personnes à Romorantin",
    }),
    {
      label: "Présentation",
      description: "Le texte sous les chiffres clés de la maison.",
      fields: [
        {
          name: "description",
          type: "richText",
          label: "Présentation de la maison",
          localized: true,
          admin: {
            description:
              "Deux paragraphes suffisent : ce qu'est la maison, où elle se trouve, ce qui la rend agréable.",
          },
        },
      ],
    },
    {
      label: "Pièces",
      description:
        "La visite. Ces pièces défilent aussi en photos sur la page d'accueil.",
      fields: [
        {
          name: "rooms",
          type: "array",
          label: "Pièces",
          labels: { singular: "Pièce", plural: "Pièces" },
          admin: {
            description:
              "Une ligne par pièce ou par espace (séjour, cuisine, chaque chambre, jardin). L'ordre est celui de la visite : faites glisser une ligne pour la déplacer.",
            initCollapsed: true,
            components: { RowLabel: rowLabel("{name}", "Pièce") },
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "name",
                  type: "text",
                  label: "Nom de la pièce",
                  required: true,
                  localized: true,
                  maxLength: 40,
                  admin: { placeholder: "La chambre forêt", width: "60%" },
                },
                {
                  name: "level",
                  type: "select",
                  label: "Niveau",
                  defaultValue: "ground",
                  options: [
                    { label: "Rez-de-chaussée", value: "ground" },
                    { label: "Étage", value: "upstairs" },
                    { label: "Dehors", value: "outdoors" },
                  ],
                  admin: {
                    description: "Range la pièce au bon étage de la visite.",
                    width: "40%",
                  },
                },
              ],
            },
            {
              name: "details",
              type: "text",
              label: "En bref",
              localized: true,
              maxLength: 80,
              admin: {
                description:
                  "Le couchage ou l'équipement principal, affiché sous le nom de la pièce.",
                placeholder: "1 lit double",
              },
            },
            {
              name: "description",
              type: "textarea",
              label: "Description",
              localized: true,
              maxLength: 320,
              admin: {
                description: "Deux phrases au plus, à côté des photos.",
              },
            },
            photoListField(
              "photos",
              "Photos",
              "Une à trois photos. La première sert aussi sur la page d'accueil.",
              3,
            ),
          ],
        },
      ],
    },
    {
      label: "Autres photos",
      description: "La mosaïque de détails et d'ambiances, en bas de la page.",
      fields: [
        photoListField(
          "gallery",
          "Autres photos",
          "Détails de décoration et ambiances qui ne sont rattachés à aucune pièce.",
        ),
      ],
    },
  ],
});
