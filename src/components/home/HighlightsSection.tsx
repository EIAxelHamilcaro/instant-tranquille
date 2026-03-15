"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trees,
  Home,
  MapPin,
  Moon,
  Sun,
  BedDouble,
  Wifi,
  Car,
  Waves,
  Flower,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useReveal } from "@/lib/useReveal";

const iconMap: Record<string, LucideIcon> = {
  trees: Trees,
  home: Home,
  "map-pin": MapPin,
  moon: Moon,
  sun: Sun,
  "bed-double": BedDouble,
  wifi: Wifi,
  car: Car,
  waves: Waves,
  flower: Flower,
};

function getIcon(iconName: string | null | undefined): LucideIcon {
  if (!iconName) return Home;
  return iconMap[iconName] || Home;
}

const staticHighlights = [
  { icon: Trees, titleKey: "highlightNature", descKey: "highlightNatureDesc", href: "/le-gite" as const },
  { icon: Home, titleKey: "highlightComfort", descKey: "highlightComfortDesc", href: "/le-gite" as const },
  { icon: MapPin, titleKey: "highlightLocation", descKey: "highlightLocationDesc", href: "/contact" as const },
  { icon: Moon, titleKey: "highlightCalm", descKey: "highlightCalmDesc", href: "/le-gite" as const },
] as const;

type CmsHighlight = {
  icon?: string | null;
  title?: string | null;
  description?: string | null;
  linkUrl?: string | null;
  linkLabel?: string | null;
};

export function HighlightsSection({
  highlights: cmsHighlights,
}: {
  highlights?: CmsHighlight[] | null;
}) {
  const t = useTranslations("home");
  const ref = useReveal();

  const useCms = cmsHighlights && cmsHighlights.length > 0;

  return (
    <section className="bg-sand-100 py-20" ref={ref}>
      <Container>
        <SectionHeading title={t("highlightsTitle")} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCms
            ? cmsHighlights.map((highlight, i) => {
                const Icon = getIcon(highlight.icon);
                const card = (
                  <Card
                    className="reveal-scale border-sand-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md"
                    style={{ "--stagger": i } as React.CSSProperties}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 transition-colors group-hover:bg-primary-100">
                        <Icon className="h-7 w-7 text-primary-500" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold">
                        {highlight.title}
                      </h3>
                      {highlight.description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {highlight.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );

                if (highlight.linkUrl) {
                  return (
                    <a
                      key={i}
                      href={highlight.linkUrl}
                      className="group block"
                    >
                      {card}
                    </a>
                  );
                }
                return <div key={i} className="group">{card}</div>;
              })
            : staticHighlights.map(({ icon: Icon, titleKey, descKey, href }, i) => (
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
