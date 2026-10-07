import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { seoPlugin } from "@payloadcms/plugin-seo";
import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { en } from "@payloadcms/translations/languages/en";
import { fr } from "@payloadcms/translations/languages/fr";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Amenities } from "@/collections/Amenities";
import { ContactMessages } from "@/collections/ContactMessages";
import { Guides } from "@/collections/Guides";
import { Media } from "@/collections/Media";
import { OfficialSites } from "@/collections/OfficialSites";
import { Places } from "@/collections/Places";
import { Testimonials } from "@/collections/Testimonials";
import { Users } from "@/collections/Users";
import { PricingConfig } from "@/globals/PricingConfig";
import { ContactPage } from "@/globals/pages/ContactPage";
import { CottagePage } from "@/globals/pages/CottagePage";
import { GuidesPage } from "@/globals/pages/GuidesPage";
import { HomePage } from "@/globals/pages/HomePage";
import { PAGE_GLOBAL_SLUGS } from "@/globals/pages/page-global";
import { RatesPage } from "@/globals/pages/RatesPage";
import { SurroundingsPage } from "@/globals/pages/SurroundingsPage";
import { SiteSettings } from "@/globals/SiteSettings";
import { defaultLocale, locales } from "@/i18n/config";
import { adminTranslations } from "@/lib/admin-translations";
import { readEmailConfig } from "@/lib/email/email-config";
import { workerEmailAdapter } from "@/lib/email/payload-email-adapter";
import { frenchSeoTab, seoFields } from "@/lib/seo-fields";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
const emailConfig = readEmailConfig();
const allowedOrigins = [siteUrl];
try {
  const u = new URL(siteUrl);
  const wwwVariant = u.hostname.startsWith("www.")
    ? siteUrl.replace("://www.", "://")
    : siteUrl.replace("://", "://www.");
  allowedOrigins.push(wwwVariant);
} catch {}

const LOCAL_DATABASE_HOSTS = ["localhost", "127.0.0.1", "::1", "[::1]"];
const isLocalDatabase = LOCAL_DATABASE_HOSTS.includes(
  new URL(process.env.DATABASE_URL!).hostname,
);

const CONTENT_LANGUAGES = { fr: "Français", en: "Anglais" };

export default buildConfig({
  i18n: {
    supportedLanguages: { fr, en },
    fallbackLanguage: "fr",
    translations: adminTranslations,
  },
  admin: {
    user: Users.slug,
    theme: "light",
    avatar: "default",
    dateFormat: "d MMMM yyyy",
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: "/components/payload/Logo",
        Icon: "/components/payload/Icon",
      },
      Nav: "/components/payload/Nav",
      beforeLogin: ["/components/payload/BeforeLogin"],
      providers: ["/components/payload/AdminFonts"],
      views: {
        dashboard: { Component: "/components/payload/Dashboard" },
      },
    },
    meta: {
      titleSuffix: " | L'Instant Tranquille",
      description: "L'espace de gestion du site du gîte L'Instant Tranquille.",
      icons: [
        { rel: "icon", type: "image/svg+xml", url: "/icon.svg" },
        { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
      ],
    },
    livePreview: {
      breakpoints: [
        { label: "Téléphone", name: "mobile", width: 390, height: 844 },
        { label: "Tablette", name: "tablet", width: 768, height: 1024 },
        { label: "Ordinateur", name: "desktop", width: 1440, height: 900 },
      ],
      collections: ["guides", "places", "testimonials", "amenities"],
      globals: [...PAGE_GLOBAL_SLUGS, "site-settings", "pricing-config"],
    },
  },
  collections: [
    Places,
    Guides,
    OfficialSites,
    Amenities,
    Testimonials,
    ContactMessages,
    Media,
    Users,
  ],
  globals: [
    HomePage,
    CottagePage,
    SurroundingsPage,
    GuidesPage,
    RatesPage,
    ContactPage,
    SiteSettings,
    PricingConfig,
  ],
  editor: lexicalEditor({
    features: () => [
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
      ParagraphFeature(),
      LinkFeature({}),
      OrderedListFeature(),
      UnorderedListFeature(),
      BlockquoteFeature(),
      HorizontalRuleFeature(),
      AlignFeature(),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  }),
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || "",
  cors: allowedOrigins,
  csrf: allowedOrigins,
  secret: process.env.PAYLOAD_SECRET!,
  email: emailConfig ? workerEmailAdapter(emailConfig) : undefined,
  db: postgresAdapter({
    push: isLocalDatabase,
    pool: {
      connectionString: process.env.DATABASE_URL!,
    },
  }),
  plugins: [
    seoPlugin({
      collections: ["guides"],
      globals: [...PAGE_GLOBAL_SLUGS],
      uploadsCollection: "media",
      tabbedUI: true,
      fields: seoFields,
      generateTitle: ({ doc }) =>
        typeof doc?.title === "string" ? doc.title : "L'Instant Tranquille",
      generateDescription: ({ doc }) =>
        [doc?.lede, doc?.excerpt].find((text) => typeof text === "string") ??
        "",
    }),
    frenchSeoTab,
    ...(blobToken
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: blobToken,
          }),
        ]
      : []),
  ],
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  localization: {
    locales: locales.map((code) => ({
      code,
      label: CONTENT_LANGUAGES[code],
    })),
    defaultLocale,
    fallback: true,
  },
});
