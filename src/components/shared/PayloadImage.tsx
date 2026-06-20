import Image from "next/image";
import { ImagePlaceholder } from "./ImagePlaceholder";

type MediaObject = {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  blurDataURL?: string | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
    hero?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
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
  sizes?: string;
}

export function PayloadImage({
  media,
  size = "card",
  alt,
  className,
  fill,
  priority,
  sizes,
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
  const quality = priority ? 85 : 75;
  const blurProps = media.blurDataURL
    ? ({ placeholder: "blur", blurDataURL: media.blurDataURL } as const)
    : {};

  const defaultSizes =
    size === "hero"
      ? "100vw"
      : size === "card"
        ? "(max-width: 768px) 100vw, 768px"
        : "(max-width: 640px) 50vw, 400px";

  if (fill) {
    return (
      <Image
        src={src}
        alt={media.alt || alt || ""}
        fill
        className={className}
        priority={priority}
        quality={quality}
        {...blurProps}
        sizes={sizes ?? defaultSizes}
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
      quality={quality}
      {...blurProps}
      sizes={sizes ?? defaultSizes}
    />
  );
}
