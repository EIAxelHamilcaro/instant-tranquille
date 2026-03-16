"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import type { CmsMedia, CmsTestimonial } from "@/lib/queries";
import { HeroSection } from "@/components/home/HeroSection";
import { IntroSection } from "@/components/home/IntroSection";
import { HighlightsSection } from "@/components/home/HighlightsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { TestimonialForm } from "@/components/home/TestimonialForm";
import { CTASection } from "@/components/home/CTASection";
import { LeafDivider } from "@/components/shared/LeafDivider";

type CmsHighlight = {
  icon?: string | null;
  title?: string | null;
  description?: string | null;
  linkUrl?: string | null;
  linkLabel?: string | null;
};

export type HomePageData = {
  heroImage: CmsMedia | string | number | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  introImage: CmsMedia | string | number | null;
  introTitle?: string | null;
  introText?: unknown;
  highlights?: CmsHighlight[] | null;
  highlightsTitle?: string | null;
  testimonialsTitle?: string | null;
  ctaTitle?: string | null;
  ctaSubtitle?: string | null;
  testimonials: CmsTestimonial[];
  bookingLinks?: {
    airbnb?: string | null;
    booking?: string | null;
    abritel?: string | null;
    email?: string | null;
  };
};

export function HomePageClient({ initialData }: { initialData: HomePageData }) {
  const { data } = useLivePreview<HomePageData>({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SITE_URL || "",
    depth: 2,
  });

  return (
    <>
      <HeroSection
        heroImage={data.heroImage}
        heroTitle={data.heroTitle}
        heroSubtitle={data.heroSubtitle}
      />
      <IntroSection
        introImage={data.introImage}
        introTitle={data.introTitle}
        introText={data.introText}
      />
      <LeafDivider />
      <HighlightsSection
        highlights={data.highlights}
        title={data.highlightsTitle}
      />
      <TestimonialsSection
        testimonials={data.testimonials}
        title={data.testimonialsTitle}
      />
      <TestimonialForm />
      <CTASection
        bookingLinks={data.bookingLinks}
        ctaTitle={data.ctaTitle}
        ctaSubtitle={data.ctaSubtitle}
      />
    </>
  );
}
