"use client";

import {
  BedDouble,
  Car,
  Flower,
  Home,
  type LucideIcon,
  MapPin,
  Moon,
  Sun,
  Trees,
  Waves,
  Wifi,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Link } from "@/i18n/navigation";
import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";

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

interface HighlightItemInnerProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  hasLink: boolean;
}

function HighlightItemInner({
  icon: Icon,
  title,
  description,
  index,
  hasLink,
}: HighlightItemInnerProps) {
  const isEven = index % 2 === 0;

  return (
    <article
      className={cn(
        "reveal group flex items-start gap-10 py-12 md:gap-16",
        isEven ? "md:flex-row" : "md:flex-row-reverse",
      )}
      style={{ "--stagger": index } as React.CSSProperties}
    >
      <div className="flex shrink-0 flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary-200 bg-primary-50 transition-colors duration-300 group-hover:bg-primary-100">
          <Icon className="h-7 w-7 text-primary-500" aria-hidden="true" />
        </div>
        <span
          className="select-none text-xs font-bold tracking-widest text-stone-400 uppercase"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex-1 py-2">
        <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="max-w-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
        {hasLink && (
          <span className="mt-4 inline-block text-sm font-medium text-primary-600 underline-offset-4 transition-all duration-200 group-hover:underline group-hover:text-primary-700">
            En savoir plus →
          </span>
        )}
      </div>

      <div
        className={cn(
          "hidden h-px flex-1 self-center bg-sand-200 md:block",
          isEven ? "order-last" : "order-first",
        )}
        aria-hidden="true"
      />
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
    <section className="bg-stone-50 py-20" ref={ref}>
      <Container>
        <SectionHeading
          title={cmsTitle ?? t("highlightsTitle")}
          variant="left"
        />
        <div className="divide-y divide-sand-200">
          {useCms
            ? cmsHighlights.map((highlight, i) => {
                const key = highlight.title ?? String(i);
                const inner = (
                  <HighlightItemInner
                    icon={getIcon(highlight.icon)}
                    title={highlight.title ?? ""}
                    description={highlight.description ?? ""}
                    index={i}
                    hasLink={Boolean(highlight.linkUrl)}
                  />
                );
                if (highlight.linkUrl) {
                  return (
                    <a
                      key={key}
                      href={highlight.linkUrl}
                      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      {inner}
                    </a>
                  );
                }
                return <div key={key}>{inner}</div>;
              })
            : staticHighlights.map(({ icon, titleKey, descKey, href }, i) => (
                <Link
                  key={titleKey}
                  href={href}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <HighlightItemInner
                    icon={icon}
                    title={t(titleKey)}
                    description={t(descKey)}
                    index={i}
                    hasLink
                  />
                </Link>
              ))}
        </div>
      </Container>
    </section>
  );
}
