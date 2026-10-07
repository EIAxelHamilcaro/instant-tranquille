import {
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig, FieldHook } from "payload";
import { GuideProgramme } from "@/collections/blocks/GuideProgramme";
import { isAuthenticated } from "@/lib/access";
import {
  advanced,
  charCount,
  help,
  rowLabel,
  screenIntro,
} from "@/lib/admin-fields";
import {
  redirectFormerSlug,
  rememberLiveSlug,
} from "@/lib/guide-redirect-hooks";
import { GUIDE_THEME_OPTIONS } from "@/lib/place-categories";
import { previewUrl } from "@/lib/preview-url";
import { revalidateCollection } from "@/lib/revalidate";
import {
  factCheckedTextarea,
  validateSlug,
  validateUrl,
} from "@/lib/validators";

const TITLE_MAX = 90;
const EXCERPT_MAX = 240;
const SLUG_MAX = 70;

const slugFromTitle: FieldHook = ({ value, data }) => {
  if (value || data?._status !== "published") return value;
  if (typeof data.title !== "string") return value;

  return data.title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, SLUG_MAX)
    .replace(/^-|-$/g, "");
};

const guideCache = revalidateCollection("guides");

export const Guides: CollectionConfig = {
  slug: "guides",
  lockDocuments: false,
  trash: true,
  labels: { singular: "Guide", plural: "Guides de séjour" },
  hooks: {
    beforeChange: [rememberLiveSlug],
    afterChange: [...guideCache.afterChange, redirectFormerSlug],
    afterDelete: guideCache.afterDelete,
  },
  versions: { drafts: { autosave: { interval: 2000 } }, maxPerDoc: 15 },
  admin: {
    useAsTitle: "title",
    group: "Autour du gîte",
    description:
      "Des articles pratiques pour les voyageurs : châteaux, Beauval, séjours équestres, nature. Ils aident le site à être trouvé sur Google.",
    defaultColumns: ["title", "theme", "_status", "updatedAt"],
    listSearchableFields: ["title", "slug"],
    pagination: { defaultLimit: 50 },
    hideAPIURL: true,
    components: {
      Description: screenIntro(
        "Chaque guide publié a sa propre page, rangée dans « Guides ». Un brouillon reste invisible.",
        "/guides",
      ),
    },
    livePreview: {
      url: ({ data, locale }) =>
        typeof data.slug === "string" && data.slug
          ? previewUrl("/guides/[slug]", {
              locale,
              params: { slug: data.slug },
            })
          : previewUrl("/guides", { locale }),
    },
  },
  access: {
    create: isAuthenticated,
    read: ({ req: { user } }) =>
      user ? true : { _status: { equals: "published" } },
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Le guide",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Titre",
              required: true,
              localized: true,
              maxLength: TITLE_MAX,
              admin: {
                description:
                  "La question à laquelle le guide répond, avec le nom du lieu. C'est le grand titre de la page.",
                placeholder: "Visiter le ZooParc de Beauval depuis Romorantin",
                components: charCount(TITLE_MAX),
              },
            },
            {
              name: "excerpt",
              type: "textarea",
              label: "Résumé",
              required: true,
              localized: true,
              maxLength: EXCERPT_MAX,
              validate: factCheckedTextarea,
              admin: {
                description:
                  "Deux phrases qui répondent tout de suite à la question du voyageur. Affiché en tête du guide et dans les listes de guides.",
                components: charCount(EXCERPT_MAX),
              },
            },
            {
              name: "image",
              type: "upload",
              label: "Photo",
              relationTo: "media",
              admin: {
                description:
                  "Affichée en tête du guide et sur sa carte dans les listes.",
              },
            },
            {
              name: "body",
              type: "richText",
              label: "Texte du guide",
              required: true,
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  BlocksFeature({ blocks: [GuideProgramme] }),
                  EXPERIMENTAL_TableFeature(),
                ],
              }),
              admin: {
                description:
                  "Découpez le texte avec des titres de niveau 2 : ils forment le sommaire du guide. Le bouton « + » ajoute un programme heure par heure ou un tableau (tarifs, comparatif). Citez les temps de route depuis le gîte.",
                components: help(
                  "Pour faire un titre : écrivez la ligne, sélectionnez-la, puis choisissez « Titre 2 » dans la barre au-dessus du texte. Un guide se lit bien avec quatre à six titres.",
                ),
              },
            },
          ],
        },
        {
          label: "En bref et sources",
          description:
            "L'encadré pratique affiché en haut du guide, puis les pages qui ont servi à vérifier les informations.",
          fields: [
            {
              name: "practical",
              type: "array",
              label: "L'essentiel en bref",
              labels: { singular: "Ligne", plural: "Lignes" },
              maxRows: 8,
              admin: {
                description:
                  "Quatre à six lignes que le voyageur cherche en premier : durée, budget, meilleure période, à réserver, stationnement, avec un chien.",
                initCollapsed: true,
                components: { RowLabel: rowLabel("{label}", "Ligne") },
              },
              fields: [
                {
                  name: "label",
                  type: "text",
                  label: "Rubrique",
                  required: true,
                  localized: true,
                  maxLength: 40,
                  admin: {
                    description: "Un ou deux mots.",
                    placeholder: "Budget",
                  },
                },
                {
                  name: "value",
                  type: "textarea",
                  label: "Réponse",
                  required: true,
                  localized: true,
                  maxLength: 180,
                  admin: {
                    description:
                      "Une phrase courte, avec un chiffre si possible.",
                    placeholder:
                      "Environ 45 € par adulte, entrées et déjeuner compris (tarifs 2026)",
                  },
                },
              ],
            },
            {
              name: "checkedAt",
              type: "date",
              label: "Informations vérifiées le",
              admin: {
                description:
                  "La date à laquelle horaires, tarifs et adresses ont été relus sur les sites officiels. Elle s'affiche sur le guide : changez-la seulement après une vraie relecture.",
                date: {
                  pickerAppearance: "dayOnly",
                  displayFormat: "d MMMM yyyy",
                },
                components: help(
                  "Les horaires et les tarifs changent chaque année. Au bout de six mois sans relecture, le résumé vous propose de vérifier le guide. Relisez les sites officiels, corrigez le texte, puis mettez la date du jour.",
                ),
              },
            },
            {
              name: "sources",
              type: "array",
              label: "Sources",
              labels: { singular: "Source", plural: "Sources" },
              admin: {
                description:
                  "Les pages officielles où chaque horaire, tarif ou date a été vérifié. Elles s'affichent en fin de guide.",
                initCollapsed: true,
                components: { RowLabel: rowLabel("{name}", "Source") },
              },
              fields: [
                {
                  name: "name",
                  type: "text",
                  label: "Nom de la source",
                  required: true,
                  localized: true,
                  maxLength: 90,
                  admin: {
                    description: "Le nom du site, puis ce qu'on y a vérifié.",
                    placeholder: "Musée de Sologne, horaires et tarifs",
                  },
                },
                {
                  name: "url",
                  type: "text",
                  label: "Adresse de la page",
                  required: true,
                  validate: validateUrl,
                  admin: {
                    description:
                      "Ouvrez la page et copiez l'adresse affichée en haut du navigateur.",
                    placeholder:
                      "https://www.museedesologne.com/infos-pratiques",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Lieux et questions",
          description:
            "Ce qui s'affiche après le texte : les lieux cités, placés sur la carte des temps de route, puis les questions fréquentes.",
          fields: [
            {
              name: "places",
              type: "relationship",
              label: "Lieux cités",
              relationTo: "places",
              hasMany: true,
              admin: {
                description:
                  "Ces lieux s'affichent en fin de guide avec leur temps de route depuis le gîte. Le lieu manque ? Ajoutez-le d'abord dans « Lieux aux alentours ».",
              },
            },
            {
              name: "faq",
              type: "array",
              label: "Questions fréquentes",
              labels: { singular: "Question", plural: "Questions" },
              admin: {
                description:
                  "Trois à cinq questions courtes. Google peut les reprendre dans ses résultats.",
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
                  maxLength: 140,
                  admin: {
                    description:
                      "Une question telle qu'un voyageur la taperait dans Google.",
                    placeholder:
                      "Combien de temps faut-il pour visiter le ZooParc de Beauval ?",
                  },
                },
                {
                  name: "answer",
                  type: "textarea",
                  label: "Réponse",
                  required: true,
                  localized: true,
                  maxLength: 600,
                  admin: {
                    description:
                      "Répondez dès la première phrase, puis précisez en une ou deux phrases.",
                    placeholder:
                      "Comptez une journée entière. Le parc ouvre à 9h et il faut 50 minutes de route depuis le gîte.",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "theme",
      type: "select",
      label: "Thème",
      required: true,
      options: GUIDE_THEME_OPTIONS,
      admin: {
        position: "sidebar",
        description:
          "Range le guide dans la liste des guides et choisit les sites officiels proposés à la fin.",
      },
    },
    advanced(
      [
        {
          name: "slug",
          type: "text",
          label: "Adresse de la page",
          required: true,
          unique: true,
          index: true,
          validate: validateSlug,
          hooks: { beforeValidate: [slugFromTitle] },
          admin: {
            description:
              "Laissez vide : l'adresse se crée toute seule à partir du titre, à la première publication. Si vous la changez ensuite, l'ancienne adresse renvoie toute seule vers la nouvelle.",
            placeholder: "zooparc-de-beauval",
            components: help(
              "L'adresse d'un guide s'écrit instant-tranquille.com/guides/ suivi de ce texte. Avec « zooparc-de-beauval », la page est instant-tranquille.com/guides/zooparc-de-beauval. Des mots simples, sans accent, séparés par des tirets.",
            ),
          },
        },
      ],
      "sidebar",
    ),
  ],
};
