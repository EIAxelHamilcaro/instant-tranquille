import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import sharp from "sharp";
import { isAuthenticated, isPublic } from "@/lib/access";
import { charCount } from "@/lib/admin-fields";
import { revalidateCollection } from "@/lib/revalidate";
import { validateUrl } from "@/lib/validators";

const webpFormat = { format: "webp" as const, options: { quality: 80 } };
const ALT_MIN = 10;
const ALT_MAX = 140;
const ONE_YEAR = 31536000;
const FILE_CACHE = `public, max-age=${ONE_YEAR}, s-maxage=${ONE_YEAR}`;

const generateBlurDataURL: CollectionBeforeChangeHook = async ({
  data,
  req,
}) => {
  const buffer = req.file?.data;
  if (!buffer) return data;

  try {
    const lqip = await sharp(buffer)
      .resize(20, 20, { fit: "inside" })
      .webp({ quality: 40 })
      .toBuffer();
    data.blurDataURL = `data:image/webp;base64,${lqip.toString("base64")}`;
  } catch (error) {
    req.payload.logger.error({
      msg: "Échec génération du blurDataURL",
      err: error,
    });
  }

  return data;
};

export const Media: CollectionConfig = {
  slug: "media",
  lockDocuments: false,
  labels: { singular: "Photo", plural: "Photos" },
  hooks: {
    ...revalidateCollection("media"),
    beforeChange: [generateBlurDataURL],
  },
  defaultSort: "-createdAt",
  upload: {
    staticDir: "media",
    formatOptions: webpFormat,
    imageSizes: [
      { name: "thumbnail", width: 480, formatOptions: webpFormat },
      { name: "share", width: 1200, height: 630, formatOptions: webpFormat },
    ],
    adminThumbnail: "thumbnail",
    focalPoint: true,
    crop: true,
    mimeTypes: ["image/*"],
    modifyResponseHeaders: ({ headers }) => {
      headers.set("Cache-Control", FILE_CACHE);

      return headers;
    },
  },
  admin: {
    group: "Pages du site",
    useAsTitle: "alt",
    description:
      "Toutes les photos du site. Déposez une photo ici, puis choisissez-la dans une page, un lieu ou un guide. Le site la redimensionne et l'allège tout seul.",
    defaultColumns: ["filename", "alt", "credit", "createdAt"],
    listSearchableFields: ["alt", "filename", "caption"],
    pagination: { defaultLimit: 50 },
  },
  access: {
    create: isAuthenticated,
    read: isPublic,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Description de la photo",
      required: true,
      localized: true,
      minLength: ALT_MIN,
      maxLength: ALT_MAX,
      admin: {
        description:
          "Décrivez ce qu'on voit, comme à quelqu'un au téléphone. Cette phrase est lue aux personnes malvoyantes et aide Google à comprendre la photo.",
        placeholder: "Le séjour avec ses deux canapés devant la cheminée",
        components: charCount(ALT_MAX),
      },
    },
    {
      name: "caption",
      type: "text",
      label: "Légende",
      localized: true,
      maxLength: 120,
      admin: {
        description:
          "Un court texte affiché sous la photo quand on l'agrandit. Facultatif.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "credit",
          type: "text",
          label: "Crédit photo",
          maxLength: 120,
          admin: {
            description:
              "L'auteur et la licence. À remplir pour toute photo qui n'est pas la vôtre.",
            placeholder: "Jean Dupont, CC BY-SA 4.0",
            width: "50%",
          },
        },
        {
          name: "creditUrl",
          type: "text",
          label: "Lien de la source",
          validate: validateUrl,
          admin: {
            description: "La page où vous avez trouvé la photo.",
            placeholder: "https://commons.wikimedia.org/wiki/File:...",
            width: "50%",
          },
        },
      ],
    },
    {
      name: "blurDataURL",
      type: "text",
      admin: { hidden: true, readOnly: true },
    },
  ],
};
