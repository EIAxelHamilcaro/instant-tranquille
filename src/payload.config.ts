import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { fr } from "@payloadcms/translations/languages/fr";
import sharp from "sharp";

import { Users } from "@/collections/Users";
import { Media } from "@/collections/Media";
import { Pages } from "@/collections/Pages";
import { Testimonials } from "@/collections/Testimonials";
import { Amenities } from "@/collections/Amenities";
import { LocalRecommendations } from "@/collections/LocalRecommendations";
import { OnboardingGuides } from "@/collections/OnboardingGuides";
import { ContactMessages } from "@/collections/ContactMessages";

import { SiteSettings } from "@/globals/SiteSettings";
import { Header } from "@/globals/Header";
import { Footer } from "@/globals/Footer";
import { PricingConfig } from "@/globals/PricingConfig";

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
        Icon: "/components/payload/Logo",
      },
      beforeDashboard: ["/components/payload/BeforeDashboard"],
    },
    meta: {
      titleSuffix: " — L'Instant Tranquille",
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
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL!,
    },
  }),
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
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
  cors: allowedOrigins,
  csrf: allowedOrigins,
});
