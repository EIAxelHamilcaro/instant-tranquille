import type { OfficialSite } from "@/payload-types";

export const OFFICIAL_SITE_GROUPS = [
  "venir",
  "sologne",
  "chateaux",
  "berry",
  "velo",
  "terroir",
  "mairies",
] as const;

export type OfficialSiteGroup = (typeof OFFICIAL_SITE_GROUPS)[number];

const GROUP_LABELS: Record<OfficialSiteGroup, string> = {
  venir: "Romorantin et accès",
  sologne: "Sologne et Loir-et-Cher",
  chateaux: "Châteaux et Val de Loire",
  berry: "Berry et Loiret",
  velo: "À vélo",
  terroir: "Vins et terroir",
  mairies: "Mairies des villes et villages",
};

export const OFFICIAL_SITE_GROUP_OPTIONS = OFFICIAL_SITE_GROUPS.map(
  (value) => ({ label: GROUP_LABELS[value], value }),
);

export const toOfficialLink = (site: OfficialSite) => ({
  url: site.url,
  name: site.name,
  detail: site.detail ?? undefined,
});
