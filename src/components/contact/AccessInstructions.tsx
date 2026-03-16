"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Clock, MapPin } from "lucide-react";
import { useReveal } from "@/lib/useReveal";

interface AccessRoute {
  from: string;
  duration: string;
  distance: string;
  description: string;
}

interface AccessInstructionsProps {
  routes?: AccessRoute[] | null;
}

export function AccessInstructions({ routes }: AccessInstructionsProps) {
  const t = useTranslations("contact");
  const ref = useReveal();

  if (!routes || routes.length === 0) return null;

  return (
    <section className="py-20" ref={ref}>
      <Container>
        <SectionHeading title={t("accessTitle")} />
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {routes.map((route, i) => (
            <Card
              key={route.from}
              className="reveal-scale border-sand-200"
              style={{ "--stagger": i } as React.CSSProperties}
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary-500" aria-hidden="true" />
                  <h3 className="font-heading text-lg font-semibold">
                    {route.from}
                  </h3>
                </div>
                <div className="mb-3 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {route.duration}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {route.distance}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">
                  {route.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
