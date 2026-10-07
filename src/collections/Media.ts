import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import sharp from "sharp";
import { isAuthenticated, isPublic } from "@/lib/access";
import { charCount, help, note, screenIntro } from "@/lib/admin-fields";
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
  trash: true,
  disableDuplicate: true,
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
      "Toutes les photos du site. Le site les redimensionne et les allège tout seul.",
    defaultColumns: ["filename", "alt", "credit", "createdAt"],
    listSearchableFields: ["alt", "filename", "caption"],
    pagination: { defaultLimit: 50 },
    hideAPIURL: true,
    components: {
      Description: screenIntro(
        "Une photo n'apparaît sur le site qu'une fois choisie dans une page, un lieu ou un guide.",
      ),
    },
  },
  access: {
    create: isAuthenticated,
    read: isPublic,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    note(
      "uploadNote",
      "Avant d'envoyer une photo",
      "Une photo de plus de 4,5 Mo est refusée. Pour recadrer une photo déjà en ligne, envoyez la version recadrée comme une nouvelle photo : l'ancienne reste affichée plusieurs jours sinon.",
    ),
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
        components: {
          ...charCount(ALT_MAX),
          ...help(
            "Cette phrase ne se voit pas à l'écran. Elle est lue à voix haute aux personnes malvoyantes, et Google s'en sert pour comprendre la photo. Dites simplement ce qu'on voit : la pièce, le lieu, la saison.",
          ),
        },
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
        placeholder: "La terrasse au petit matin",
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
            components: help(
              "Vos propres photos n'ont pas besoin de crédit. Pour une photo trouvée ailleurs, écrivez le nom de l'auteur et la licence indiqués sur la page d'origine. Sans licence claire, ne l'utilisez pas.",
            ),
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
