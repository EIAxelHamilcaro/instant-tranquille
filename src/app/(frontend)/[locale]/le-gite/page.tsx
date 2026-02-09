import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
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

  const [siteSettings, amenities, recommendations, cottagePage] =
    await Promise.all([
      getSiteSettings(locale, isDraft),
      getAmenities(locale, isDraft),
      getFeaturedRecommendations(locale, isDraft),
      getPageBySlug("le-gite", locale, isDraft),
    ]);

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: "Accueil", url: "/" },
    { name: "Le Gîte", url: "/le-gite" },
  ]);

  const settings = siteSettings as Record<string, any>;
  const contact = settings.contact as Record<string, any> | undefined;

  const propertyDetails = settings.propertyDetails as {
    maxGuests?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    surface?: number | null;
  } | undefined;

  const vacationRentalJsonLd = generateVacationRentalJsonLd({
    heroImage:
      cottagePage?.heroImage &&
      typeof cottagePage.heroImage === "object"
        ? (cottagePage.heroImage as Record<string, any>).sizes?.hero?.url
        : undefined,
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
            images: cottagePage?.heroImage ? [cottagePage.heroImage] : [],
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
          { label: locale === "fr" ? "Accueil" : "Home", href: "/" },
          { label: locale === "fr" ? "Le Gîte" : "The Cottage" },
        ]}
      />
      <DescriptionSection propertyDetails={propertyDetails} />
      <PhotoGallery images={cottagePage?.heroImage ? [cottagePage.heroImage] : []} />
      <LeafDivider />
      <AmenitiesList amenities={amenities} />
      <NearbyAttractions recommendations={recommendations} />
    </>
  );
}
