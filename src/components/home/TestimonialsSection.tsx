"use client";

import Autoplay from "embla-carousel-autoplay";
import { Quote } from "lucide-react";
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
    note: `${REVIEW_AGGREGATE.airbnb.rating}/${REVIEW_AGGREGATE.airbnb.scale}`,
    count: REVIEW_AGGREGATE.airbnb.count,
  },
  {
    key: "booking" as const,
    label: "Booking",
    href: REVIEW_LINKS.booking,
    note: `${REVIEW_AGGREGATE.booking.rating}/${REVIEW_AGGREGATE.booking.scale}`,
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
    <section className="bg-sand-100 py-20" ref={ref}>
      <Container>
        <SectionHeading title={cmsTitle || t("testimonialsTitle")} />

        <div
          className="reveal mb-10 flex flex-wrap items-center justify-center gap-3"
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          {platforms.map((p) => (
            <a
              key={p.key}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.label}, ${tCommon("opensNewTab")}`}
              className="inline-flex items-center gap-2 rounded-full border border-sand-200 bg-sand-50 px-4 py-2 font-sans text-sm transition-colors hover:border-primary-300 hover:bg-white"
            >
              <span className="font-semibold">{p.label}</span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-xs font-semibold",
                  sourceColors[p.key],
                )}
              >
                {p.note}
              </span>
              <span className="text-xs text-muted-foreground">({p.count})</span>
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
                delay: 5000,
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
                  <div className="border-sand-200 flex h-full flex-col rounded-xl border bg-sand-50 p-6">
                    <Quote
                      className="mb-3 h-8 w-8 shrink-0 text-primary-200"
                      aria-hidden="true"
                    />
                    <p className="mb-4 flex-1 text-sm leading-relaxed italic text-foreground/80">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-sans text-sm font-semibold">
                          {review.guestName}
                        </p>
                        {review.guestOrigin && (
                          <p className="text-xs text-muted-foreground">
                            {review.guestOrigin}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StarRating rating={review.rating} />
                        {review.source && (
                          <Badge
                            variant="secondary"
                            className={sourceColors[review.source] || ""}
                          >
                            {review.source}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {count > 1 && (
            <>
              <div className="mt-6 flex justify-center gap-1" role="tablist">
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
