import type { Field } from "payload";

export const sectionTitleField: Field = {
  name: "sectionTitle",
  type: "text",
  label: "Titre de la section",
  localized: true,
  admin: {
    description:
      "Titre personnalisé (laissez vide pour utiliser le titre par défaut)",
    placeholder: "Titre par défaut si vide",
  },
};
