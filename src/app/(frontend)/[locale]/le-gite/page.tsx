import { draftMode } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AmenitiesList } from "@/components/cottage/AmenitiesList";
import { DescriptionSection } from "@/components/cottage/DescriptionSection";
import { NearbyAttractions } from "@/components/cottage/NearbyAttractions";
import { PhotoGallery } from "@/components/cottage/PhotoGallery";
import { CottagePageClient } from "@/components/live-preview/CottagePageClient";
import { AreaMap } from "@/components/shared/AreaMap";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { LeafDivider } from "@/components/shared/LeafDivider";
import type { Locale } from "@/i18n/config";
import {
  generateBreadcrumbJsonLd,
  generateVacationRentalJsonLd,
} from "@/lib/jsonld";
import {
  getAllApprovedTestimonials,
  getAmenities,
  getFeaturedRecommendations,
  getPageBySlug,
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

  const [
    siteSettings,
    amenities,
    recommendations,
    cottagePage,
    testimonials,
    tNav,
  ] = await Promise.all([
    getSiteSettings(locale, isDraft),
    getAmenities(locale, isDraft),
    getFeaturedRecommendations(locale, isDraft),
    getPageBySlug("le-gite", locale, isDraft),
    getAllApprovedTestimonials(locale, isDraft),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: tNav("home"), url: "/" },
    { name: tNav("cottage"), url: "/le-gite" },
  ]);

  const settings = siteSettings as Record<string, unknown>;
  const contact = settings.contact as Record<string, unknown> | undefined;
  const contactCoordinates = contact?.coordinates as
    | Record<string, unknown>
    | undefined;

  const propertyDetails = settings.propertyDetails as
    | {
        maxGuests?: number | null;
        bedrooms?: number | null;
        bathrooms?: number | null;
        surface?: number | null;
      }
    | undefined;

  // Use first gallery image or first preview image for JSON-LD (no hero on this page)
  type CmsMedia = {
    url?: string | null;
    sizes?: { hero?: { url?: string | null } };
  };
  const _galleryMedia = cottagePage?.gallery?.[0]?.image as
    | CmsMedia
    | undefined;
  const _previewMedia = cottagePage?.previewImages?.[0]?.image as
    | CmsMedia
    | undefined;
  const firstImage =
    _galleryMedia?.sizes?.hero?.url ??
    _galleryMedia?.url ??
    _previewMedia?.sizes?.hero?.url ??
    _previewMedia?.url ??
    undefined;

  const vacationRentalJsonLd = generateVacationRentalJsonLd({
    heroImage: firstImage || undefined,
    maxGuests: propertyDetails?.maxGuests,
    bedrooms: propertyDetails?.bedrooms,
    bathrooms: propertyDetails?.bathrooms,
    surface: propertyDetails?.surface,
    lat: contactCoordinates?.lat as number | undefined,
    lng: contactCoordinates?.lng as number | undefined,
    address: contact?.address as string | undefined,
    city: contact?.city as string | undefined,
    postalCode: contact?.postalCode as string | undefined,
    amenities,
    testimonials,
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(vacationRentalJsonLd),
          }}
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(vacationRentalJsonLd),
        }}
      />
      <Breadcrumbs
        items={[{ label: tNav("home"), href: "/" }, { label: tNav("cottage") }]}
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
        lat={contactCoordinates?.lat as number | undefined}
        lng={contactCoordinates?.lng as number | undefined}
      />
    </>
  );
}
