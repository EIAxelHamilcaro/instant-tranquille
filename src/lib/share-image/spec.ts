import type { Locale } from "@/i18n/config";
import type { PlaceCategory } from "@/lib/places";

export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };
export const SHARE_IMAGE_TYPE = "image/jpeg";
export const SHARE_IMAGE_EXTENSION = ".jpg";
export const SHARE_TEMPLATE_VERSION = 3;

export const SHARE_PAGES = [
  "home",
  "cottage",
  "surroundings",
  "guides",
  "rates",
  "contact",
] as const;

export type SharePage = (typeof SHARE_PAGES)[number];

export type ShareTarget =
  | { kind: "page"; page: SharePage }
  | { kind: "guide"; slug: string };

const GUIDE_SEGMENT = "guides";

export function shareImagePath(locale: Locale, target: ShareTarget) {
  const key =
    target.kind === "page" ? target.page : `${GUIDE_SEGMENT}/${target.slug}`;

  return `/og/${locale}/${key}${SHARE_IMAGE_EXTENSION}`;
}

export function parseShareKey(segments: string[]): ShareTarget | null {
  const last = segments.at(-1);
  if (!last?.endsWith(SHARE_IMAGE_EXTENSION)) return null;

  const name = last.slice(0, -SHARE_IMAGE_EXTENSION.length);
  const [first] = segments;

  if (segments.length === 2 && first === GUIDE_SEGMENT && name) {
    return { kind: "guide", slug: name };
  }

  const page = SHARE_PAGES.find((candidate) => candidate === name);

  return segments.length === 1 && page ? { kind: "page", page } : null;
}

export interface ShareImage {
  url: string;
  alt: string;
}

export interface SharePoint {
  x: number;
  y: number;
  category: PlaceCategory;
  highlighted: boolean;
}

export interface ShareFigure {
  value: string;
  label: string;
}

export type SharePanel =
  | {
      kind: "rose";
      points: SharePoint[];
      ringLabels: string[];
      caption: string;
      count: string;
      subject?: { x: number; y: number; label: string };
    }
  | { kind: "figures"; figures: ShareFigure[] };
