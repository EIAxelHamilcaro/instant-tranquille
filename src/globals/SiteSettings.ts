import type { GlobalConfig } from "payload";
import {
  isAuthenticated,
  isAuthenticatedField,
  isPublishedOrAuthenticated,
} from "@/lib/access";
import { charCount, note, rowLabel } from "@/lib/admin-fields";
import { previewUrl } from "@/lib/preview-url";
import { revalidateGlobal } from "@/lib/revalidate";
import {
  factCheckedTextarea,
  validateCalendarUrl,
  validatePhone,
  validateUrl,
} from "@/lib/validators";

const TAGLINE_MAX = 60;
const FILM_END_MAX = 70;
const DESCRIPTION_MAX = 320;

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  lockDocuments: false,
  label: "Le gîte et ses coordonnées",
  hooks: revalidateGlobal("site-settings"),
  versions: { drafts: true, max: 25 },
  access: {
    read: isPublishedOrAuthenticated,
    update: isAuthenticated,
  },
  admin: {
    group: "Réglages",
    description:
      "Tout ce qui décrit le gîte et sert sur plusieurs pages : capacité, coordonnées, annonces Airbnb et Booking, questions fréquentes.",
    livePreview: {
      url: ({ locale }) => previewUrl("/", { locale }),
    },
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "La maison",
          description:
            "Les chiffres de la maison. Ils s'affichent sur toutes les pages, dans Google et sur les images de partage.",
          fields: [
            note(
              "factsNote",
              "À ne changer que si la maison change",
              "Aujourd'hui : 115 m², 6 personnes, 3 chambres, 1 salle de bain. Ces chiffres doivent rester identiques à ceux de vos annonces Airbnb et Booking. Si un texte du site annonce un autre chiffre, l'enregistrement de ce texte est refusé.",
            ),
            {
              name: "propertyDetails",
              type: "group",
              label: "La maison en chiffres",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "surface",
                      type: "number",
                      label: "Surface (m²)",
                      required: true,
                      min: 20,
                      max: 500,
                      admin: { width: "25%" },
                    },
                    {
                      name: "maxGuests",
                      type: "number",
                      label: "Voyageurs au plus",
                      required: true,
                      min: 1,
                      max: 15,
                      admin: { width: "25%" },
                    },
                    {
                      name: "bedrooms",
                      type: "number",
                      label: "Chambres",
                      required: true,
                      min: 1,
                      max: 10,
                      admin: { width: "25%" },
                    },
                    {
                      name: "bathrooms",
                      type: "number",
                      label: "Salles de bain",
                      required: true,
                      min: 1,
                      max: 10,
                      admin: { width: "25%" },
                    },
                  ],
                },
                {
                  name: "petsAllowed",
                  type: "checkbox",
                  label: "Animaux acceptés",
                  admin: {
                    description:
                      "Affiché dans la fiche du gîte et dans les questions sur les tarifs.",
                  },
                },
              ],
            },
            {
              name: "siteDescription",
              type: "textarea",
              label: "Le gîte en un paragraphe",
              localized: true,
              maxLength: DESCRIPTION_MAX,
              validate: factCheckedTextarea,
              admin: {
                description:
                  "Ce paragraphe n'apparaît pas sur les pages : il décrit le gîte à Google et aux assistants comme ChatGPT.",
                components: charCount(DESCRIPTION_MAX),
              },
            },
          ],
        },
        {
          label: "Hôtes et coordonnées",
          description:
            "Affichés sur la page contact, en pied de page et dans Google.",
          fields: [
            {
              name: "hosts",
              type: "text",
              label: "Prénoms des hôtes",
              maxLength: 60,
              admin: {
                description:
                  "Affiché sur la page contact, en pied de page et sur la page tarifs.",
                placeholder: "Erick et Karine",
              },
            },
            {
              name: "contact",
              type: "group",
              label: "Coordonnées",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "email",
                      type: "email",
                      label: "E-mail",
                      admin: {
                        description:
                          "L'adresse affichée sur le site. Les messages du formulaire y arrivent aussi.",
                        placeholder: "contact@instant-tranquille.com",
                        width: "50%",
                      },
                    },
                    {
                      name: "phone",
                      type: "text",
                      label: "Téléphone",
                      validate: validatePhone,
                      admin: {
                        description:
                          "Laissez vide pour ne pas afficher de numéro.",
                        placeholder: "06 12 34 56 78",
                        width: "50%",
                      },
                    },
                  ],
                },
                {
                  name: "address",
                  type: "textarea",
                  label: "Numéro et rue",
                  admin: { placeholder: "23 rue de Loreux", rows: 2 },
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "postalCode",
                      type: "text",
                      label: "Code postal",
                      admin: { placeholder: "41200", width: "30%" },
                    },
                    {
                      name: "city",
                      type: "text",
                      label: "Ville",
                      admin: {
                        placeholder: "Romorantin-Lanthenay",
                        width: "70%",
                      },
                    },
                  ],
                },
                {
                  type: "collapsible",
                  label: "Position sur la carte",
                  admin: {
                    initCollapsed: true,
                    description:
                      "Le point de départ de tous les temps de route. À ne changer que si le repère de la carte est mal placé.",
                  },
                  fields: [
                    {
                      name: "coordinates",
                      type: "group",
                      label: false,
                      fields: [
                        {
                          type: "row",
                          fields: [
                            {
                              name: "lat",
                              type: "number",
                              label: "Latitude",
                              min: -90,
                              max: 90,
                              admin: {
                                description:
                                  "Clic droit sur la maison dans Google Maps : le premier nombre.",
                                width: "50%",
                              },
                            },
                            {
                              name: "lng",
                              type: "number",
                              label: "Longitude",
                              min: -180,
                              max: 180,
                              admin: {
                                description: "Le second nombre.",
                                width: "50%",
                              },
                            },
                          ],
                        },
                        {
                          type: "row",
                          fields: [
                            {
                              name: "zoom",
                              type: "number",
                              label: "Zoom de la carte",
                              defaultValue: 12,
                              min: 1,
                              max: 18,
                              admin: {
                                description:
                                  "Sur la page contact. 13 montre la ville, 16 montre la rue.",
                                width: "50%",
                              },
                            },
                            {
                              name: "markerLabel",
                              type: "text",
                              label: "Texte du repère",
                              admin: {
                                description:
                                  "Affiché quand on touche le repère de la carte.",
                                placeholder: "L'Instant Tranquille",
                                width: "50%",
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Venir au gîte",
          description:
            "Les itinéraires affichés sur la page contact, à côté de la carte.",
          fields: [
            {
              name: "accessRoutes",
              type: "array",
              label: "Itinéraires",
              labels: { singular: "Itinéraire", plural: "Itinéraires" },
              admin: {
                description: "Une ligne par ville de départ.",
                components: {
                  RowLabel: rowLabel("Depuis {from}, {duration}", "Itinéraire"),
                },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "from",
                      type: "text",
                      label: "Depuis",
                      required: true,
                      localized: true,
                      admin: { placeholder: "Paris", width: "40%" },
                    },
                    {
                      name: "duration",
                      type: "text",
                      label: "Durée",
                      required: true,
                      localized: true,
                      admin: { placeholder: "2h00", width: "30%" },
                    },
                    {
                      name: "distance",
                      type: "text",
                      label: "Distance",
                      required: true,
                      admin: { placeholder: "190 km", width: "30%" },
                    },
                  ],
                },
                {
                  name: "description",
                  type: "text",
                  label: "Par où passer",
                  required: true,
                  localized: true,
                  maxLength: 120,
                  admin: {
                    placeholder:
                      "A10 direction Orléans, puis sortie Blois / Sologne",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Annonces et notes",
          description:
            "Vos annonces Airbnb et Booking. Les boutons de réservation de tout le site y renvoient, et la note s'affiche avec les avis.",
          fields: [
            {
              name: "platforms",
              type: "array",
              label: "Vos annonces",
              labels: { singular: "Annonce", plural: "Annonces" },
              admin: {
                description:
                  "Une ligne par plateforme. Mettez la note et le nombre d'avis à jour quand ils changent sur la plateforme.",
                components: {
                  RowLabel: rowLabel(
                    "{platform}, {rating} sur {ratingScale}",
                    "Annonce",
                  ),
                },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "platform",
                      type: "select",
                      label: "Plateforme",
                      required: true,
                      options: [
                        { label: "Airbnb", value: "airbnb" },
                        { label: "Booking.com", value: "booking" },
                        { label: "Google", value: "google" },
                        { label: "Gîtes de France", value: "gites-de-france" },
                        { label: "Autre", value: "other" },
                      ],
                      admin: { width: "30%" },
                    },
                    {
                      name: "url",
                      type: "text",
                      label: "Adresse de l'annonce",
                      required: true,
                      validate: validateUrl,
                      admin: {
                        description:
                          "Ouvrez votre annonce et copiez l'adresse affichée en haut du navigateur.",
                        placeholder: "https://www.airbnb.fr/rooms/...",
                        width: "70%",
                      },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "rating",
                      type: "number",
                      label: "Note",
                      min: 0,
                      max: 10,
                      admin: { placeholder: "4.9", step: 0.1, width: "33%" },
                    },
                    {
                      name: "ratingScale",
                      type: "number",
                      label: "Sur",
                      defaultValue: 5,
                      min: 5,
                      max: 10,
                      admin: {
                        description: "5 pour Airbnb, 10 pour Booking.",
                        width: "33%",
                      },
                    },
                    {
                      name: "reviewCount",
                      type: "number",
                      label: "Nombre d'avis",
                      min: 0,
                      admin: { width: "33%" },
                    },
                  ],
                },
                {
                  name: "badge",
                  type: "text",
                  label: "Distinction",
                  localized: true,
                  maxLength: 40,
                  admin: {
                    description:
                      "Une distinction décernée par la plateforme, si vous en avez une.",
                    placeholder: "Coup de cœur voyageurs",
                  },
                },
              ],
            },
            {
              name: "calendars",
              type: "group",
              label: "Calendriers des disponibilités",
              access: {
                read: isAuthenticatedField,
                update: isAuthenticatedField,
              },
              admin: {
                description:
                  "Collez ici le lien d'export du calendrier de chaque plateforme : la page tarifs affiche alors les nuits libres et prises des prochains mois, mises à jour toutes les deux heures. Ces liens sont privés, ils ne sont jamais montrés aux visiteurs. Laissez vide pour ne pas afficher le calendrier.",
              },
              fields: [
                {
                  name: "airbnb",
                  type: "text",
                  label: "Lien du calendrier Airbnb",
                  validate: validateCalendarUrl,
                  admin: {
                    description:
                      "Sur Airbnb : Calendrier, Disponibilité, Connecter les calendriers, Exporter le calendrier. Copiez le lien qui finit par .ics.",
                    placeholder: "https://www.airbnb.fr/calendar/ical/...",
                  },
                },
                {
                  name: "booking",
                  type: "text",
                  label: "Lien du calendrier Booking.com",
                  validate: validateCalendarUrl,
                  admin: {
                    description:
                      "Sur l'extranet Booking : Tarifs et disponibilités, Synchroniser les calendriers, Exporter le calendrier. Copiez le lien proposé.",
                    placeholder: "https://ical.booking.com/v1/export?t=...",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Questions fréquentes",
          description:
            "Affichées en bas de la page d'accueil. Google peut les reprendre telles quelles dans ses résultats.",
          fields: [
            {
              name: "faqs",
              type: "array",
              label: "Questions fréquentes",
              labels: { singular: "Question", plural: "Questions" },
              admin: {
                description:
                  "Les questions que les voyageurs vous posent vraiment. Les questions sur les prix sont écrites automatiquement sur la page tarifs.",
                initCollapsed: true,
                components: { RowLabel: rowLabel("{question}", "Question") },
              },
              fields: [
                {
                  name: "question",
                  type: "text",
                  label: "Question",
                  required: true,
                  localized: true,
                  maxLength: 120,
                  admin: {
                    placeholder:
                      "Combien de personnes le gîte peut-il accueillir ?",
                  },
                },
                {
                  name: "answer",
                  type: "richText",
                  label: "Réponse",
                  required: true,
                  localized: true,
                  admin: {
                    description:
                      "Une réponse directe, en deux ou trois phrases.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Écran d'entrée et film",
          description:
            "Les deux phrases qui entourent le film : celle de l'écran d'entrée animé, avec le héron, et celle de la fin du film.",
          fields: [
            {
              name: "tagline",
              type: "text",
              label: "Accroche de l'écran d'entrée",
              localized: true,
              maxLength: TAGLINE_MAX,
              admin: {
                description:
                  "La ligne écrite sous le nom du gîte, à la première visite du site.",
                placeholder: "Gîte en Sologne, Romorantin-Lanthenay",
                components: charCount(TAGLINE_MAX),
              },
            },
            {
              name: "filmEndTitle",
              type: "text",
              label: "Phrase de fin du film",
              localized: true,
              maxLength: FILM_END_MAX,
              admin: {
                description:
                  "Affichée en grand quand le film se termine, au-dessus des boutons de réservation.",
                placeholder: "Et si votre prochain week-end commençait ici ?",
                components: charCount(FILM_END_MAX),
              },
            },
          ],
        },
        {
          label: "Réseaux sociaux",
          description:
            "Ces adresses ne s'affichent pas sur le site. Elles disent à Google que ces pages sont bien celles du gîte.",
          fields: [
            {
              name: "socialLinks",
              type: "group",
              label: false,
              fields: [
                {
                  name: "facebook",
                  type: "text",
                  label: "Page Facebook",
                  validate: validateUrl,
                  admin: {
                    placeholder: "https://www.facebook.com/linstanttranquille",
                  },
                },
                {
                  name: "instagram",
                  type: "text",
                  label: "Profil Instagram",
                  validate: validateUrl,
                  admin: {
                    placeholder: "https://www.instagram.com/linstanttranquille",
                  },
                },
                {
                  name: "pinterest",
                  type: "text",
                  label: "Profil Pinterest",
                  validate: validateUrl,
                },
                {
                  name: "youtube",
                  type: "text",
                  label: "Chaîne YouTube",
                  validate: validateUrl,
                },
                {
                  name: "tiktok",
                  type: "text",
                  label: "Profil TikTok",
                  validate: validateUrl,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
