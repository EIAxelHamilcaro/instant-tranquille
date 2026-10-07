import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import {
  advanced,
  charCount,
  help,
  listCell,
  rowLabel,
  screenIntro,
} from "@/lib/admin-fields";
import { PLACE_CATEGORY_OPTIONS } from "@/lib/place-categories";
import { previewUrl } from "@/lib/preview-url";
import { revalidateCollection } from "@/lib/revalidate";
import { computeRoute, recalculateRoute } from "@/lib/routing/place-hooks";
import { computedNumber, validateUrl } from "@/lib/validators";

const SUMMARY_MAX = 220;

export const Places: CollectionConfig = {
  slug: "places",
  lockDocuments: false,
  labels: { singular: "Lieu", plural: "Lieux aux alentours" },
  hooks: {
    ...revalidateCollection("places"),
    beforeValidate: [computeRoute],
  },
  endpoints: [recalculateRoute],
  defaultSort: "driveMin",
  admin: {
    useAsTitle: "name",
    group: "Autour du gîte",
    description:
      "Tout ce qui se visite depuis le gîte : châteaux, sites équestres, sorties en famille, nature. Un lieu peut aussi être cité dans un guide.",
    defaultColumns: ["name", "category", "commune", "driveMin", "featured"],
    listSearchableFields: ["name", "commune"],
    pagination: { defaultLimit: 50 },
    hideAPIURL: true,
    components: {
      Description: screenIntro(
        "Chaque lieu a sa carte sur « Les alentours » et son point sur la carte des temps de route.",
        "/les-alentours",
      ),
    },
    livePreview: {
      url: ({ locale }) => previewUrl("/les-alentours", { locale }),
    },
  },
  access: {
    create: isAuthenticated,
    read: isPublic,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nom du lieu",
      required: true,
      localized: true,
      maxLength: 80,
      admin: {
        description:
          "Le nom officiel, tel qu'il est écrit sur le site du lieu.",
        placeholder: "Château de Cheverny",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "category",
          type: "select",
          label: "Catégorie",
          required: true,
          options: PLACE_CATEGORY_OPTIONS,
          admin: {
            description:
              "Range le lieu sur la page « Les alentours » et lui donne sa couleur sur les cartes.",
            width: "50%",
          },
        },
        {
          name: "commune",
          type: "text",
          label: "Commune",
          admin: {
            description: "La ville ou le village où se trouve le lieu.",
            placeholder: "Cheverny",
            width: "50%",
          },
        },
      ],
    },
    {
      name: "summary",
      type: "textarea",
      label: "En une phrase",
      localized: true,
      maxLength: SUMMARY_MAX,
      admin: {
        description:
          "Ce qu'on y fait ou ce qu'on y voit, en une phrase factuelle. Affichée sur la carte du lieu.",
        components: charCount(SUMMARY_MAX),
      },
    },
    {
      name: "image",
      type: "upload",
      label: "Photo",
      relationTo: "media",
      admin: {
        description:
          "Une photo du lieu, en largeur. Si elle n'est pas de vous, remplissez le crédit photo.",
      },
    },
    {
      type: "collapsible",
      label: "Temps de route et position",
      admin: {
        description:
          "Écrivez l'adresse du lieu : à l'enregistrement, le site trouve sa position et calcule seul le temps de route en voiture depuis le gîte. Le lieu se place alors sur la carte des temps de route.",
      },
      fields: [
        {
          name: "address",
          type: "text",
          label: "Adresse du lieu",
          maxLength: 200,
          admin: {
            description:
              "Le nom du lieu ou sa rue, puis la commune. Plus l'adresse est précise, plus la position est juste.",
            placeholder: "Château de Cheverny, 41700 Cheverny",
            components: help(
              "À l'enregistrement, le site cherche cette adresse sur une carte, puis calcule le trajet en voiture depuis le gîte. Si le temps affiché vous semble faux, précisez l'adresse (numéro, rue, code postal) et touchez « Recalculer ».",
            ),
          },
        },
        {
          name: "geocodedAddress",
          type: "text",
          admin: { hidden: true },
        },
        {
          type: "row",
          fields: [
            {
              name: "driveMin",
              type: "number",
              label: "Temps de route (minutes)",
              required: true,
              validate: computedNumber,
              min: 0,
              max: 240,
              admin: {
                description: "Calculé automatiquement depuis l'adresse.",
                readOnly: true,
                width: "50%",
                components: { Cell: listCell({ suffix: "min" }) },
              },
            },
            {
              name: "driveKm",
              type: "number",
              label: "Distance par la route (km)",
              required: true,
              validate: computedNumber,
              min: 0,
              max: 400,
              admin: {
                description: "Calculée automatiquement depuis l'adresse.",
                readOnly: true,
                width: "50%",
              },
            },
          ],
        },
        {
          name: "routeMessage",
          type: "text",
          label: "Dernier calcul",
          admin: {
            readOnly: true,
            condition: (data) => Boolean(data?.routeMessage),
          },
        },
        {
          name: "recalculate",
          type: "ui",
          admin: {
            components: { Field: "/components/payload/RecalculateRoute" },
          },
        },
        advanced([
          {
            type: "row",
            fields: [
              {
                name: "lat",
                type: "number",
                label: "Latitude",
                required: true,
                validate: computedNumber,
                min: -90,
                max: 90,
                admin: {
                  description:
                    "La position nord-sud du lieu. Trouvée automatiquement depuis l'adresse.",
                  placeholder: "47.5002",
                  width: "50%",
                  components: help(
                    "Si le lieu est mal placé sur la carte : ouvrez Google Maps, appuyez longuement sur le lieu (clic droit sur ordinateur). Deux nombres s'affichent, par exemple 47.5002, 1.4580. Le premier est la latitude, le second la longitude. Recopiez-les, puis cochez « Position corrigée à la main ».",
                  ),
                },
              },
              {
                name: "lng",
                type: "number",
                label: "Longitude",
                required: true,
                validate: computedNumber,
                min: -180,
                max: 180,
                admin: {
                  description:
                    "La position est-ouest du lieu : le second nombre donné par Google Maps.",
                  placeholder: "1.4580",
                  width: "50%",
                },
              },
            ],
          },
          {
            name: "positionLocked",
            type: "checkbox",
            label: "Position corrigée à la main",
            defaultValue: false,
            admin: {
              description:
                "Cochée, la latitude et la longitude ne sont plus jamais remplacées par le calcul automatique. Le temps de route reste calculé depuis cette position.",
            },
          },
        ]),
      ],
    },
    {
      name: "website",
      type: "text",
      label: "Site officiel",
      validate: validateUrl,
      admin: {
        description:
          "Affiché sur la carte du lieu et à la fin des guides qui le citent.",
        placeholder: "https://www.chateau-cheverny.fr",
      },
    },
    {
      name: "events",
      type: "array",
      label: "Grands rendez-vous",
      labels: { singular: "Rendez-vous", plural: "Rendez-vous" },
      admin: {
        description:
          "Les événements qui reviennent chaque année sur ce lieu (concours, salons, festivals).",
        initCollapsed: true,
        components: { RowLabel: rowLabel("{name}, {period}", "Rendez-vous") },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "name",
              type: "text",
              label: "Nom",
              required: true,
              localized: true,
              admin: {
                description: "Le nom de l'événement.",
                placeholder: "Generali Open de France",
                width: "60%",
              },
            },
            {
              name: "period",
              type: "text",
              label: "Période habituelle",
              localized: true,
              admin: {
                description: "Le mois ou la saison, sans année.",
                placeholder: "Juillet",
                width: "40%",
              },
            },
          ],
        },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Mettre en avant",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Le lieu défile dans le bandeau des temps de route, en haut de l'accueil et de la page « Les alentours ». Dix lieux au plus.",
        components: { Cell: listCell({ yes: "En avant" }) },
      },
    },
  ],
};
