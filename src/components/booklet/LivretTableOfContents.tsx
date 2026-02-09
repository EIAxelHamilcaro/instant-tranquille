"use client";

import { useTranslations } from "next-intl";
import {
  MapPin,
  Book,
  Wifi,
  Wrench,
  Star,
  Map,
  Phone,
  Clock,
} from "lucide-react";

const sections = [
  { id: "arrival", icon: MapPin, key: "arrival" },
  { id: "rules", icon: Book, key: "houseRules" },
  { id: "wifi", icon: Wifi, key: "wifi" },
  { id: "equipment", icon: Wrench, key: "equipment" },
  { id: "recommendations", icon: Star, key: "recommendations" },
  { id: "map", icon: Map, key: "map" },
  { id: "emergency", icon: Phone, key: "emergency" },
  { id: "checkinout", icon: Clock, key: "checkInOut" },
] as const;

export function LivretTableOfContents() {
  const t = useTranslations("booklet");

  return (
    <nav className="no-print space-y-1">
      <h3 className="mb-3 font-heading text-lg font-semibold">{t("toc")}</h3>
      {sections.map(({ id, icon: Icon, key }) => (
        <a
          key={id}
          href={`#${id}`}
          className="flex items-center gap-2.5 rounded-md px-3 py-2 font-sans text-sm text-foreground/80 transition-colors hover:bg-sand-100 hover:text-foreground"
        >
          <Icon className="h-4 w-4 text-primary-500" />
          {t(key)}
        </a>
      ))}
    </nav>
  );
}
