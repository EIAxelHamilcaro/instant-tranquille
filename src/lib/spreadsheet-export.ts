import type {
  ExportBeforeHook,
  ImportExportPluginConfig,
} from "@payloadcms/plugin-import-export/types";
import { getTranslation } from "@payloadcms/translations";
import type {
  CollectionSlug,
  FlattenedField,
  PayloadRequest,
  Plugin,
} from "payload";

const SPREADSHEETS = {
  "contact-messages": [
    "createdAt",
    "name",
    "email",
    "phone",
    "dates",
    "subject",
    "message",
    "readStatus",
  ],
  testimonials: [
    "guestName",
    "source",
    "rating",
    "text",
    "language",
    "stayDate",
    "status",
    "featured",
  ],
  places: [
    "name",
    "category",
    "commune",
    "driveMin",
    "driveKm",
    "address",
    "website",
    "summary",
    "featured",
  ],
} satisfies Partial<Record<CollectionSlug, string[]>>;

const PLUGIN_MENU_ITEM =
  "@payloadcms/plugin-import-export/rsc#ExportListMenuItem";
const ONE_TAP_MENU_ITEM = "/components/payload/SpreadsheetDownload";
const TIMESTAMPS = ["createdAt", "updatedAt"];

const day = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeZone: "Europe/Paris",
});
const dayAndTime = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

function readable(field: FlattenedField, value: unknown, req: PayloadRequest) {
  if (value === null || value === undefined) return "";
  if (field.type === "checkbox") return value ? "Oui" : "Non";
  if (field.type === "date" && typeof value === "string") {
    const format = TIMESTAMPS.includes(field.name) ? dayAndTime : day;

    return format.format(new Date(value));
  }
  if (field.type === "select") {
    const option = field.options.find(
      (candidate) => typeof candidate === "object" && candidate.value === value,
    );

    return typeof option === "object"
      ? getTranslation(option.label, req.i18n)
      : value;
  }

  return value;
}

const spreadsheetRows =
  (slug: CollectionSlug, names: string[]): ExportBeforeHook =>
  ({ originalData, req }) => {
    const fields = names.flatMap((name) => {
      const field = req.payload.collections[slug].config.flattenedFields.find(
        (candidate) => candidate.name === name,
      );

      return field ? [field] : [];
    });

    return originalData.map((doc) =>
      Object.fromEntries(
        fields.map((field) => [
          getTranslation(field.label || field.name, req.i18n),
          readable(field, (doc as Record<string, unknown>)[field.name], req),
        ]),
      ),
    );
  };

const hidden: NonNullable<
  ImportExportPluginConfig["overrideExportCollection"]
> = ({ collection }) => ({
  ...collection,
  admin: { ...collection.admin, hidden: true },
});

export const spreadsheetExports: ImportExportPluginConfig = {
  overrideExportCollection: hidden,
  overrideImportCollection: hidden,
  collections: Object.entries(SPREADSHEETS).map(([slug, names]) => ({
    slug: slug as CollectionSlug,
    import: false,
    export: {
      format: "csv",
      disableSave: true,
      disableJobsQueue: true,
      hooks: { before: spreadsheetRows(slug as CollectionSlug, names) },
    },
  })),
};

export const oneTapSpreadsheet: Plugin = (config) => ({
  ...config,
  collections: config.collections?.map((collection) => ({
    ...collection,
    admin: {
      ...collection.admin,
      components: {
        ...collection.admin?.components,
        listMenuItems: collection.admin?.components?.listMenuItems?.map(
          (item) =>
            typeof item === "object" && item.path === PLUGIN_MENU_ITEM
              ? { ...item, path: ONE_TAP_MENU_ITEM }
              : item,
        ),
      },
    },
  })),
});
