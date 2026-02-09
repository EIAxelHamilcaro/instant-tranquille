"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Trees, Home, MapPin, Moon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useReveal } from "@/lib/useReveal";

const highlights = [
  { icon: Trees, titleKey: "highlightNature", descKey: "highlightNatureDesc", href: "/le-gite" as const },
  { icon: Home, titleKey: "highlightComfort", descKey: "highlightComfortDesc", href: "/le-gite" as const },
  { icon: MapPin, titleKey: "highlightLocation", descKey: "highlightLocationDesc", href: "/contact" as const },
  { icon: Moon, titleKey: "highlightCalm", descKey: "highlightCalmDesc", href: "/le-gite" as const },
] as const;

export function HighlightsSection() {
  const t = useTranslations("home");
  const ref = useReveal();

  return (
    <section className="bg-sand-100 py-20" ref={ref}>
      <Container>
        <SectionHeading title={t("highlightsTitle")} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, titleKey, descKey, href }, i) => (
            <Link key={titleKey} href={href} className="group block">
              <Card
                className="reveal-scale border-sand-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ "--stagger": i } as React.CSSProperties}
              >
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 transition-colors group-hover:bg-primary-100">
                    <Icon className="h-7 w-7 text-primary-500" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold">
                    {t(titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(descKey)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
