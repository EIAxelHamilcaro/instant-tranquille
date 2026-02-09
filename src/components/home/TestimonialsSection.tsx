"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/StarRating";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";
import type { CmsTestimonial } from "@/lib/queries";
import { cn } from "@/lib/utils";

const sourceColors: Record<string, string> = {
  airbnb: "bg-[#FF5A5F]/10 text-[#B7363B]",
  booking: "bg-[#003580]/10 text-[#003580]",
  google: "bg-[#4285F4]/10 text-[#2B5DAD]",
  direct: "bg-primary-100 text-primary-700",
};

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: CmsTestimonial[];
}) {
  const t = useTranslations("home");
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

  if (!testimonials.length) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading title={t("testimonialsTitle")} />
        <div className="mx-auto max-w-5xl px-12">
          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: "start" }}
            plugins={[
              Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="border-sand-200 h-full bg-white">
                    <CardContent className="flex h-full flex-col p-6">
                      <Quote className="mb-3 h-8 w-8 shrink-0 text-primary-200" />
                      <p className="mb-4 flex-1 text-sm leading-relaxed italic text-foreground/80">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-sans text-sm font-semibold">
                            {testimonial.guestName}
                          </p>
                          {testimonial.guestOrigin && (
                            <p className="text-xs text-muted-foreground">
                              {testimonial.guestOrigin}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <StarRating rating={testimonial.rating} />
                          {testimonial.source && (
                            <Badge
                              variant="secondary"
                              className={
                                sourceColors[testimonial.source] ||
                                sourceColors.direct
                              }
                            >
                              {testimonial.source}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* Dots */}
          {count > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Aller au témoignage ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === current
                      ? "w-6 bg-primary-600"
                      : "w-2 bg-primary-200 hover:bg-primary-300",
                  )}
                  onClick={() => api?.scrollTo(i)}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
