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

export type HomePageData = {
  heroImage: CmsMedia | string | number | null;
  introImage: CmsMedia | string | number | null;
  testimonials: CmsTestimonial[];
  bookingLinks?: {
    airbnb?: string | null;
    booking?: string | null;
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
      <HeroSection heroImage={data.heroImage} />
      <IntroSection introImage={data.introImage} />
      <LeafDivider />
      <HighlightsSection />
      <TestimonialsSection testimonials={data.testimonials} />
      <TestimonialForm />
      <CTASection bookingLinks={data.bookingLinks} />
    </>
  );
}
