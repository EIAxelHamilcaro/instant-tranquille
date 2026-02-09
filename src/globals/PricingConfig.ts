import type { GlobalConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateGlobal } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const PricingConfig: GlobalConfig = {
  slug: "pricing-config",
  label: "Tarifs & Réservation",
  hooks: revalidateGlobal("pricing-config"),
  versions: { drafts: true, max: 25 },
  access: {
    read: isPublic,
    update: isAuthenticated,
  },
  admin: {
    group: "Configuration",
    description:
      "Tarifs par saison, frais supplémentaires et conditions de réservation",
    livePreview: {
      url: ({ locale }) => previewUrl("/tarifs-reservation", { locale }),
    },
  },
  fields: [
    {
      name: "currency",
      type: "text",
      label: "Devise",
      defaultValue: "EUR",
      admin: {
        description: "Code de la monnaie utilisée (EUR = Euro)",
      },
    },
    {
      name: "seasons",
      type: "array",
      label: "Saisons tarifaires",
      admin: {
        description:
          "Définissez vos tarifs par période de l'année",
      },
      fields: [
        {
          name: "name",
          type: "text",
          label: "Nom de la saison",
          required: true,
          localized: true,
          admin: {
            description: "Comment s'appelle cette période",
            placeholder: "Basse saison",
          },
        },
        {
          name: "dateRange",
          type: "group",
          label: "Période",
          admin: {
            description: "Dates de début et fin",
          },
          fields: [
            {
              name: "start",
              type: "text",
              label: "Début",
              required: true,
              admin: {
                description: "Quand commence cette saison",
                placeholder: "1er novembre",
              },
            },
            {
              name: "end",
              type: "text",
              label: "Fin",
              required: true,
              admin: {
                description: "Quand se termine cette saison",
                placeholder: "31 mars",
              },
            },
          ],
        },
        {
          name: "nightlyRate",
          type: "number",
          label: "Tarif / nuit",
          admin: {
            description: "Prix par nuit en euros",
          },
        },
        {
          name: "weeklyRate",
          type: "number",
          label: "Tarif / semaine",
          admin: {
            description: "Prix pour 7 nuits en euros",
          },
        },
        {
          name: "minimumStay",
          type: "number",
          label: "Séjour minimum",
          defaultValue: 2,
          admin: {
            description:
              "Nombre minimum de nuits pour réserver",
          },
        },
        {
          name: "color",
          type: "select",
          label: "Couleur",
          admin: {
            description:
              "Couleur pour identifier cette saison sur le calendrier",
          },
          options: [
            { label: "Vert (Basse saison)", value: "green" },
            { label: "Orange (Moyenne saison)", value: "orange" },
            { label: "Rouge (Haute saison)", value: "red" },
            { label: "Violet (Très haute saison)", value: "purple" },
          ],
        },
      ],
    },
    {
      name: "additionalFees",
      type: "array",
      label: "Frais supplémentaires",
      admin: {
        description:
          "Frais en plus du loyer (ménage, taxe de séjour, linge...)",
      },
      fields: [
        {
          name: "name",
          type: "text",
          label: "Intitulé",
          required: true,
          localized: true,
          admin: {
            description: "De quoi s'agit-il",
            placeholder: "Ménage de fin de séjour",
          },
        },
        {
          name: "amount",
          type: "number",
          label: "Montant (€)",
          admin: {
            description: "Prix en euros",
          },
        },
        {
          name: "type",
          type: "select",
          label: "Mode de calcul",
          admin: {
            description:
              "Par séjour = 1 fois, par nuit = chaque nuit, par personne = par voyageur",
          },
          options: [
            { label: "Par séjour", value: "per_stay" },
            { label: "Par nuit", value: "per_night" },
            { label: "Par personne", value: "per_person" },
          ],
        },
        {
          name: "description",
          type: "text",
          label: "Précisions",
          localized: true,
          admin: {
            description: "Détails affichés aux voyageurs",
            placeholder: "Obligatoire",
          },
        },
      ],
    },
    {
      name: "bookingLinks",
      type: "group",
      label: "Liens de réservation",
      admin: {
        description:
          "Adresses de vos annonces sur les plateformes de location",
      },
      fields: [
        {
          name: "airbnb",
          type: "text",
          label: "Annonce Airbnb",
          admin: {
            description: "Lien complet de votre annonce Airbnb",
            placeholder: "https://www.airbnb.fr/rooms/...",
          },
        },
        {
          name: "booking",
          type: "text",
          label: "Annonce Booking",
          admin: {
            description:
              "Lien complet de votre annonce Booking.com",
            placeholder: "https://www.booking.com/hotel/...",
          },
        },
        {
          name: "email",
          type: "email",
          label: "Email réservation",
          admin: {
            description:
              "Email dédié aux réservations directes",
            placeholder: "contact@linstant-tranquille.fr",
          },
        },
      ],
    },
    {
      name: "policies",
      type: "group",
      label: "Conditions de réservation",
      admin: {
        description:
          "Règles, horaires et politiques de location",
      },
      fields: [
        {
          name: "cancellation",
          type: "richText",
          label: "Politique d'annulation",
          localized: true,
          admin: {
            description:
              "Conditions et délais d'annulation, remboursements",
          },
        },
        {
          name: "deposit",
          type: "richText",
          label: "Acompte et caution",
          localized: true,
          admin: {
            description:
              "Montant de l'acompte, de la caution, et modalités de paiement",
          },
        },
        {
          name: "checkIn",
          type: "text",
          label: "Heure d'arrivée",
          localized: true,
          admin: {
            description:
              "À partir de quelle heure les voyageurs peuvent arriver",
            placeholder: "À partir de 16h00",
          },
        },
        {
          name: "checkOut",
          type: "text",
          label: "Heure de départ",
          localized: true,
          admin: {
            description:
              "Avant quelle heure les voyageurs doivent partir",
            placeholder: "Avant 10h00",
          },
        },
        {
          name: "additional",
          type: "richText",
          label: "Conditions supplémentaires",
          localized: true,
          admin: {
            description:
              "Autres informations importantes (ménage, linge, animaux...)",
          },
        },
      ],
    },
  ],
};
