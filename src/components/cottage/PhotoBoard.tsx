import { Photo } from "@/components/shared/Photo";
import { cn } from "@/lib/utils";
import type { Media } from "@/payload-types";

type PhotoLayout = "planche" | "mosaique";

interface PhotoBoardProps {
  photos: Media[];
  sizes: string;
  layout?: PhotoLayout;
  className?: string;
}

const isPortrait = (media: Media) => (media.height ?? 0) > (media.width ?? 0);

export function PhotoBoard({
  photos,
  sizes,
  layout = "planche",
  className,
}: PhotoBoardProps) {
  if (photos.length === 0) return null;

  return (
    <div className={cn(layout, className)}>
      {photos.map((media) => (
        <Photo
          key={media.id}
          media={media}
          sizes={sizes}
          ratio={isPortrait(media) ? "aspect-3/4" : "aspect-4/3"}
          zoom="photo"
          className={isPortrait(media) ? "portrait" : "paysage"}
        />
      ))}
    </div>
  );
}
