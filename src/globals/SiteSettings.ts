import type { GlobalConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateGlobal } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  lockDocuments: false,
  label: "Paramètres du site",
  hooks: revalidateGlobal("site-settings"),
  versions: { drafts: true, max: 25 },
  access: {
    read: isPublic,
    update: isAuthenticated,
  },
  admin: {
    group: "Configuration",
    description:
      "Informations générales, coordonnées et réglages du site",
    livePreview: {
      url: ({ locale }) => previewUrl("/", { locale }),
    },
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      label: "Nom du site",
      defaultValue: "L'Instant Tranquille",
      admin: {
        description:
          "Nom qui apparaît dans le navigateur et l'en-tête",
      },
    },
    {
      name: "tagline",
      type: "text",
      label: "Slogan",
      localized: true,
      admin: {
        description: "Phrase d'accroche courte",
        placeholder: "Votre parenthèse nature en Sologne",
      },
    },
    {
      name: "siteDescription",
      type: "textarea",
      label: "Description du site",
      localized: true,
      admin: {
        description:
          "Présentation générale du gîte en quelques phrases",
      },
    },
    {
      name: "logo",
      type: "upload",
      label: "Logo",
      relationTo: "media",
      admin: {
        description:
          "Logo affiché dans l'en-tête du site (optionnel)",
      },
    },
    {
      name: "contact",
      type: "group",
      label: "Coordonnées",
      admin: {
        description:
          "Vos informations de contact affichées sur le site",
      },
      fields: [
        {
          name: "email",
          type: "email",
          label: "Email",
          admin: {
            description: "Adresse email de contact principal",
            placeholder: "contact@linstant-tranquille.fr",
          },
        },
        {
          name: "phone",
          type: "text",
          label: "Téléphone",
          admin: {
            description: "Numéro de téléphone principal",
            placeholder: "+33 6 12 34 56 78",
          },
        },
        {
          name: "address",
          type: "textarea",
          label: "Adresse postale",
          admin: {
            description: "Adresse complète du gîte",
          },
        },
        {
          name: "coordinates",
          type: "group",
          label: "Position GPS",
          admin: {
            description:
              "Pour la carte interactive du site (trouvable via Google Maps)",
          },
          fields: [
            {
              name: "lat",
              type: "number",
              label: "Latitude",
              admin: {
                description: "Coordonnée nord/sud",
                placeholder: "47.4833",
              },
            },
            {
              name: "lng",
              type: "number",
              label: "Longitude",
              admin: {
                description: "Coordonnée est/ouest",
                placeholder: "1.7667",
              },
            },
            {
              name: "zoom",
              type: "number",
              label: "Niveau de zoom",
              defaultValue: 12,
              min: 1,
              max: 18,
              admin: {
                description:
                  "Niveau de zoom de la carte (1 = monde, 18 = rue)",
              },
            },
            {
              name: "markerLabel",
              type: "text",
              label: "Texte du marqueur",
              admin: {
                description:
                  "Texte affiché sur le marqueur de la carte (par défaut : nom du site)",
                placeholder: "L'Instant Tranquille",
              },
            },
          ],
        },
      ],
    },
    {
      name: "accessRoutes",
      type: "array",
      label: "Itinéraires d'accès",
      admin: {
        description:
          "Routes d'accès au gîte depuis les grandes villes",
      },
      fields: [
        {
          name: "from",
          type: "text",
          label: "Depuis",
          required: true,
          admin: { placeholder: "Paris" },
        },
        {
          name: "duration",
          type: "text",
          label: "Durée",
          required: true,
          admin: { placeholder: "2h00" },
        },
        {
          name: "distance",
          type: "text",
          label: "Distance",
          required: true,
          admin: { placeholder: "190 km" },
        },
        {
          name: "description",
          type: "text",
          label: "Description de l'itinéraire",
          required: true,
          admin: {
            placeholder:
              "A10 direction Orléans, puis sortie Blois / Sologne",
          },
        },
      ],
    },
    {
      name: "socialLinks",
      type: "group",
      label: "Réseaux sociaux",
      admin: {
        description:
          "Liens vers vos pages sur les réseaux sociaux (optionnel)",
      },
      fields: [
        {
          name: "facebook",
          type: "text",
          label: "Page Facebook",
          admin: {
            description:
              "Adresse complète de votre page Facebook",
            placeholder: "https://facebook.com/linstanttranquille",
          },
        },
        {
          name: "instagram",
          type: "text",
          label: "Profil Instagram",
          admin: {
            description:
              "Adresse complète de votre profil Instagram",
            placeholder:
              "https://instagram.com/linstanttranquille",
          },
        },
      ],
    },
    {
      name: "propertyDetails",
      type: "group",
      label: "Caractéristiques du gîte",
      admin: {
        description:
          "Informations pratiques sur la capacité et la taille du logement",
      },
      fields: [
        {
          name: "maxGuests",
          type: "number",
          label: "Capacité maximale",
          admin: {
            description: "Nombre maximum de voyageurs",
          },
        },
        {
          name: "bedrooms",
          type: "number",
          label: "Chambres",
          admin: {
            description: "Nombre de chambres à coucher",
          },
        },
        {
          name: "bathrooms",
          type: "number",
          label: "Salles de bain",
          admin: {
            description:
              "Nombre de salles de bain / salles d'eau",
          },
        },
        {
          name: "surface",
          type: "number",
          label: "Surface",
          admin: { description: "En m²" },
        },
      ],
    },
    {
      name: "defaultSeo",
      type: "group",
      label: "Référencement par défaut",
      admin: {
        description:
          "Ces valeurs sont utilisées quand une page n'a pas ses propres réglages SEO",
      },
      fields: [
        {
          name: "metaTitle",
          type: "text",
          label: "Titre Google par défaut",
          localized: true,
          admin: {
            description:
              "Titre affiché dans Google si la page n'a pas de titre SEO",
            placeholder:
              "L'Instant Tranquille — Gîte en Sologne",
          },
        },
        {
          name: "metaDescription",
          type: "textarea",
          label: "Description Google par défaut",
          localized: true,
          admin: {
            description:
              "Description affichée dans Google si la page n'en a pas",
          },
        },
        {
          name: "ogImage",
          type: "upload",
          label: "Image de partage par défaut",
          relationTo: "media",
          admin: {
            description:
              "Image utilisée lors du partage sur les réseaux sociaux",
          },
        },
      ],
    },
  ],
};
