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
      "Les prix relevés sur Airbnb et Booking, les horaires d'arrivée et de départ, les conditions.",
    hideAPIURL: true,
    components: {
      elements: {
        Description: screenIntro(
          "La page « Tarifs et réservation », et le prix « à partir de » repris sur l'accueil.",
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
          label: "Prix relevés",
          description:
            "Le site affiche exactement les prix d'Airbnb et de Booking. Quand un prix change sur une plateforme, corrigez la ligne ici et mettez à jour la date du relevé.",
          fields: [
            {
              name: "currency",
              type: "text",
              defaultValue: "EUR",
              admin: { hidden: true },
            },
            {
              name: "quotes",
              type: "array",
              label: "Prix relevés sur Airbnb et Booking",
              labels: { singular: "Prix relevé", plural: "Prix relevés" },
              admin: {
                description:
                  "Une ligne par cas : un nombre de voyageurs et une durée. Le site calcule tout seul le prix par nuit.",
                components: {
                  RowLabel: rowLabel(
                    "{guests} voyageurs, {nights} nuits",
                    "Prix relevé",
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
                      admin: {
                        width: "50%",
                        description:
                          "Le nombre de voyageurs saisi dans la recherche sur la plateforme.",
                      },
                    },
                    {
                      name: "nights",
                      type: "select",
                      label: "Durée du séjour",
                      required: true,
                      options: [
                        { label: "2 nuits", value: "2" },
                        { label: "7 nuits (une semaine)", value: "7" },
                      ],
                      admin: {
                        width: "50%",
                        description:
                          "Le nombre de nuits saisi dans la recherche sur la plateforme.",
                      },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "airbnb",
                      type: "number",
                      label: "Prix total sur Airbnb (€)",
                      min: 0,
                      admin: {
                        width: "50%",
                        description:
                          "Recopiez le prix total affiché par Airbnb pour ce nombre de nuits et de voyageurs, taxes et frais inclus. Ne recopiez pas un prix en promotion (prix barré) : prenez le prix normal. Laissez vide si vous ne l'avez pas relevé.",
                      },
                    },
                    {
                      name: "booking",
                      type: "number",
                      label: "Prix total sur Booking (€)",
                      min: 0,
                      admin: {
                        width: "50%",
                        description:
                          "Recopiez le prix total affiché par Booking pour ce nombre de nuits et de voyageurs, taxes et frais inclus, au tarif avec annulation gratuite. Laissez vide si vous ne l'avez pas relevé.",
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
              name: "quotedOn",
              type: "date",
              label: "Prix relevés le",
              admin: {
                date: {
                  pickerAppearance: "dayOnly",
                  displayFormat: "d MMMM yyyy",
                },
                description:
                  "Le jour où vous avez recopié les prix. Cette date s'affiche sur le site à côté des prix.",
                components: help(
                  "Au bout de 90 jours, le résumé vous propose de relever les prix à nouveau. Si rien n'a changé sur Airbnb et Booking, mettez simplement la date du jour.",
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
                  "Le prix dépend du nombre de voyageurs et de la durée du séjour, pas de la saison.",
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
                  "À laisser vide tant que les prix des plateformes sont déjà taxes et frais inclus. N'ajoutez une ligne que pour un vrai supplément facturé en plus.",
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
