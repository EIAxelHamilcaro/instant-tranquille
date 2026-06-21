import { draftMode } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingCTA } from "@/components/shared/BookingCTA";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { CategoryGrid } from "@/components/surroundings/CategoryGrid";
import { EquestrianSection } from "@/components/surroundings/EquestrianSection";
import { SurroundingsHero } from "@/components/surroundings/SurroundingsHero";
import { SurroundingsMap } from "@/components/surroundings/SurroundingsMap";
import type { Locale } from "@/i18n/config";
import {
  buildSurroundingsFaqItems,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  generateGrandParquetJsonLd,
  generateTouristAttractionJsonLd,
} from "@/lib/jsonld";
import type { CmsMedia } from "@/lib/queries";
import {
  getAllRecommendations,
  getPageBySlug,
  getPricingConfig,
  getSiteSettings,
} from "@/lib/queries";
import { generateCmsPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;

  return generateCmsPageMetadata(
    "les-alentours",
    locale as Locale,
    "/les-alentours",
    messages.surroundings.title,
    messages.surroundings.description,
  );
}

export default async function SurroundingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { isEnabled: isDraft } = await draftMode();

  const [siteSettings, recommendations, page, pricingConfig, tNav] =
    await Promise.all([
      getSiteSettings(locale, isDraft),
      getAllRecommendations(locale, isDraft),
      getPageBySlug("les-alentours", locale, isDraft),
      getPricingConfig(locale, isDraft),
      getTranslations({ locale, namespace: "nav" }),
    ]);

  const bookingLinks = (pricingConfig as Record<string, unknown>)
    ?.bookingLinks as
    | { airbnb?: string | null; booking?: string | null; email?: string | null }
    | undefined;

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: tNav("home"), url: "/" },
    { name: tNav("surroundings"), url: "/les-alentours" },
  ]);

  const surroundingsFaqJsonLd = generateFAQJsonLd(
    buildSurroundingsFaqItems(locale),
  );
  const grandParquetJsonLd = generateGrandParquetJsonLd();
  const touristAttractionsJsonLd = recommendations.map((rec) => {
    const photo = rec.photo;
    const imageUrl =
      photo != null && typeof photo === "object" && "url" in photo
        ? ((photo as CmsMedia).url ?? null)
        : null;
    return generateTouristAttractionJsonLd({ ...rec, image: imageUrl });
  });

  const settings = siteSettings as Record<string, unknown>;
  const contact = settings.contact as Record<string, unknown> | undefined;
  const giteCoordinates = contact?.coordinates as
    | { lat?: number | null; lng?: number | null }
    | undefined;

  const pageData = page as
    | (Record<string, unknown> & {
        equestrianTitle?: string | null;
        equestrianText?: unknown;
        equestrianVenues?: Array<{
          name?: string | null;
          description?: string | null;
          distanceFromGite?: string | null;
          website?: string | null;
        }> | null;
      })
    | null;

  const tSurroundings = await getTranslations({
    locale,
    namespace: "surroundings",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {surroundingsFaqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(surroundingsFaqJsonLd),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(grandParquetJsonLd) }}
      />
      {touristAttractionsJsonLd.map((jsonLd, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}

      <SurroundingsHero heroImage={page?.heroImage ?? null} />

      <Breadcrumbs
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("surroundings") },
        ]}
      />

      <h1 className="sr-only">{tSurroundings("h1")}</h1>

      <CategoryGrid recommendations={recommendations} />

      <EquestrianSection
        venues={pageData?.equestrianVenues ?? null}
        sectionTitle={pageData?.equestrianTitle ?? null}
      />

      <SurroundingsMap
        recommendations={recommendations}
        giteCoordinates={giteCoordinates}
      />

      <BookingCTA bookingLinks={bookingLinks} />
    </>
  );
}
