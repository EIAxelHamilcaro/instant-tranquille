import crypto from "crypto";
import type { CollectionConfig } from "payload";
import { isAuthenticated, isActiveGuideOrAdmin } from "@/lib/access";
import { revalidateCollection } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";
import {
  ArrivalBlock,
  WifiBlock,
  HouseRulesBlock,
  EquipmentBlock,
  EmergencyBlock,
  RecommendationsBlock,
  CheckInOutBlock,
  MapBlock,
  CustomBlock,
} from "@/collections/blocks/booklet";

export const OnboardingGuides: CollectionConfig = {
  slug: "onboarding-guides",
  lockDocuments: false,
  labels: { singular: "Livret d'accueil", plural: "Livrets d'accueil" },
  versions: { drafts: true, maxPerDoc: 25 },
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
                readOnly: true,
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
                    date: { displayFormat: "dd/MM/yyyy" },
                  },
                },
                {
                  name: "validUntil",
                  type: "date",
                  label: "Valide jusqu'au",
                  admin: {
                    description: "Laisser vide = pas d'expiration",
                    date: { displayFormat: "dd/MM/yyyy" },
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
          label: "Sections du livret",
          fields: [
            {
              name: "sections",
              type: "blocks",
              label: "Sections du livret",
              blocks: [
                ArrivalBlock,
                WifiBlock,
                HouseRulesBlock,
                EquipmentBlock,
                EmergencyBlock,
                RecommendationsBlock,
                CheckInOutBlock,
                MapBlock,
                CustomBlock,
              ],
            },
          ],
        },
      ],
    },
  ],
};
