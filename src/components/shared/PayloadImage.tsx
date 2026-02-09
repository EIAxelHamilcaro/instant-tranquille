import Image from "next/image";
import { ImagePlaceholder } from "./ImagePlaceholder";

type MediaObject = {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    thumbnail?: { url?: string | null; width?: number | null; height?: number | null } | null;
    card?: { url?: string | null; width?: number | null; height?: number | null } | null;
    hero?: { url?: string | null; width?: number | null; height?: number | null } | null;
  } | null;
};

const sizeDimensions = {
  thumbnail: { width: 400, height: 300 },
  card: { width: 768, height: 512 },
  hero: { width: 1920, height: 1080 },
} as const;

interface PayloadImageProps {
  media: MediaObject | string | number | null | undefined;
  size?: "thumbnail" | "card" | "hero";
  alt?: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

export function PayloadImage({
  media,
  size = "card",
  alt,
  className,
  fill,
  priority,
}: PayloadImageProps) {
  if (!media || typeof media === "string" || typeof media === "number") {
    return <ImagePlaceholder aspectRatio="16/9" className={className} />;
  }

  const sizeData = media.sizes?.[size];
  const src = sizeData?.url || media.url;

  if (!src) {
    return <ImagePlaceholder aspectRatio="16/9" className={className} />;
  }

  const dimensions = sizeDimensions[size];

  if (fill) {
    return (
      <Image
        src={src}
        alt={media.alt || alt || ""}
        fill
        className={className}
        priority={priority}
        sizes={
          size === "hero"
            ? "100vw"
            : size === "card"
              ? "(max-width: 768px) 100vw, 768px"
              : "400px"
        }
      />
    );
  }

  return (
    <Image
      src={src}
      alt={media.alt || alt || ""}
      width={sizeData?.width || dimensions.width}
      height={sizeData?.height || dimensions.height}
      className={className}
      priority={priority}
    />
  );
}
