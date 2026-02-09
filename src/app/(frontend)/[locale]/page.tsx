import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import { generateCmsPageMetadata } from "@/lib/seo";
import { generateLodgingBusinessJsonLd } from "@/lib/jsonld";
import {
  getSiteSettings,
  getFeaturedTestimonials,
  getPricingConfig,
  getPageBySlug,
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

  const [siteSettings, testimonials, pricingConfig, homePage] =
    await Promise.all([
      getSiteSettings(locale, isDraft),
      getFeaturedTestimonials(locale, isDraft),
      getPricingConfig(locale, isDraft),
      getPageBySlug("home", locale, isDraft),
    ]);

  const jsonLd = generateLodgingBusinessJsonLd();

  const heroImage = homePage?.heroImage ?? null;
  const bookingLinks = (pricingConfig as Record<string, any>).bookingLinks as {
    airbnb?: string | null;
    booking?: string | null;
    email?: string | null;
  } | undefined;

  if (isDraft) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
