import { PhotoCredit } from "@/components/shared/PhotoCredit";
import { PhotoZoom } from "@/components/shared/PhotoZoom";
import { SoftImage } from "@/components/shared/SoftImage";
import { toViewerPhoto } from "@/components/shared/viewer-photos";
import { cn } from "@/lib/utils";
import type { Media } from "@/payload-types";

export type PhotoZoomArea = "photo" | "loupe";

interface PhotoProps {
  media: number | Media | null | undefined;
  sizes: string;
  ratio?: string;
  alt?: string;
  priority?: boolean;
  caption?: boolean;
  zoom?: PhotoZoomArea;
  className?: string;
}

export const focalPosition = (media: Media) =>
  `${media.focalX ?? 50}% ${media.focalY ?? 50}%`;

export function Photo({
  media,
  sizes,
  ratio = "aspect-4/3",
  alt,
  priority = false,
  caption = false,
  zoom,
  className,
}: PhotoProps) {
  if (typeof media !== "object" || !media?.url) return null;

  const hasCaption = (caption && media.caption) || media.credit;

  return (
    <figure className={className}>
      <div
        className={cn("photo", ratio)}
        style={{ "--foyer": focalPosition(media) } as React.CSSProperties}
      >
        <SoftImage
          src={media.url}
          alt={media.alt || alt || ""}
          fill
          sizes={sizes}
          preload={priority}
          fetchPriority={priority ? "high" : undefined}
          blurDataURL={media.blurDataURL}
        />
        {zoom && (
          <PhotoZoom
            photo={toViewerPhoto(media, alt)}
            corner={zoom === "loupe"}
          />
        )}
      </div>
      {hasCaption && (
        <figcaption className="legende">
          {caption && media.caption}
          {media.credit && <PhotoCredit media={media} />}
        </figcaption>
      )}
    </figure>
  );
}
