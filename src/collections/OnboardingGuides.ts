import crypto from "crypto";
import type { CollectionConfig } from "payload";
import { isAuthenticated, isActiveGuideOrAdmin } from "@/lib/access";
import { revalidateCollection } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const OnboardingGuides: CollectionConfig = {
  slug: "onboarding-guides",
  lockDocuments: false,
  labels: { singular: "Livret d'accueil", plural: "Livrets d'accueil" },
  hooks: {
    ...revalidateCollection("onboarding-guides"),
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === "create" && data && !data.accessToken) {
          data.accessToken = crypto.randomBytes(12).toString("hex");
        }
        return data;
      },
    ],
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        if (operation === "update" && originalDoc?.accessToken) {
          data.accessToken = originalDoc.accessToken;
        }
        return data;
      },
    ],
  },
  admin: {
    useAsTitle: "title",
    group: "Contenu",
    description: "Livrets d'accueil personnalisés pour les voyageurs",
    defaultColumns: ["title", "accessToken", "isActive", "updatedAt"],
    livePreview: {
      url: ({ data, locale }) => {
        const token = (data as Record<string, unknown>).accessToken as string | undefined;
        return previewUrl(`/livret-accueil/${token || ""}`, { locale });
      },
    },
  },
  access: {
    create: isAuthenticated,
    read: isActiveGuideOrAdmin,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: "isActive",
      type: "checkbox",
      label: "Livret actif",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description:
          "Décochez pour rendre ce livret temporairement inaccessible",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Informations",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Titre du livret",
              required: true,
              localized: true,
              admin: {
                description:
                  "Nom pour identifier ce livret (ex: Famille Dupont — Mars 2024)",
                placeholder: "Famille Dupont — Mars 2024",
              },
            },
            {
              name: "accessToken",
              type: "text",
              label: "Lien d'accès",
              required: true,
              unique: true,
              admin: {
                description:
                  "Token unique pour l'URL du livret (auto-généré à la création si laissé vide)",
                placeholder: "Laisser vide pour auto-générer",
              },
            },
            {
              type: "collapsible",
              label: "Dates de validité",
              admin: { initCollapsed: false },
              fields: [
                {
                  name: "validFrom",
                  type: "date",
                  label: "Valide à partir de",
                  admin: {
                    description: "Laisser vide = actif immédiatement",
                  },
                },
                {
                  name: "validUntil",
                  type: "date",
                  label: "Valide jusqu'au",
                  admin: {
                    description: "Laisser vide = pas d'expiration",
                  },
                },
              ],
            },
            {
              type: "collapsible",
              label: "Informations voyageur",
              admin: { initCollapsed: false },
              fields: [
                {
                  name: "guestName",
                  type: "text",
                  label: "Nom du voyageur",
                  admin: {
                    description: "Prénom et nom du voyageur principal",
                    placeholder: "Jean Dupont",
                  },
                },
                {
                  name: "guestEmail",
                  type: "email",
                  label: "Email du voyageur",
                  admin: {
                    description: "Pour envoyer le lien du livret",
                    placeholder: "jean.dupont@email.com",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Arrivée & Départ",
          fields: [
            {
              type: "collapsible",
              label: "Arrivée",
              admin: { initCollapsed: false },
              fields: [
                {
                  name: "arrivalInstructions",
                  type: "group",
                  label: { en: " ", fr: " " },
                  localized: true,
                  fields: [
                    {
                      name: "accessCode",
                      type: "text",
                      label: "Code d'accès",
                      admin: {
                        description: "Code d'accès au logement",
                        placeholder: "1234#",
                      },
                    },
                    {
                      name: "instructions",
                      type: "richText",
                      label: "Instructions détaillées",
                      admin: {
                        description:
                          "Expliquez pas à pas comment entrer dans le gîte",
                      },
                    },
                    {
                      name: "parkingInfo",
                      type: "textarea",
                      label: "Informations parking",
                      admin: {
                        description: "Où et comment se garer",
                        placeholder: "2 places devant le gîte",
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: "collapsible",
              label: "Check-in / Check-out",
              admin: { initCollapsed: false },
              fields: [
                {
                  name: "checkInInstructions",
                  type: "richText",
                  label: "Procédure d'arrivée (check-in)",
                  localized: true,
                  admin: {
                    description:
                      "Informations pour le jour d'arrivée : horaires, accueil, remise des clés",
                  },
                },
                {
                  name: "checkOutInstructions",
                  type: "richText",
                  label: "Procédure de départ (check-out)",
                  localized: true,
                  admin: {
                    description:
                      "Ce qu'il faut faire avant de partir : horaire, clés, poubelles...",
                  },
                },
              ],
            },
            {
              type: "collapsible",
              label: "WiFi",
              admin: { initCollapsed: false },
              fields: [
                {
                  name: "wifiInfo",
                  type: "group",
                  label: { en: " ", fr: " " },
                  fields: [
                    {
                      name: "networkName",
                      type: "text",
                      label: "Nom du réseau",
                      admin: {
                        description:
                          "Nom qui apparaît dans la liste des Wi-Fi",
                        placeholder: "InstantTranquille_Wifi",
                      },
                    },
                    {
                      name: "password",
                      type: "text",
                      label: "Mot de passe Wi-Fi",
                      admin: {
                        description: "Code à taper pour se connecter",
                        placeholder: "Sologne2024!",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Logement",
          fields: [
            {
              type: "collapsible",
              label: "Règlement",
              admin: { initCollapsed: false },
              fields: [
                {
                  name: "houseRules",
                  type: "richText",
                  label: "Règlement intérieur",
                  localized: true,
                  admin: {
                    description:
                      "Règles de la maison : bruit, animaux, fumeurs, tri des déchets...",
                  },
                },
              ],
            },
            {
              type: "collapsible",
              label: "Équipements",
              admin: { initCollapsed: false },
              fields: [
                {
                  name: "equipmentGuide",
                  type: "array",
                  label: "Guide des équipements",
                  localized: true,
                  admin: {
                    description:
                      "Mode d'emploi des appareils : machine à café, cheminée, lave-linge...",
                  },
                  fields: [
                    {
                      name: "name",
                      type: "text",
                      label: "Nom de l'appareil",
                      required: true,
                      admin: {
                        description: "Quel équipement",
                        placeholder: "Machine à café Nespresso",
                      },
                    },
                    {
                      name: "instructions",
                      type: "richText",
                      label: "Mode d'emploi",
                      admin: {
                        description:
                          "Expliquez comment utiliser cet appareil",
                      },
                    },
                    {
                      name: "photo",
                      type: "upload",
                      label: "Photo",
                      relationTo: "media",
                      admin: {
                        description:
                          "Pour aider le voyageur à repérer l'appareil (optionnel)",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Contacts & Recommandations",
          fields: [
            {
              type: "collapsible",
              label: "Contacts d'urgence",
              admin: { initCollapsed: false },
              fields: [
                {
                  name: "emergencyContacts",
                  type: "array",
                  label: "Contacts d'urgence",
                  admin: {
                    description:
                      "Numéros utiles pendant le séjour",
                  },
                  fields: [
                    {
                      name: "name",
                      type: "text",
                      label: "Nom",
                      required: true,
                      admin: {
                        description:
                          "Nom de la personne ou du service",
                        placeholder: "Marie (propriétaire)",
                      },
                    },
                    {
                      name: "role",
                      type: "text",
                      label: "Rôle",
                      localized: true,
                      admin: {
                        description: "Fonction ou spécialité",
                        placeholder: "Propriétaire",
                      },
                    },
                    {
                      name: "phone",
                      type: "text",
                      label: "Téléphone",
                      required: true,
                      admin: {
                        description: "Numéro à appeler",
                        placeholder: "+33 6 12 34 56 78",
                      },
                    },
                    {
                      name: "available",
                      type: "text",
                      label: "Disponibilité",
                      localized: true,
                      admin: {
                        description: "Quand peut-on appeler",
                        placeholder: "Tous les jours 8h-22h",
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: "collapsible",
              label: "Recommandations locales",
              admin: { initCollapsed: false },
              fields: [
                {
                  name: "localRecommendations",
                  type: "relationship",
                  label: "Recommandations locales",
                  relationTo: "local-recommendations",
                  hasMany: true,
                  admin: {
                    description:
                      "Choisissez les bonnes adresses à inclure dans ce livret",
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
