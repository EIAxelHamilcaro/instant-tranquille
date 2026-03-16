import { draftMode } from "next/headers";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import { generateCmsPageMetadata } from "@/lib/seo";
import {
  generateBreadcrumbJsonLd,
  generateVacationRentalJsonLd,
} from "@/lib/jsonld";
import {
  getSiteSettings,
  getAmenities,
  getFeaturedRecommendations,
  getPageBySlug,
} from "@/lib/queries";
import { DescriptionSection } from "@/components/cottage/DescriptionSection";
import { PhotoGallery } from "@/components/cottage/PhotoGallery";
import { AmenitiesList } from "@/components/cottage/AmenitiesList";

import { NearbyAttractions } from "@/components/cottage/NearbyAttractions";
import { LeafDivider } from "@/components/shared/LeafDivider";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { AreaMap } from "@/components/shared/AreaMap";
import { CottagePageClient } from "@/components/live-preview/CottagePageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;

  return generateCmsPageMetadata(
    "le-gite",
    locale as Locale,
    "/le-gite",
    messages.cottage.title,
    messages.cottage.description,
  );
}

export default async function CottagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { isEnabled: isDraft } = await draftMode();

  const [siteSettings, amenities, recommendations, cottagePage, tNav] =
    await Promise.all([
      getSiteSettings(locale, isDraft),
      getAmenities(locale, isDraft),
      getFeaturedRecommendations(locale, isDraft),
      getPageBySlug("le-gite", locale, isDraft),
      getTranslations({ locale, namespace: "nav" }),
    ]);

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: tNav("home"), url: "/" },
    { name: tNav("cottage"), url: "/le-gite" },
  ]);

  const settings = siteSettings as Record<string, any>;
  const contact = settings.contact as Record<string, any> | undefined;

  const propertyDetails = settings.propertyDetails as {
    maxGuests?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    surface?: number | null;
  } | undefined;

  // Use first gallery image or first preview image for JSON-LD (no hero on this page)
  const firstImage =
    (cottagePage?.gallery?.[0]?.image && typeof cottagePage.gallery[0].image === "object"
      ? (cottagePage.gallery[0].image as Record<string, any>).sizes?.hero?.url
      : null) ||
    (cottagePage?.previewImages?.[0]?.image && typeof cottagePage.previewImages[0].image === "object"
      ? (cottagePage.previewImages[0].image as Record<string, any>).sizes?.hero?.url
      : null);

  const vacationRentalJsonLd = generateVacationRentalJsonLd({
    heroImage: firstImage || undefined,
    maxGuests: propertyDetails?.maxGuests,
    bedrooms: propertyDetails?.bedrooms,
    bathrooms: propertyDetails?.bathrooms,
    surface: propertyDetails?.surface,
    lat: contact?.coordinates?.lat,
    lng: contact?.coordinates?.lng,
    address: contact?.address,
  });

  if (isDraft) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(vacationRentalJsonLd) }}
        />
        <CottagePageClient
          initialData={{
            propertyDetails,
            descriptionTitle: cottagePage?.descriptionTitle ?? null,
            descriptionText: cottagePage?.descriptionText ?? null,
            previewImages: cottagePage?.previewImages ?? null,
            gallery: cottagePage?.gallery ?? [],
            amenities,
            recommendations,
          }}
        />
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vacationRentalJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("cottage") },
        ]}
      />
      <DescriptionSection
        propertyDetails={propertyDetails}
        descriptionTitle={cottagePage?.descriptionTitle ?? null}
        descriptionText={cottagePage?.descriptionText ?? null}
        previewImages={cottagePage?.previewImages ?? null}
      />
      <PhotoGallery gallery={cottagePage?.gallery ?? []} />
      <LeafDivider />
      <AmenitiesList amenities={amenities} />
      <NearbyAttractions recommendations={recommendations} />
      <AreaMap
        lat={contact?.coordinates?.lat}
        lng={contact?.coordinates?.lng}
      />
    </>
  );
}
