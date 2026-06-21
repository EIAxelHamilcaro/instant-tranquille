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
import { fr } from "@payloadcms/translations/languages/fr";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Amenities } from "@/collections/Amenities";
import { ContactMessages } from "@/collections/ContactMessages";
import { LocalRecommendations } from "@/collections/LocalRecommendations";
import { Media } from "@/collections/Media";
import { OnboardingGuides } from "@/collections/OnboardingGuides";
import { Pages } from "@/collections/Pages";
import { Testimonials } from "@/collections/Testimonials";
import { Users } from "@/collections/Users";
import { Footer } from "@/globals/Footer";
import { Header } from "@/globals/Header";
import { PricingConfig } from "@/globals/PricingConfig";
import { SiteSettings } from "@/globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const allowedOrigins = [siteUrl];
try {
  const u = new URL(siteUrl);
  const wwwVariant = u.hostname.startsWith("www.")
    ? siteUrl.replace("://www.", "://")
    : siteUrl.replace("://", "://www.");
  allowedOrigins.push(wwwVariant);
} catch {}

export default buildConfig({
  i18n: {
    supportedLanguages: { fr },
    fallbackLanguage: "fr",
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: "/components/payload/Logo",
        Icon: "/components/payload/Icon",
      },
      beforeDashboard: ["/components/payload/BeforeDashboard"],
    },
    meta: {
      titleSuffix: ", L'Instant Tranquille",
    },
    livePreview: {
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablette", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
      collections: [
        "pages",
        "testimonials",
        "amenities",
        "local-recommendations",
        "onboarding-guides",
      ],
      globals: ["site-settings", "header", "footer", "pricing-config"],
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Testimonials,
    Amenities,
    LocalRecommendations,
    OnboardingGuides,
    ContactMessages,
  ],
  globals: [SiteSettings, Header, Footer, PricingConfig],
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
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL!,
    },
  }),
  plugins: [
    seoPlugin({
      collections: ["pages"],
      uploadsCollection: "media",
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const title = typeof doc?.title === "string" ? doc.title : "";
        return title
          ? `${title}, L'Instant Tranquille`
          : "L'Instant Tranquille";
      },
      generateDescription: ({ doc }) => {
        const meta = doc?.meta as Record<string, unknown> | undefined;
        return typeof meta?.description === "string" ? meta.description : "";
      },
    }),
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    }),
  ],
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  localization: {
    locales: [
      { label: "Français", code: "fr" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "fr",
    fallback: true,
  },
});
