"use client";

import { useTranslations } from "next-intl";
import type { BookletSection } from "@/types/booklet";
import {
  MapPin,
  Book,
  Wifi,
  Wrench,
  Star,
  Map,
  Phone,
  Clock,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const blockTypeMeta: Record<
  string,
  { icon: LucideIcon; labelKey: string }
> = {
  arrival: { icon: MapPin, labelKey: "arrival" },
  houseRules: { icon: Book, labelKey: "houseRules" },
  wifi: { icon: Wifi, labelKey: "wifi" },
  equipment: { icon: Wrench, labelKey: "equipment" },
  recommendations: { icon: Star, labelKey: "recommendations" },
  map: { icon: Map, labelKey: "map" },
  emergency: { icon: Phone, labelKey: "emergency" },
  checkInOut: { icon: Clock, labelKey: "checkInOut" },
  custom: { icon: FileText, labelKey: "customSection" },
};

export function LivretTableOfContents({
  sections = [],
}: {
  sections?: BookletSection[];
}) {
  const t = useTranslations("booklet");

  return (
    <nav className="no-print space-y-1">
      <h3 className="mb-3 font-heading text-lg font-semibold">{t("toc")}</h3>
      {sections.map((section) => {
        const meta = blockTypeMeta[section.blockType];
        if (!meta) return null;
        const Icon = meta.icon;
        const customTitle = "sectionTitle" in section ? (section as { sectionTitle?: string | null }).sectionTitle : null;
        const label =
          section.blockType === "custom"
            ? (section as { title: string }).title
            : customTitle || t(meta.labelKey);

        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="flex items-center gap-2.5 rounded-md px-3 py-2 font-sans text-sm text-foreground/80 transition-colors hover:bg-sand-100 hover:text-foreground"
          >
            <Icon className="h-4 w-4 text-primary-500" aria-hidden="true" />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
