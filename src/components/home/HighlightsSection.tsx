"use client";

import {
  BedDouble,
  Car,
  Castle,
  Flower,
  Home,
  type LucideIcon,
  MapPin,
  Moon,
  Sun,
  Trees,
  Trophy,
  Users,
  Waves,
  Wifi,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
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
  castle: Castle,
  trophy: Trophy,
  users: Users,
};

function getIcon(iconName: string | null | undefined): LucideIcon {
  if (!iconName) return Home;
  return iconMap[iconName] ?? Home;
}

type StaticHref = "/" | "/le-gite" | "/tarifs-reservation" | "/contact";

const staticHighlights: Array<{
  icon: LucideIcon;
  titleKey:
    | "highlightNature"
    | "highlightComfort"
    | "highlightLocation"
    | "highlightCalm";
  descKey:
    | "highlightNatureDesc"
    | "highlightComfortDesc"
    | "highlightLocationDesc"
    | "highlightCalmDesc";
  href: StaticHref;
}> = [
  {
    icon: Trees,
    titleKey: "highlightNature",
    descKey: "highlightNatureDesc",
    href: "/le-gite",
  },
  {
    icon: Home,
    titleKey: "highlightComfort",
    descKey: "highlightComfortDesc",
    href: "/le-gite",
  },
  {
    icon: MapPin,
    titleKey: "highlightLocation",
    descKey: "highlightLocationDesc",
    href: "/contact",
  },
  {
    icon: Moon,
    titleKey: "highlightCalm",
    descKey: "highlightCalmDesc",
    href: "/le-gite",
  },
];

type CmsHighlight = {
  icon?: string | null;
  title?: string | null;
  description?: string | null;
  linkUrl?: string | null;
  linkLabel?: string | null;
};

interface HighlightCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  linkLabel?: string;
}

function HighlightCard({
  icon: Icon,
  title,
  description,
  index,
  linkLabel,
}: HighlightCardProps) {
  return (
    <article
      className="reveal flex h-full flex-col gap-5 bg-background p-8 transition-colors duration-300 group-hover:bg-sand-50 sm:p-10"
      style={{ "--stagger": index } as React.CSSProperties}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-colors duration-300 group-hover:bg-primary-100">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h3>
      <p className="text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
      {linkLabel && (
        <span className="mt-auto inline-flex items-center gap-1.5 font-sans text-sm font-medium text-primary-600">
          {linkLabel}
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      )}
    </article>
  );
}

interface HighlightsSectionProps {
  highlights?: CmsHighlight[] | null;
  title?: string | null;
}

export function HighlightsSection({
  highlights: cmsHighlights,
  title: cmsTitle,
}: HighlightsSectionProps) {
  const t = useTranslations("home");
  const ref = useReveal();

  const useCms = cmsHighlights && cmsHighlights.length > 0;

  return (
    <section className="bg-sand-100 py-20 md:py-28" ref={ref}>
      <Container>
        <SectionHeading
          title={cmsTitle ?? t("highlightsTitle")}
          variant="left"
        />
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-sand-200 bg-sand-200 sm:grid-cols-2">
          {useCms
            ? cmsHighlights.map((highlight, i) =>
                highlight.linkUrl ? (
                  <a
                    key={highlight.title ?? String(i)}
                    href={highlight.linkUrl}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
                  >
                    <HighlightCard
                      icon={getIcon(highlight.icon)}
                      title={highlight.title ?? ""}
                      description={highlight.description ?? ""}
                      index={i}
                      linkLabel={highlight.linkLabel ?? undefined}
                    />
                  </a>
                ) : (
                  <div key={highlight.title ?? String(i)} className="group">
                    <HighlightCard
                      icon={getIcon(highlight.icon)}
                      title={highlight.title ?? ""}
                      description={highlight.description ?? ""}
                      index={i}
                      linkLabel={highlight.linkLabel ?? undefined}
                    />
                  </div>
                ),
              )
            : staticHighlights.map(({ icon, titleKey, descKey, href }, i) => (
                <Link
                  key={titleKey}
                  href={href}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
                >
                  <HighlightCard
                    icon={icon}
                    title={t(titleKey)}
                    description={t(descKey)}
                    index={i}
                    linkLabel={t("learnMoreShort")}
                  />
                </Link>
              ))}
        </div>
      </Container>
    </section>
  );
}
