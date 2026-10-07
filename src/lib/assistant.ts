import type { MCPPluginConfig } from "@payloadcms/plugin-mcp";
import {
  APIError,
  type CollectionBeforeOperationHook,
  type CollectionSlug,
  type Config,
  type Plugin,
} from "payload";
import { PAGE_GLOBAL_SLUGS } from "@/globals/pages/page-global";
import { isAssistant } from "@/lib/access";

const FORBIDDEN = 403;
const WRITABLE = { find: true, create: true, update: true };
const READ_ONLY = { find: true };
const PAGE = { find: true, update: true };

const INSTRUCTIONS = [
  "You edit the website of L'Instant Tranquille, a holiday cottage in Sologne (Romorantin-Lanthenay, France), on behalf of its hosts.",
  "Every editorial field exists in French (locale fr, the default) and in English (locale en): write both, each in its own call.",
  "Read a document before changing it and send only the fields you change.",
  "Change one document at a time, by id. You cannot delete, send to the trash or update several documents at once.",
  "Save a guide with draft set to true unless the host asks you to publish it.",
  "Facts that never change without the host saying so: 115 m², 6 guests, 3 bedrooms, 1 bathroom.",
  "Never invent a review, a price, an opening time or a drive time. Drive times are computed by the site from the address of a place.",
  "French copy keeps its accents and never uses an em dash or an en dash.",
].join("\n");

const collections: MCPPluginConfig["collections"] = {
  places: {
    enabled: WRITABLE,
    description:
      "Places to visit around the cottage. Give the address: the site computes the position and the drive time itself.",
  },
  guides: {
    enabled: WRITABLE,
    description:
      "Articles that each answer one precise search about a stay in Sologne. Save as a draft unless asked to publish.",
  },
  testimonials: {
    enabled: WRITABLE,
    description:
      "Reviews left by guests on the booking platforms. Copy them faithfully, never write one yourself.",
  },
  amenities: {
    enabled: WRITABLE,
    description: "Equipment of the cottage, listed on the cottage page.",
  },
  "official-sites": {
    enabled: WRITABLE,
    description: "Official websites cited as sources by the guides.",
  },
  media: {
    enabled: READ_ONLY,
    description:
      "Photos already in the library, to pick one by its id. Photos are added by the hosts in the admin.",
  },
};

const globals: MCPPluginConfig["globals"] = {
  ...Object.fromEntries(
    PAGE_GLOBAL_SLUGS.map((slug) => [
      slug,
      { enabled: PAGE, description: `Texts and photos of the ${slug}.` },
    ]),
  ),
  "site-settings": {
    enabled: PAGE,
    description:
      "Facts about the cottage, contact details, hosts, booking platforms and the frequently asked questions.",
  },
  "pricing-config": {
    enabled: PAGE,
    description: "Rates, seasons and booking conditions.",
  },
};

const oneDocumentAtATime: CollectionBeforeOperationHook = ({
  args,
  operation,
  req,
}) => {
  if (!isAssistant(req) || operation !== "update") return args;

  if (!("id" in args) || args.id === undefined)
    throw new APIError(
      "Update one document at a time: pass its id instead of a where clause.",
      FORBIDDEN,
    );
  if (args.data?.deletedAt)
    throw new APIError(
      "Sending a document to the trash is reserved to the hosts, in the admin.",
      FORBIDDEN,
    );

  return args;
};

function guarded(config: Config): Config {
  const exposed = Object.keys(collections ?? {}) as CollectionSlug[];

  return {
    ...config,
    collections: config.collections?.map((collection) =>
      exposed.includes(collection.slug as CollectionSlug)
        ? {
            ...collection,
            hooks: {
              ...collection.hooks,
              beforeOperation: [
                ...(collection.hooks?.beforeOperation ?? []),
                oneDocumentAtATime,
              ],
            },
          }
        : collection,
    ),
  };
}

export const assistantAccess: Plugin = async (config) => {
  if (process.env.MCP_ENABLED !== "1") return config;

  const { mcpPlugin } = await import("@payloadcms/plugin-mcp");

  return mcpPlugin({
    collections,
    globals,
    mcp: { serverOptions: { instructions: INSTRUCTIONS } },
    overrideApiKeyCollection: (keys) => ({
      ...keys,
      lockDocuments: false,
      labels: {
        singular: "Accès d'un assistant",
        plural: "Accès des assistants",
      },
      admin: {
        ...keys.admin,
        group: "Réglages",
        hideAPIURL: true,
        description:
          "Une clé par assistant (Claude, par exemple) autorisé à modifier le contenu du site. Cochez ce qu'il peut lire et modifier. Supprimer la clé lui retire l'accès aussitôt.",
      },
    }),
  })(guarded(config));
};
