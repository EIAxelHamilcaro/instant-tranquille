import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { CTASection } from "@/components/home/CTASection";
import { HeroSection } from "@/components/home/HeroSection";
import { HighlightsSection } from "@/components/home/HighlightsSection";
import { IntroSection } from "@/components/home/IntroSection";
import { StatsBand } from "@/components/home/StatsBand";
import { TestimonialForm } from "@/components/home/TestimonialForm";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import {
  HomePageClient,
  type HomePageData,
} from "@/components/live-preview/HomePageClient";
import { LeafDivider } from "@/components/shared/LeafDivider";
import type { Locale } from "@/i18n/config";
import {
  computePriceRange,
  extractPlainText,
  generateFAQJsonLd,
  generateLodgingBusinessJsonLd,
} from "@/lib/jsonld";
import {
  getAllApprovedTestimonials,
  getAmenities,
  getFeaturedTestimonials,
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
    "home",
    locale as Locale,
    "/",
    `L'Instant Tranquille — ${messages.metadata.title}`,
    messages.metadata.description,
    { absoluteTitle: true },
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { isEnabled: isDraft } = await draftMode();

  const [
    siteSettings,
    testimonials,
    allTestimonials,
    pricingConfig,
    homePage,
    amenities,
  ] = await Promise.all([
    getSiteSettings(locale, isDraft),
    getFeaturedTestimonials(locale, isDraft),
    getAllApprovedTestimonials(locale, isDraft),
    getPricingConfig(locale, isDraft),
    getPageBySlug("home", locale, isDraft),
    getAmenities(locale, isDraft),
  ]);

  const settings = siteSettings as Record<string, unknown>;
  const contact = settings.contact as Record<string, unknown> | undefined;
  const contactCoords = contact?.coordinates as
    | Record<string, unknown>
    | undefined;
  const pricing = pricingConfig as Record<string, unknown>;

  type CmsMedia = {
    url?: string | null;
    sizes?: { hero?: { url?: string | null } };
  };
  const _heroMedia = homePage?.heroImage as CmsMedia | undefined;
  const heroImageUrl =
    _heroMedia?.sizes?.hero?.url ?? _heroMedia?.url ?? undefined;

  const propertyDetails = settings.propertyDetails as
    | {
        bedrooms?: number;
        maxGuests?: number;
        bathrooms?: number;
        surface?: number;
        petsAllowed?: boolean;
      }
    | undefined;

  const rawSameAs = settings.sameAs as
    | Array<{ url?: string | null }>
    | undefined;
  const sameAsUrls = (rawSameAs ?? [])
    .map((item) => item.url)
    .filter((url): url is string => typeof url === "string" && url.length > 0);

  const jsonLd = generateLodgingBusinessJsonLd({
    telephone: contact?.phone as string | undefined,
    email: contact?.email as string | undefined,
    heroImage: heroImageUrl || undefined,
    lat: contactCoords?.lat as number | undefined,
    lng: contactCoords?.lng as number | undefined,
    address: contact?.address as string | undefined,
    city: contact?.city as string | undefined,
    postalCode: contact?.postalCode as string | undefined,
    priceRange: computePriceRange(
      pricing.seasons as Parameters<typeof computePriceRange>[0],
      pricing.currency as string | undefined,
    ),
    petsAllowed: propertyDetails?.petsAllowed,
    checkInTime: (pricing.policies as Record<string, unknown> | undefined)
      ?.checkIn as string | undefined,
    checkOutTime: (pricing.policies as Record<string, unknown> | undefined)
      ?.checkOut as string | undefined,
    numberOfRooms: propertyDetails?.bedrooms,
    amenities,
    testimonials: allTestimonials,
    sameAs: sameAsUrls,
  });

  const rawFaqs =
    (settings.faqs as { question: string; answer: unknown }[]) || [];
  const faqs = rawFaqs.map((faq) => ({
    question: faq.question,
    answer:
      typeof faq.answer === "string"
        ? faq.answer
        : extractPlainText(faq.answer),
  }));
  const faqJsonLd = generateFAQJsonLd(faqs);

  const bookingLinks = pricing.bookingLinks as
    | {
        airbnb?: string | null;
        booking?: string | null;
        abritel?: string | null;
        email?: string | null;
      }
    | undefined;

  const heroImage = homePage?.heroImage ?? null;
  const heroImages =
    (homePage?.heroImages as Array<{ image?: unknown }> | undefined) ?? null;

  if (isDraft) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}
        <HomePageClient
          initialData={{
            heroImage,
            heroImages: heroImages as HomePageData["heroImages"],
            heroTitle: homePage?.heroTitle ?? null,
            heroSubtitle: homePage?.heroSubtitle ?? null,
            introImage: homePage?.introImage ?? null,
            introTitle: homePage?.introTitle ?? null,
            introText: homePage?.introText ?? null,
            highlights: homePage?.highlights ?? null,
            highlightsTitle: homePage?.highlightsTitle ?? null,
            testimonialsTitle: homePage?.testimonialsTitle ?? null,
            ctaTitle: homePage?.ctaTitle ?? null,
            ctaSubtitle: homePage?.ctaSubtitle ?? null,
            testimonials,
            bookingLinks,
          }}
          propertyDetails={propertyDetails}
        />
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <HeroSection
        heroImage={heroImage}
        heroImages={heroImages as HomePageData["heroImages"]}
        heroTitle={homePage?.heroTitle ?? null}
        heroSubtitle={homePage?.heroSubtitle ?? null}
        bookingLinks={bookingLinks}
      />
      <StatsBand
        maxGuests={propertyDetails?.maxGuests}
        bedrooms={propertyDetails?.bedrooms}
        bathrooms={propertyDetails?.bathrooms}
        surface={propertyDetails?.surface}
      />
      <IntroSection
        introImage={homePage?.introImage ?? null}
        introTitle={homePage?.introTitle ?? null}
        introText={homePage?.introText ?? null}
      />
      <LeafDivider />
      <HighlightsSection
        highlights={homePage?.highlights ?? null}
        title={homePage?.highlightsTitle ?? null}
      />
      <TestimonialsSection
        testimonials={testimonials}
        title={homePage?.testimonialsTitle ?? null}
      />
      <TestimonialForm />
      <CTASection
        bookingLinks={bookingLinks}
        ctaTitle={homePage?.ctaTitle ?? null}
        ctaSubtitle={homePage?.ctaSubtitle ?? null}
      />
    </>
  );
}
