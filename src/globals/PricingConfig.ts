import type { GlobalConfig } from "payload";
import { isAuthenticated, isPublishedOrAuthenticated } from "@/lib/access";
import { help, rowLabel, screenIntro } from "@/lib/admin-fields";
import { previewUrl } from "@/lib/preview-url";
import { revalidateGlobal } from "@/lib/revalidate";

export const PricingConfig: GlobalConfig = {
  slug: "pricing-config",
  lockDocuments: false,
  label: "Tarifs et conditions",
  hooks: revalidateGlobal("pricing-config"),
  versions: { drafts: true, max: 25 },
  access: {
    read: isPublishedOrAuthenticated,
    update: isAuthenticated,
  },
  admin: {
    group: "Avis et réservations",
    description:
      "Votre prix de base par nuit, les horaires d'arrivée et de départ, les conditions.",
    hideAPIURL: true,
    components: {
      elements: {
        Description: screenIntro(
          "La page « Tarifs et réservation », et vos prix de base repris sur l'accueil et sur la page du gîte.",
          "/tarifs-reservation",
        ),
      },
    },
    livePreview: {
      url: ({ locale }) => previewUrl("/tarifs-reservation", { locale }),
    },
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Prix de base",
          description:
            "Votre prix de base par nuit : celui que vous fixez, avant les frais de service de la plateforme et la taxe de séjour. Le site l'affiche tel quel et renvoie vers Airbnb et Booking pour le total d'un séjour.",
          fields: [
            {
              name: "currency",
              type: "text",
              defaultValue: "EUR",
              admin: { hidden: true },
            },
            {
              name: "nightlyRates",
              type: "array",
              label: "Prix de base par nuit",
              labels: { singular: "Prix de base", plural: "Prix de base" },
              admin: {
                description:
                  "Une ligne par nombre de voyageurs : 2, 4 et 6. Écrivez le prix d'une seule nuit, celui que vous avez réglé sur Airbnb et Booking, sans les frais de service ni la taxe de séjour. Le site ne calcule aucun total : il affiche ces prix et précise que la plateforme ajoute ses frais.",
                components: {
                  RowLabel: rowLabel(
                    "{guests} voyageurs : {price} € la nuit",
                    "Prix de base",
                  ),
                },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "guests",
                      type: "select",
                      label: "Nombre de voyageurs",
                      required: true,
                      options: [
                        { label: "2 voyageurs", value: "2" },
                        { label: "4 voyageurs", value: "4" },
                        { label: "6 voyageurs", value: "6" },
                      ],
                      admin: { width: "50%" },
                    },
                    {
                      name: "price",
                      type: "number",
                      label: "Prix de base pour une nuit (€)",
                      required: true,
                      min: 0,
                      admin: {
                        width: "50%",
                        description: "En euros, sans le symbole.",
                        placeholder: "110",
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: "minimumStay",
              type: "number",
              label: "Séjour minimum (nuits)",
              defaultValue: 2,
              min: 1,
              admin: {
                description:
                  "Le plus petit nombre de nuits que les plateformes acceptent.",
                placeholder: "2",
                components: help(
                  "Ce nombre sert aussi au calendrier des disponibilités : un trou plus court que le séjour minimum entre deux réservations est affiché comme pris, puisque personne ne peut le réserver.",
                ),
              },
            },
            {
              name: "note",
              type: "textarea",
              label: "Le prix change-t-il selon la saison ?",
              localized: true,
              admin: {
                description:
                  "Votre réponse à cette question, en une ou deux phrases. Elle s'affiche dans les questions fréquentes de la page tarifs. Laissez vide pour retirer la question.",
                placeholder:
                  "Le prix de base dépend du nombre de voyageurs, pas de la saison.",
              },
            },
          ],
        },
        {
          label: "Frais supplémentaires",
          fields: [
            {
              name: "additionalFees",
              type: "array",
              label: "Frais supplémentaires",
              labels: { singular: "Frais", plural: "Frais" },
              admin: {
                components: { RowLabel: rowLabel("{name}", "Frais") },
                description:
                  "Un supplément que vous facturez vous-même en plus du prix de base, comme le ménage. Les frais de service de la plateforme et la taxe de séjour n'ont pas leur place ici : le site les annonce déjà.",
              },
              fields: [
                {
                  name: "name",
                  type: "text",
                  label: "Intitulé",
                  required: true,
                  localized: true,
                  admin: {
                    description:
                      "Le nom du supplément, tel qu'il s'affiche sur la page tarifs.",
                    placeholder: "Ménage de fin de séjour",
                  },
                },
                {
                  name: "amount",
                  type: "number",
                  label: "Montant (€)",
                  required: true,
                  min: 0,
                  admin: {
                    description: "En euros, sans le symbole.",
                    placeholder: "60",
                  },
                },
                {
                  name: "type",
                  type: "select",
                  label: "Mode de calcul",
                  admin: {
                    description:
                      "Par séjour : compté une fois. Par nuit : compté chaque nuit. Par personne : compté pour chaque voyageur.",
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
                    description:
                      "Une précision affichée sous le montant. Facultatif.",
                    placeholder: "Obligatoire",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Horaires et conditions",
          description:
            "Les heures d'arrivée et de départ, puis les trois blocs « Conditions de réservation » de la page tarifs.",
          fields: [
            {
              name: "policies",
              type: "group",
              label: false,
              fields: [
                {
                  name: "cancellation",
                  type: "richText",
                  label: "Politique d'annulation",
                  localized: true,
                  admin: {
                    description:
                      "Jusqu'à quand un voyageur peut annuler et ce qui lui est remboursé.",
                  },
                },
                {
                  name: "deposit",
                  type: "richText",
                  label: "Acompte et caution",
                  localized: true,
                  admin: {
                    description:
                      "Le montant de l'acompte et de la caution, et la façon de les régler.",
                  },
                },
                {
                  name: "checkIn",
                  type: "text",
                  label: "Heure d'arrivée",
                  localized: true,
                  admin: {
                    description:
                      "Affichée sur la page tarifs après le mot « Arrivée ». Écrivez l'heure en chiffres, avec un h : Google la lit aussi.",
                    placeholder: "À partir de 17h00",
                  },
                },
                {
                  name: "checkOut",
                  type: "text",
                  label: "Heure de départ",
                  localized: true,
                  admin: {
                    description:
                      "Affichée sur la page tarifs après le mot « Départ ». Écrivez l'heure en chiffres, avec un h : Google la lit aussi.",
                    placeholder: "Avant 10h00",
                  },
                },
                {
                  name: "additional",
                  type: "richText",
                  label: "À savoir avant de réserver",
                  localized: true,
                  admin: {
                    description:
                      "Ce qu'il faut savoir avant de réserver : ménage, linge, animaux.",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
