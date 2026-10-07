import { Photo, type PhotoZoomArea } from "@/components/shared/Photo";
import type { PlaceCategory } from "@/lib/places";
import { asMedia } from "@/lib/queries";
import { cn } from "@/lib/utils";
import type { Media } from "@/payload-types";

interface VignetteProps {
  media: number | Media | null | undefined;
  category: PlaceCategory;
  sizes: string;
  ratio?: string;
  zoom?: PhotoZoomArea;
}

export function Vignette({
  media,
  category,
  sizes,
  ratio = "aspect-3/2",
  zoom,
}: VignetteProps) {
  const photo = asMedia(media);

  if (photo?.url)
    return <Photo media={photo} sizes={sizes} ratio={ratio} zoom={zoom} />;

  return (
    <div className={cn("photo sans-photo", ratio, `categorie-${category}`)} />
  );
}
