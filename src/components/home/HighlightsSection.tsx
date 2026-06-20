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

interface EditorialItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  linkLabel?: string;
}

function EditorialItem({
  icon: Icon,
  title,
  description,
  index,
  linkLabel,
}: EditorialItemProps) {
  const isEven = index % 2 === 0;

  return (
    <article
      className={cn(
        "reveal grid grid-cols-1 gap-8 py-16 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-16",
        "border-t border-sand-200 first:border-t-0",
      )}
      style={{ "--stagger": index } as React.CSSProperties}
    >
      <div className={cn("flex flex-col gap-5", !isEven && "md:order-3")}>
        <div className="flex items-center gap-4">
          <Icon
            className="h-5 w-5 shrink-0 text-primary-500"
            aria-hidden="true"
          />
          <span className="subtitle-editorial text-sm text-primary-600">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-sand-300" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h3>
        <p className="text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
        {linkLabel && (
          <span className="text-sm font-medium text-primary-600 underline-offset-4 hover:underline">
            {linkLabel} →
          </span>
        )}
      </div>

      <div
        className={cn("hidden md:block", !isEven && "md:order-2")}
        aria-hidden="true"
      >
        <div className="h-24 w-px bg-gradient-to-b from-transparent via-sand-300 to-transparent mx-auto" />
      </div>

      <div
        className={cn(
          "hidden md:flex md:items-center md:justify-center",
          isEven ? "md:order-3" : "md:order-1",
        )}
        aria-hidden="true"
      >
        <span
          className="subtitle-editorial select-none text-[6rem] font-bold leading-none text-sand-200"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
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
    <section className="bg-background py-20 md:py-28" ref={ref}>
      <Container>
        <SectionHeading
          title={cmsTitle ?? t("highlightsTitle")}
          variant="left"
        />
        <div>
          {useCms
            ? cmsHighlights.map((highlight, i) => {
                const key = highlight.title ?? String(i);
                const inner = (
                  <EditorialItem
                    icon={getIcon(highlight.icon)}
                    title={highlight.title ?? ""}
                    description={highlight.description ?? ""}
                    index={i}
                    linkLabel={highlight.linkLabel ?? undefined}
                  />
                );
                if (highlight.linkUrl) {
                  return (
                    <a
                      key={key}
                      href={highlight.linkUrl}
                      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
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
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <EditorialItem
                    icon={icon}
                    title={t(titleKey)}
                    description={t(descKey)}
                    index={i}
                  />
                </Link>
              ))}
        </div>
      </Container>
    </section>
  );
}
