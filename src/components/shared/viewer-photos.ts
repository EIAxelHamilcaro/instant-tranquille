import { asMedia } from "@/lib/queries";
import type { Media } from "@/payload-types";

export interface ViewerPhoto {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string | null;
  credit?: string | null;
  creditUrl?: string | null;
}

interface PhotoItem {
  image: number | Media;
}

const FALLBACK_WIDTH = 2400;
const FALLBACK_HEIGHT = 1800;

export function mediaOf(items: PhotoItem[] | null | undefined): Media[] {
  return (items ?? [])
    .map((item) => asMedia(item.image))
    .filter((media): media is Media => Boolean(media?.url));
}

export function toViewerPhoto(media: Media, alt = ""): ViewerPhoto {
  return {
    id: media.id,
    src: media.url ?? "",
    alt: media.alt || alt,
    width: media.width ?? FALLBACK_WIDTH,
    height: media.height ?? FALLBACK_HEIGHT,
    blurDataURL: media.blurDataURL,
    credit: media.credit,
    creditUrl: media.creditUrl,
  };
}
