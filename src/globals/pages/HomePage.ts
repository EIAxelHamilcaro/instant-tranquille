import { note } from "@/lib/admin-fields";
import {
  headerTab,
  pageGlobal,
  sectionTextFields,
  sectionTitleField,
} from "./page-global";

export const HomePage = pageGlobal({
  slug: "home-page",
  label: "Accueil",
  path: "/",
  description:
    "La première page que voient les visiteurs. Les onglets suivent l'ordre de la page, de haut en bas.",
  tabs: [
    headerTab({
      titlePlaceholder: "Gîte en Sologne, à Romorantin-Lanthenay",
      titleNote:
        "Ce qui suit la première virgule s'affiche sur une seconde ligne.",
      photoNote: "Elle ne sert que si le film d'accueil ne peut pas se lancer.",
    }),
    {
      label: "La maison",
      description:
        "Le bloc qui présente la maison, au-dessus du défilé des pièces. Les pièces et leurs photos viennent de la page « Le gîte ».",
      fields: sectionTextFields({
        title: "houseTitle",
        text: "houseText",
        where: "du bloc « La maison »",
      }),
    },
    {
      label: "Les alentours",
      description:
        "Le bloc sombre avec la carte des temps de route, puis quatre lieux en photo.",
      fields: [
        ...sectionTextFields({
          title: "surroundingsTitle",
          text: "surroundingsText",
          where: "au-dessus de la carte des temps de route",
        }),
        {
          name: "featuredPlaces",
          type: "relationship",
          label: "Lieux montrés en photo",
          relationTo: "places",
          hasMany: true,
          maxRows: 4,
          admin: {
            description:
              "Quatre lieux affichés en grandes cartes sous la carte des temps de route. Choisissez des lieux qui ont une photo.",
          },
        },
      ],
    },
    {
      label: "Avis",
      description:
        "Le bloc des avis, sur le papier peint aux hérons. Les avis eux-mêmes se gèrent dans « Avis des voyageurs ».",
      fields: [
        sectionTitleField(
          "reviewsTitle",
          "Titre des avis",
          "Le titre au-dessus des avis des voyageurs.",
        ),
      ],
    },
    {
      label: "Guides",
      description: "Le bloc qui propose six guides de séjour.",
      fields: [
        ...sectionTextFields({
          title: "guidesTitle",
          text: "guidesText",
          where: "au-dessus des guides",
        }),
        {
          name: "featuredGuides",
          type: "relationship",
          label: "Guides mis en avant",
          relationTo: "guides",
          hasMany: true,
          maxRows: 6,
          admin: {
            description:
              "Six guides au plus, affichés dans cet ordre. Faites glisser pour changer l'ordre.",
          },
        },
      ],
    },
    {
      label: "Réservation",
      description:
        "Le dernier bloc, avec les boutons Airbnb et Booking et le résumé des prix.",
      fields: [
        ...sectionTextFields({
          title: "bookingTitle",
          text: "bookingText",
          where: "de l'appel à réserver",
        }),
        note(
          "pricesNote",
          "Un prix dans ce texte ?",
          "Si vous écrivez un prix ici, pensez à le corriger quand vous changez les tarifs. Les questions fréquentes affichées tout en bas de l'accueil se modifient dans « Le gîte et ses coordonnées », onglet « Questions fréquentes ».",
        ),
      ],
    },
  ],
});
