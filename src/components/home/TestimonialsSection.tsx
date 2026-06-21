"use client";

import Autoplay from "embla-carousel-autoplay";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StarRating } from "@/components/shared/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { REVIEW_AGGREGATE, REVIEW_LINKS, REVIEWS } from "@/lib/reviews";
import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";

const sourceColors: Record<string, string> = {
  airbnb: "bg-[#FF5A5F]/10 text-[#B7363B]",
  booking: "bg-[#003580]/10 text-[#003580]",
};

const platforms = [
  {
    key: "airbnb" as const,
    label: "Airbnb",
    href: REVIEW_LINKS.airbnb,
    rating: REVIEW_AGGREGATE.airbnb.rating,
    scale: REVIEW_AGGREGATE.airbnb.scale,
    count: REVIEW_AGGREGATE.airbnb.count,
  },
  {
    key: "booking" as const,
    label: "Booking",
    href: REVIEW_LINKS.booking,
    rating: REVIEW_AGGREGATE.booking.rating,
    scale: REVIEW_AGGREGATE.booking.scale,
    count: REVIEW_AGGREGATE.booking.count,
  },
];

export function TestimonialsSection({
  title: cmsTitle,
}: {
  title?: string | null;
}) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const ref = useReveal();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <section className="bg-background py-20 md:py-28" ref={ref}>
      <Container>
        <SectionHeading title={cmsTitle || t("testimonialsTitle")} />

        <div
          className="reveal mb-12 flex flex-wrap items-stretch justify-center gap-4"
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          {platforms.map((p) => (
            <a
              key={p.key}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.label}, ${p.rating}/${p.scale}, ${p.count} avis, ${tCommon("opensNewTab")}`}
              className="flex items-center gap-3 rounded-xl border border-sand-200 bg-sand-50 px-5 py-3 transition-colors hover:border-primary-300 hover:bg-white"
            >
              <span className="font-display text-base font-semibold text-foreground">
                {p.label}
              </span>
              <span className="data text-lg font-medium text-primary-700">
                {p.rating}
                <span className="text-sm text-muted-foreground">
                  /{p.scale}
                </span>
              </span>
              <span className="text-xs text-muted-foreground">
                {p.count} avis
              </span>
            </a>
          ))}
        </div>

        <div
          className="reveal mx-auto max-w-5xl px-12"
          style={{ "--stagger": 2 } as React.CSSProperties}
        >
          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: "start" }}
            plugins={[
              Autoplay({
                delay: 5500,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
            aria-roledescription="carousel"
            aria-label={t("testimonialsAriaLabel")}
          >
            <CarouselContent className="-ml-4">
              {REVIEWS.map((review, index) => (
                <CarouselItem
                  key={review.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={t("testimonialSlide", {
                    current: index + 1,
                    total: REVIEWS.length,
                  })}
                >
                  <figure className="flex h-full flex-col rounded-2xl border border-sand-200 bg-sand-50 p-7 transition-shadow duration-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)]">
                    <span
                      className="font-display text-5xl leading-none text-primary-300"
                      aria-hidden="true"
                    >
                      &ldquo;
                    </span>
                    <blockquote className="subtitle-editorial -mt-3 mb-5 flex-1 text-[1.05rem] leading-relaxed text-foreground/85">
                      {review.text}
                    </blockquote>
                    <figcaption className="flex items-end justify-between">
                      <div>
                        <p className="font-sans text-sm font-semibold text-foreground">
                          {review.guestName}
                        </p>
                        {review.guestOrigin && (
                          <p className="text-xs text-muted-foreground">
                            {review.guestOrigin}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <StarRating rating={review.rating} />
                        {review.source && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "font-normal capitalize",
                              sourceColors[review.source] || "",
                            )}
                          >
                            {review.source}
                          </Badge>
                        )}
                      </div>
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {count > 1 && (
            <>
              <div className="mt-8 flex justify-center gap-1" role="tablist">
                {Array.from({ length: count }).map((_, i) => (
                  <Button
                    key={`dot-${i}`}
                    variant="ghost"
                    type="button"
                    role="tab"
                    aria-selected={i === current}
                    aria-label={t("testimonialSlide", {
                      current: i + 1,
                      total: count,
                    })}
                    className="h-11 w-11 p-0"
                    onClick={() => api?.scrollTo(i)}
                  >
                    <span
                      className={cn(
                        "block h-2 rounded-full transition-all",
                        i === current
                          ? "w-6 bg-primary-600"
                          : "w-2 bg-primary-200 hover:bg-primary-300",
                      )}
                    />
                  </Button>
                ))}
              </div>
              <p className="sr-only" aria-live="polite">
                {t("testimonialSlide", { current: current + 1, total: count })}
              </p>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
