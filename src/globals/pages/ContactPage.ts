import { headerTab, pageGlobal, sectionTextFields } from "./page-global";

export const ContactPage = pageGlobal({
  slug: "contact-page",
  label: "Contact",
  path: "/contact",
  description:
    "Les textes de la page contact. Téléphone, e-mail, adresse et itinéraires se modifient dans « Le gîte et ses coordonnées ».",
  tabs: [
    headerTab({
      titlePlaceholder: "Contacter le gîte et venir à Romorantin",
    }),
    {
      label: "Mot des hôtes",
      description: "Le mot personnel affiché à gauche du formulaire.",
      fields: [
        {
          name: "hostsNote",
          type: "textarea",
          label: "Mot des hôtes",
          localized: true,
          maxLength: 320,
          admin: {
            description:
              "Deux phrases signées de vos prénoms. Un avis de voyageur sur l'accueil s'affiche juste en dessous.",
          },
        },
      ],
    },
    {
      label: "Réservation",
      description:
        "Le dernier bloc de la page, avec les boutons Airbnb et Booking.",
      fields: sectionTextFields({
        title: "bookingTitle",
        text: "bookingText",
        where: "de l'appel à réserver en bas de page",
      }),
    },
  ],
});
