import { charCount } from "@/lib/admin-fields";
import { headerTab, pageGlobal, sectionTextFields } from "./page-global";

const HINT_MAX = 120;
const SENT_TITLE_MAX = 60;
const SENT_TEXT_MAX = 240;

const ASKED_OPTIONS = [
  { label: "Ne pas demander", value: "hidden" },
  { label: "Demander, sans obliger", value: "optional" },
  { label: "Obligatoire pour envoyer", value: "required" },
];

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
      label: "Formulaire",
      description:
        "Ce que le voyageur remplit pour vous écrire, et ce qu'il lit une fois le message parti. Nom, e-mail et message sont toujours demandés.",
      fields: [
        {
          name: "form",
          type: "group",
          label: false,
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "phoneField",
                  type: "select",
                  label: "Téléphone",
                  required: true,
                  defaultValue: "optional",
                  options: ASKED_OPTIONS,
                  admin: {
                    isClearable: false,
                    width: "50%",
                    description:
                      "Un formulaire court est rempli plus volontiers : ne rendez le téléphone obligatoire que si vous rappelez vraiment.",
                  },
                },
                {
                  name: "datesField",
                  type: "select",
                  label: "Dates souhaitées",
                  required: true,
                  defaultValue: "optional",
                  options: ASKED_OPTIONS,
                  admin: {
                    isClearable: false,
                    width: "50%",
                    description:
                      "Avec les dates, vous pouvez répondre tout de suite sur les disponibilités.",
                  },
                },
              ],
            },
            {
              name: "datesHint",
              type: "text",
              label: "Phrase sous les dates",
              localized: true,
              maxLength: HINT_MAX,
              admin: {
                condition: (_, form) => form?.datesField !== "hidden",
                description:
                  "Le voyageur choisit son arrivée et son départ dans un calendrier. Cette phrase s'affiche juste en dessous. Laissez vide pour garder la phrase habituelle.",
                placeholder: "Dates souples ? Dites-le dans le message.",
                components: charCount(HINT_MAX),
              },
            },
            {
              name: "sentTitle",
              type: "text",
              label: "Titre affiché après l'envoi",
              localized: true,
              maxLength: SENT_TITLE_MAX,
              admin: {
                description: "Laissez vide pour garder « Message envoyé ».",
                placeholder: "Message envoyé",
                components: charCount(SENT_TITLE_MAX),
              },
            },
            {
              name: "sentText",
              type: "textarea",
              label: "Texte affiché après l'envoi",
              localized: true,
              maxLength: SENT_TEXT_MAX,
              admin: {
                description:
                  "Dites au voyageur sous combien de temps vous répondez. Laissez vide pour garder le texte habituel.",
                placeholder:
                  "Nous vous répondons à l'adresse e-mail que vous avez indiquée.",
                components: charCount(SENT_TEXT_MAX),
              },
            },
          ],
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
