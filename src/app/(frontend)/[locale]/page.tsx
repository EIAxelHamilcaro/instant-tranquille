import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import { generateCmsPageMetadata } from "@/lib/seo";
import {
  generateLodgingBusinessJsonLd,
  generateFAQJsonLd,
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

  const jsonLd = generateLodgingBusinessJsonLd({
    telephone: contact?.phone,
    email: contact?.email,
    heroImage: heroImageUrl || undefined,
    lat: contact?.coordinates?.lat,
    lng: contact?.coordinates?.lng,
    address: contact?.address,
    priceRange: "$$",
    checkInTime: pricing.policies?.checkIn,
    checkOutTime: pricing.policies?.checkOut,
    amenities,
    testimonials: allTestimonials,
  });

  const faqs = (settings.faqs as { question: string; answer: string }[]) || [];
  const faqJsonLd = generateFAQJsonLd(faqs);

  const bookingLinks = pricing.bookingLinks as {
    airbnb?: string | null;
    booking?: string | null;
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
            introImage: homePage?.heroImage ?? null,
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
      <HeroSection heroImage={heroImage} />
      <IntroSection introImage={homePage?.heroImage ?? null} />
      <LeafDivider />
      <HighlightsSection />
      <TestimonialsSection testimonials={testimonials} />
      <TestimonialForm />
      <CTASection bookingLinks={bookingLinks} />
    </>
  );
}
