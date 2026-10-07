import type { RedirectsPluginConfig } from "@payloadcms/plugin-redirects/types";
import type { Field, FieldHook, TextFieldSingleValidation } from "payload";
import { isAuthenticated } from "@/lib/access";
import { help, screenIntro } from "@/lib/admin-fields";
import { isReservedPath, isSitePage, sitePath } from "@/lib/redirect-paths";
import { revalidateCollection } from "@/lib/revalidate";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const GUIDE_PATH = /^\/guides\/([^/]+)$/;

const toSitePath: FieldHook = ({ value }) =>
  typeof value === "string" ? (sitePath(value, siteUrl) ?? value) : value;

const validateOldAddress: TextFieldSingleValidation = async (
  value,
  { req },
) => {
  if (!value)
    return "Écrivez l'ancienne adresse, par exemple /guides/ancien-nom.";

  const path = sitePath(value, siteUrl);
  if (path === null) {
    return "Cette adresse n'est pas celle du site. Collez l'ancienne adresse d'une page du site, par exemple /guides/ancien-nom.";
  }
  if (isReservedPath(path)) {
    return "Cette adresse sert au fonctionnement du site, elle ne peut pas renvoyer ailleurs.";
  }
  if (path === "/" || isSitePage(path)) {
    return "Cette page existe toujours sur le site : son adresse ne peut pas renvoyer ailleurs.";
  }

  const slug = GUIDE_PATH.exec(path)?.[1];
  if (!slug) return true;

  const { totalDocs } = await req.payload.count({
    collection: "guides",
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
    },
    req,
  });

  return totalDocs > 0
    ? "Un guide en ligne porte encore cette adresse. Changez d'abord l'adresse du guide : l'ancienne viendra s'ajouter ici toute seule."
    : true;
};

const validateNewAddress: TextFieldSingleValidation = (
  value,
  { data, siblingData },
) => {
  if ((siblingData as { type?: string }).type !== "custom") return true;
  if (!value) {
    return "Écrivez la nouvelle adresse, par exemple /le-gite ou https://www.exemple.fr.";
  }

  const path = sitePath(value, siteUrl);
  if (path === null) {
    return URL.canParse(value) && /^https?:/.test(value)
      ? true
      : "Cette adresse n'est pas complète. Écrivez une page du site, par exemple /le-gite, ou une adresse entière qui commence par https://.";
  }

  return path === (data as { from?: string }).from
    ? "La nouvelle adresse est la même que l'ancienne : le visiteur tournerait en rond."
    : true;
};

const FRENCH_FIELDS: Record<string, object> = {
  from: {
    label: "Ancienne adresse",
    validate: validateOldAddress,
    hooks: { beforeValidate: [toSitePath] },
    admin: {
      description:
        "L'adresse qui n'existe plus. Vous pouvez la coller en entier, elle sera raccourcie toute seule. Elle vaut pour le site en français et en anglais.",
      placeholder: "/guides/ancien-nom-du-guide",
      components: help(
        "Une adresse est ce qui s'écrit après instant-tranquille.com. Pour le guide de Beauval, c'est /guides/zooparc-de-beauval.",
      ),
    },
  },
};

const FRENCH_TARGET: Record<string, object> = {
  type: {
    label: "Où envoyer le visiteur",
    options: [
      { label: "Vers un guide du site", value: "reference" },
      { label: "Vers une autre adresse", value: "custom" },
    ],
  },
  reference: {
    label: "Guide",
    admin: {
      condition: (_: unknown, target?: { type?: string }) =>
        target?.type === "reference",
      description:
        "Si ce guide change d'adresse plus tard, le renvoi suit tout seul.",
    },
  },
  url: {
    label: "Nouvelle adresse",
    validate: validateNewAddress,
    admin: {
      condition: (_: unknown, target?: { type?: string }) =>
        target?.type === "custom",
      description:
        "Une page du site, par exemple /le-gite, ou l'adresse entière d'un autre site.",
      placeholder: "/les-alentours",
    },
  },
};

const relabel = (fields: Field[], labels: Record<string, object>) =>
  fields.map((field) =>
    "name" in field && labels[field.name]
      ? ({ ...field, ...labels[field.name] } as Field)
      : field,
  );

export const Redirects: NonNullable<RedirectsPluginConfig["overrides"]> = {
  lockDocuments: false,
  disableDuplicate: true,
  trash: true,
  labels: { singular: "Ancienne adresse", plural: "Anciennes adresses" },
  hooks: revalidateCollection("redirects"),
  admin: {
    group: "Réglages",
    useAsTitle: "from",
    description:
      "Quand l'adresse d'une page change, l'ancienne renvoie vers la nouvelle : les liens déjà partagés et Google arrivent toujours au bon endroit. Changer l'adresse d'un guide ajoute sa ligne ici tout seul.",
    defaultColumns: ["from", "to.type", "updatedAt"],
    hideAPIURL: true,
    components: {
      Description: screenIntro(
        "Rien n'est affiché : le visiteur qui ouvre une ancienne adresse arrive directement sur la bonne page.",
      ),
    },
  },
  access: {
    create: isAuthenticated,
    read: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: ({ defaultFields }) =>
    relabel(defaultFields, FRENCH_FIELDS).map((field) =>
      field.type === "group"
        ? { ...field, fields: relabel(field.fields, FRENCH_TARGET) }
        : field,
    ),
};
