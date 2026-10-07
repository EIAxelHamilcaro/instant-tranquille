import type { Field, Plugin } from "payload";
import { charCount } from "@/lib/admin-fields";

const SHARE_TITLE_MAX = 36;
const PLUGIN_TAB_LABEL = "SEO";

const FRENCH_LABELS: Record<string, { label: string; description?: string }> = {
  title: { label: "Titre dans Google" },
  description: { label: "Description dans Google" },
  image: {
    label: "Photo de l'image de partage",
    description:
      "La photo de fond de l'image affichée quand la page est partagée. Laissez vide pour reprendre la photo d'en-tête.",
  },
};

const shareTitle: Field = {
  name: "shareTitle",
  type: "text",
  label: "Titre sur l'image de partage",
  localized: true,
  maxLength: SHARE_TITLE_MAX,
  admin: {
    description:
      "Le titre écrit en grand sur l'image qui s'affiche quand la page est partagée sur WhatsApp, Facebook ou par SMS. Quatre à six mots. Pour un guide, laissez vide : le début de son titre est repris.",
    components: charCount(SHARE_TITLE_MAX),
  },
};

interface SeoFieldsArgs {
  defaultFields: Field[];
}

export function seoFields({ defaultFields }: SeoFieldsArgs): Field[] {
  const fields = defaultFields.map((field) => {
    const french = "name" in field ? FRENCH_LABELS[field.name] : undefined;
    if (!french) return field;

    return {
      ...field,
      label: french.label,
      admin: {
        ...field.admin,
        ...(french.description ? { description: french.description } : {}),
      },
    } as Field;
  });

  return [...fields, shareTitle];
}

interface WithFields {
  fields: Field[];
}

function relabelSeoTab<Entity extends WithFields>(entity: Entity): Entity {
  const [first, ...rest] = entity.fields;
  if (first?.type !== "tabs") return entity;

  return {
    ...entity,
    fields: [
      {
        ...first,
        tabs: first.tabs.map((tab) =>
          tab.label === PLUGIN_TAB_LABEL
            ? {
                ...tab,
                label: "Google et partage",
                description:
                  "Ce que Google et les réseaux sociaux affichent pour cette page. Rien de tout cela n'apparaît sur la page elle-même.",
                fields: tab.fields.map((field) =>
                  field.type === "group" ? { ...field, label: false } : field,
                ),
              }
            : tab,
        ),
      },
      ...rest,
    ],
  };
}

export const frenchSeoTab: Plugin = (config) => ({
  ...config,
  collections: config.collections?.map(relabelSeoTab),
  globals: config.globals?.map(relabelSeoTab),
});
