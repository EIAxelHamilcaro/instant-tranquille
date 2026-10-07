import type { Field } from "payload";
import { GUIDE_THEME_OPTIONS } from "@/lib/place-categories";
import { headerTab, pageGlobal, sectionTitleField } from "./page-global";

const themeSites: Field[] = GUIDE_THEME_OPTIONS.map(({ value, label }) => ({
  name: value,
  type: "relationship",
  label,
  relationTo: "official-sites",
  hasMany: true,
  maxRows: 6,
}));

export const GuidesPage = pageGlobal({
  slug: "guides-page",
  label: "Guides (page d'entrée)",
  path: "/guides",
  description:
    "La page qui liste tous les guides. Les guides eux-mêmes se gèrent dans « Guides de séjour ».",
  tabs: [
    headerTab({
      titlePlaceholder: "Guides de séjour en Sologne",
      ledeNote:
        "Écrivez {count} à l'endroit où le nombre de guides doit s'afficher.",
      photoNote: "Laissez vide pour reprendre la photo du guide mis en avant.",
    }),
    {
      label: "Titres",
      description: "Les deux titres qui organisent la liste des guides.",
      fields: [
        sectionTitleField(
          "leadTitle",
          "Titre du guide mis en avant",
          "Au-dessus du premier guide, celui qui cite le plus de lieux.",
        ),
        sectionTitleField(
          "allTitle",
          "Titre de la liste complète",
          "Au-dessus de tous les autres guides, classés par thème.",
        ),
      ],
    },
    {
      label: "Sites officiels par thème",
      description:
        "À la fin de chaque guide, le site propose des sites officiels selon le thème du guide. Choisissez ici lesquels, dans l'ordre d'affichage. Les sites des lieux cités dans le guide s'ajoutent tout seuls.",
      fields: [
        {
          name: "themeSites",
          type: "group",
          label: false,
          fields: themeSites,
        },
      ],
    },
  ],
});
