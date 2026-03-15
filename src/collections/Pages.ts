import type { CollectionConfig, CollectionBeforeValidateHook, CollectionBeforeChangeHook } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateCollection } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";
import { validateSlug, validateLucideIcon } from "@/lib/validators";

// Auto-generate slug from title if empty
const autoSlug: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (operation === "create" && data && !data.slug && data.title) {
    const title = typeof data.title === "string" ? data.title : Object.values(data.title as Record<string, string>)[0] ?? "";
    data.slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }
  return data;
};

// Auto-set publishedAt when status changes to published
const autoPublishedAt: CollectionBeforeChangeHook = ({ data, req }) => {
  if (data?._status === "published" && !data?.publishedAt) {
    data.publishedAt = new Date().toISOString();
  }
  return data;
};

const revalidateHooks = revalidateCollection("pages");

export const Pages: CollectionConfig = {
  slug: "pages",
  lockDocuments: false,
  labels: { singular: "Page", plural: "Pages" },
  hooks: {
    ...revalidateHooks,
    beforeValidate: [autoSlug],
    beforeChange: [autoPublishedAt],
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  admin: {
    useAsTitle: "title",
    group: "Contenu",
    description: "Pages principales du site (Accueil, Le Gîte, etc.)",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    livePreview: {
      url: ({ data, locale }) => {
        const slug = (data as Record<string, unknown>).slug as string | undefined;
        const path = !slug || slug === "home" ? "/" : `/${slug}`;
        return previewUrl(path, { locale });
      },
    },
  },
  access: {
    create: isAuthenticated,
    read: isPublic,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    // ── Sidebar fields ─────────────────────────────────────────────────────────
    {
      name: "title",
      type: "text",
      label: "Titre de la page",
      required: true,
      localized: true,
      admin: {
        description: "Titre principal affiché en haut de la page",
      },
    },
    {
      name: "slug",
      type: "text",
      label: "Adresse URL",
      required: true,
      unique: true,
      validate: validateSlug,
      admin: {
        position: "sidebar",
        description:
          "Identifiant pour l'URL (minuscules, tirets, pas d'espaces ni accents). Ne pas modifier sauf si nécessaire",
        placeholder: "le-gite",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Date de publication",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Rempli automatiquement à la première publication",
        date: {
          displayFormat: "dd/MM/yyyy HH:mm",
        },
      },
    },

    // ── Tabs ───────────────────────────────────────────────────────────────────
    {
      type: "tabs",
      tabs: [
        // ── Tab: Contenu ────────────────────────────────────────────────────
        {
          label: "Contenu",
          fields: [
            // Collapsible: Hero
            {
              type: "collapsible",
              label: "Hero",
              fields: [
                {
                  name: "heroImage",
                  type: "upload",
                  label: "Image de bannière",
                  relationTo: "media",
                  admin: {
                    description:
                      "Grande image affichée en haut de la page (1920×1080 recommandé)",
                  },
                },
                {
                  name: "heroTitle",
                  type: "text",
                  label: "Titre de la bannière",
                  localized: true,
                  admin: {
                    description: "Grand titre sur l'image de bannière",
                  },
                },
                {
                  name: "heroSubtitle",
                  type: "text",
                  label: "Sous-titre de la bannière",
                  localized: true,
                  admin: {
                    description: "Texte affiché sous le titre de la bannière",
                  },
                },
              ],
            },

            // Collapsible: Introduction
            {
              type: "collapsible",
              label: "Introduction",
              fields: [
                {
                  name: "introTitle",
                  type: "text",
                  label: "Titre d'introduction",
                  localized: true,
                  admin: {
                    description: "Titre de la section d'introduction sous la bannière",
                  },
                },
                {
                  name: "introText",
                  type: "richText",
                  label: "Texte d'introduction",
                  localized: true,
                  admin: {
                    description:
                      "Texte d'accroche affiché juste après la bannière. Utilisez la barre d'outils pour mettre en forme",
                  },
                },
              ],
            },

            // Collapsible: Highlights (home only)
            {
              type: "collapsible",
              label: "Highlights",
              admin: {
                condition: (data) => data?.slug === "home",
              },
              fields: [
                {
                  name: "highlights",
                  type: "array",
                  label: "Points forts",
                  admin: {
                    description:
                      "Vignettes mises en avant sur la page d'accueil (atouts du gîte)",
                    condition: (data) => data?.slug === "home",
                  },
                  fields: [
                    {
                      name: "icon",
                      type: "text",
                      label: "Icône",
                      validate: validateLucideIcon,
                      admin: {
                        description:
                          "Nom d'icône Lucide en kebab-case (ex: trees, home, map-pin)",
                        placeholder: "trees",
                      },
                    },
                    {
                      name: "title",
                      type: "text",
                      label: "Titre",
                      localized: true,
                    },
                    {
                      name: "description",
                      type: "textarea",
                      label: "Description",
                      localized: true,
                    },
                    {
                      name: "linkUrl",
                      type: "text",
                      label: "URL du lien",
                      localized: true,
                      admin: {
                        description: "Lien vers lequel pointe la vignette (optionnel)",
                        placeholder: "/le-gite",
                      },
                    },
                    {
                      name: "linkLabel",
                      type: "text",
                      label: "Libellé du lien",
                      localized: true,
                      admin: {
                        description: "Texte du bouton ou lien (optionnel)",
                        placeholder: "En savoir plus",
                      },
                    },
                  ],
                },
              ],
            },

            // Collapsible: Description (le-gite only)
            {
              type: "collapsible",
              label: "Description",
              admin: {
                condition: (data) => data?.slug === "le-gite",
              },
              fields: [
                {
                  name: "descriptionTitle",
                  type: "text",
                  label: "Titre de la description",
                  localized: true,
                  admin: {
                    description: "Titre de la section de description du gîte",
                    condition: (data) => data?.slug === "le-gite",
                  },
                },
                {
                  name: "descriptionText",
                  type: "richText",
                  label: "Texte de description",
                  localized: true,
                  admin: {
                    description:
                      "Description détaillée du gîte. Utilisez la barre d'outils pour mettre en forme",
                    condition: (data) => data?.slug === "le-gite",
                  },
                },
              ],
            },

            // Collapsible: Contenu principal
            {
              type: "collapsible",
              label: "Contenu principal",
              fields: [
                {
                  name: "content",
                  type: "richText",
                  label: "Contenu de la page",
                  localized: true,
                  admin: {
                    description:
                      "Texte principal de la page. Utilisez la barre d'outils pour mettre en forme",
                  },
                },
              ],
            },
          ],
        },

        // ── Tab: Médias ─────────────────────────────────────────────────────
        {
          label: "Médias",
          fields: [
            {
              name: "introImage",
              type: "upload",
              label: "Image d'introduction",
              relationTo: "media",
              admin: {
                description:
                  "Image illustrant la section d'introduction (affichée à côté du texte d'intro)",
              },
            },

            // Collapsible: Galerie
            {
              type: "collapsible",
              label: "Galerie",
              fields: [
                {
                  name: "gallery",
                  type: "array",
                  label: "Photos de la galerie",
                  admin: {
                    description: "Photos affichées dans la galerie de la page",
                  },
                  fields: [
                    {
                      name: "image",
                      type: "upload",
                      label: "Photo",
                      relationTo: "media",
                      required: true,
                    },
                    {
                      name: "caption",
                      type: "text",
                      label: "Légende",
                      localized: true,
                      admin: {
                        description: "Légende affichée sous la photo (optionnelle)",
                      },
                    },
                  ],
                },
              ],
            },

            // Collapsible: Images aperçu (le-gite only)
            {
              type: "collapsible",
              label: "Images aperçu",
              admin: {
                condition: (data) => data?.slug === "le-gite",
              },
              fields: [
                {
                  name: "previewImages",
                  type: "array",
                  label: "Images aperçu",
                  maxRows: 3,
                  admin: {
                    description:
                      "Jusqu'à 3 images mises en avant sur la page du gîte (aperçu avant galerie complète)",
                    condition: (data) => data?.slug === "le-gite",
                  },
                  fields: [
                    {
                      name: "image",
                      type: "upload",
                      label: "Image",
                      relationTo: "media",
                      required: true,
                    },
                    {
                      name: "label",
                      type: "text",
                      label: "Libellé",
                      localized: true,
                      admin: {
                        description: "Libellé affiché sur ou sous l'image (optionnel)",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Tab: SEO ────────────────────────────────────────────────────────
        {
          label: "SEO",
          fields: [
            {
              name: "seo",
              type: "group",
              label: "Référencement (SEO)",
              admin: {
                description:
                  "Ces champs améliorent la visibilité sur Google et les réseaux sociaux",
              },
              fields: [
                {
                  name: "metaTitle",
                  type: "text",
                  label: "Titre Google",
                  localized: true,
                  maxLength: 60,
                  admin: {
                    description:
                      "Titre affiché dans les résultats Google (50-60 caractères). Laissez vide pour utiliser le titre de la page",
                    placeholder: "L'Instant Tranquille — Gîte en Sologne",
                  },
                },
                {
                  name: "metaDescription",
                  type: "textarea",
                  label: "Description Google",
                  localized: true,
                  admin: {
                    description:
                      "Texte affiché sous le titre dans Google (150-160 caractères). Donnez envie de cliquer !",
                    placeholder:
                      "Découvrez notre gîte de charme au cœur de la Sologne...",
                  },
                },
                {
                  name: "ogImage",
                  type: "upload",
                  label: "Image de partage",
                  relationTo: "media",
                  admin: {
                    description:
                      "Image affichée quand la page est partagée sur Facebook ou Twitter (1200×630 recommandé)",
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
