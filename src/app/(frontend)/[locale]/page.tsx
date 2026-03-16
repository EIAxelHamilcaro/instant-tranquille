import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import { generateCmsPageMetadata } from "@/lib/seo";
import {
  generateLodgingBusinessJsonLd,
  generateFAQJsonLd,
  extractPlainText,
} from "@/lib/jsonld";
import {
  getSiteSettings,
  getFeaturedTestimonials,
  getAllApprovedTestimonials,
  getPricingConfig,
  getPageBySlug,
  getAmenities,
} from "@/lib/queries";
import { HeroSection } from "@/components/home/HeroSection";
import { IntroSection } from "@/components/home/IntroSection";
import { HighlightsSection } from "@/components/home/HighlightsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { TestimonialForm } from "@/components/home/TestimonialForm";
import { LeafDivider } from "@/components/shared/LeafDivider";
import { HomePageClient } from "@/components/live-preview/HomePageClient";

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

  const [siteSettings, testimonials, allTestimonials, pricingConfig, homePage, amenities] =
    await Promise.all([
      getSiteSettings(locale, isDraft),
      getFeaturedTestimonials(locale, isDraft),
      getAllApprovedTestimonials(locale, isDraft),
      getPricingConfig(locale, isDraft),
      getPageBySlug("home", locale, isDraft),
      getAmenities(locale, isDraft),
    ]);

  const settings = siteSettings as Record<string, any>;
  const contact = settings.contact as Record<string, any> | undefined;
  const pricing = pricingConfig as Record<string, any>;

  const heroImageUrl =
    homePage?.heroImage &&
    typeof homePage.heroImage === "object" &&
    (homePage.heroImage as Record<string, any>).sizes?.hero?.url;

  const propertyDetails = settings.propertyDetails as { bedrooms?: number; maxGuests?: number } | undefined;

  const jsonLd = generateLodgingBusinessJsonLd({
    telephone: contact?.phone,
    email: contact?.email,
    heroImage: heroImageUrl || undefined,
    lat: contact?.coordinates?.lat,
    lng: contact?.coordinates?.lng,
    address: contact?.address,
    checkInTime: pricing.policies?.checkIn,
    checkOutTime: pricing.policies?.checkOut,
    numberOfRooms: propertyDetails?.bedrooms,
    amenities,
    testimonials: allTestimonials,
  });

  const rawFaqs = (settings.faqs as { question: string; answer: unknown }[]) || [];
  const faqs = rawFaqs.map((faq) => ({
    question: faq.question,
    answer: typeof faq.answer === "string" ? faq.answer : extractPlainText(faq.answer),
  }));
  const faqJsonLd = generateFAQJsonLd(faqs);

  const bookingLinks = pricing.bookingLinks as {
    airbnb?: string | null;
    booking?: string | null;
    abritel?: string | null;
    email?: string | null;
  } | undefined;

  const heroImage = homePage?.heroImage ?? null;

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
        heroTitle={homePage?.heroTitle ?? null}
        heroSubtitle={homePage?.heroSubtitle ?? null}
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
