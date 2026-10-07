import type { StaticPathname } from "@/i18n/routing";

export const NAV_ITEMS: { key: string; href: StaticPathname }[] = [
  { key: "cottage", href: "/le-gite" },
  { key: "surroundings", href: "/les-alentours" },
  { key: "guides", href: "/guides" },
  { key: "rates", href: "/tarifs-reservation" },
  { key: "contact", href: "/contact" },
];
