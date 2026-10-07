import type { Field, GlobalConfig, GlobalSlug, Tab } from "payload";
import { isAuthenticated, isPublishedOrAuthenticated } from "@/lib/access";
import { charCount, help, screenIntro } from "@/lib/admin-fields";
import { previewUrl } from "@/lib/preview-url";
import { revalidateGlobal } from "@/lib/revalidate";
import { factCheckedText, factCheckedTextarea } from "@/lib/validators";

type PagePath = Parameters<typeof previewUrl>[0];

interface PageGlobalOptions {
  slug: GlobalSlug;
  label: string;
  path: PagePath;
  description: string;
  tabs: Tab[];
}

export const PAGE_GLOBAL_SLUGS = [
  "home-page",
  "cottage-page",
  "surroundings-page",
  "guides-page",
  "rates-page",
  "contact-page",
] as const;

export type PageGlobalSlug = (typeof PAGE_GLOBAL_SLUGS)[number];

const TITLE_MAX = 70;
const LEDE_MAX = 320;
const SECTION_TITLE_MAX = 90;
const SECTION_TEXT_MAX = 420;

export function pageGlobal({
  slug,
  label,
  path,
  description,
  tabs,
}: PageGlobalOptions): GlobalConfig {
  return {
    slug,
    label,
    lockDocuments: false,
    versions: { drafts: { autosave: { interval: 2000 } }, max: 15 },
    hooks: revalidateGlobal(slug),
    admin: {
      group: "Pages du site",
      description,
      hideAPIURL: true,
      components: {
        elements: {
          Description: screenIntro(`La page « ${label} » du site.`, path),
        },
      },
      livePreview: {
        url: ({ locale }) => previewUrl(path, { locale }),
      },
    },
    access: {
      read: isPublishedOrAuthenticated,
      update: isAuthenticated,
    },
    fields: [{ type: "tabs", tabs }],
  };
}

interface HeaderTabOptions {
  titlePlaceholder: string;
  titleNote?: string;
  ledeNote?: string;
  photoNote?: string;
}

export const headerTab = ({
  titlePlaceholder,
  titleNote = "",
  ledeNote = "",
  photoNote = "",
}: HeaderTabOptions): Tab => ({
  label: "En-tête",
  description: "Le haut de la page : grand titre, introduction et photo.",
  fields: [
    {
      name: "title",
      type: "text",
      label: "Grand titre",
      required: true,
      localized: true,
      maxLength: TITLE_MAX,
      validate: factCheckedText,
      admin: {
        description:
          `Le titre principal de la page. Google le lit en premier : gardez le lieu et le mot gîte ou maison dedans. ${titleNote}`.trim(),
        placeholder: titlePlaceholder,
        components: {
          ...charCount(TITLE_MAX),
          ...help(
            "Quand quelqu'un cherche un gîte sur Google, ce titre aide le site à apparaître. Gardez le nom de la ville et le mot gîte ou maison, et restez sous 70 caractères.",
          ),
        },
      },
    },
    {
      name: "lede",
      type: "textarea",
      label: "Texte d'introduction",
      localized: true,
      maxLength: LEDE_MAX,
      validate: factCheckedTextarea,
      admin: {
        description: `Deux ou trois phrases sous le titre. ${ledeNote}`.trim(),
        placeholder:
          "Une maison de 115 m² pour six personnes, à deux pas des étangs.",
        components: charCount(LEDE_MAX),
      },
    },
    {
      name: "image",
      type: "upload",
      label: "Photo d'en-tête",
      relationTo: "media",
      admin: {
        description:
          `La grande photo affichée derrière le titre. Choisissez une photo lumineuse, en largeur. ${photoNote}`.trim(),
        components: help(
          "Sur téléphone, la photo est recadrée en hauteur. Pour choisir ce qui reste visible : ouvrez la photo dans « Photos », touchez « Modifier l'image », puis déplacez le point sur le sujet principal.",
        ),
      },
    },
  ],
});

interface SectionTextOptions {
  title: string;
  text: string;
  where: string;
}

export const sectionTextFields = ({
  title,
  text,
  where,
}: SectionTextOptions): Field[] => [
  {
    name: title,
    type: "text",
    label: "Titre",
    localized: true,
    maxLength: SECTION_TITLE_MAX,
    validate: factCheckedText,
    admin: {
      description: `Le titre ${where}.`,
      components: charCount(SECTION_TITLE_MAX),
    },
  },
  {
    name: text,
    type: "textarea",
    label: "Texte",
    localized: true,
    maxLength: SECTION_TEXT_MAX,
    validate: factCheckedTextarea,
    admin: {
      description: `Le paragraphe ${where}.`,
      components: charCount(SECTION_TEXT_MAX),
    },
  },
];

export const sectionTitleField = (
  name: string,
  label: string,
  description: string,
): Field => ({
  name,
  type: "text",
  label,
  localized: true,
  maxLength: SECTION_TITLE_MAX,
  validate: factCheckedText,
  admin: { description, components: charCount(SECTION_TITLE_MAX) },
});

export const photoListField = (
  name: string,
  label: string,
  description: string,
  maxRows?: number,
): Field => ({
  name,
  type: "array",
  label,
  labels: { singular: "Photo", plural: "Photos" },
  maxRows,
  admin: { description },
  fields: [
    {
      name: "image",
      type: "upload",
      label: "Photo",
      relationTo: "media",
      required: true,
    },
  ],
});
