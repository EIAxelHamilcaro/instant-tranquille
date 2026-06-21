"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
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
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

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
  const blurUrl = media.blurDataURL;

  const defaultSizes =
    size === "hero"
      ? "100vw"
      : size === "card"
        ? "(max-width: 768px) 100vw, 768px"
        : "(max-width: 640px) 50vw, 400px";

  const imgClass = cn(
    className,
    "transition-opacity duration-700 ease-out motion-reduce:transition-none",
    loaded ? "opacity-100" : "opacity-0",
  );

  const blurLayer = blurUrl ? (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 scale-[1.04] bg-cover bg-center transition-opacity duration-700 ease-out",
        loaded ? "opacity-0" : "opacity-100",
      )}
      style={{ backgroundImage: `url(${blurUrl})` }}
    />
  ) : null;

  if (fill) {
    return (
      <>
        {blurLayer}
        <Image
          ref={imgRef}
          src={src}
          alt={media.alt || alt || ""}
          fill
          className={imgClass}
          priority={priority}
          quality={quality}
          sizes={sizes ?? defaultSizes}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      </>
    );
  }

  const blurProps = blurUrl
    ? ({ placeholder: "blur", blurDataURL: blurUrl } as const)
    : {};

  return (
    <Image
      src={src}
      alt={media.alt || alt || ""}
      width={sizeData?.width || dimensions.width}
      height={sizeData?.height || dimensions.height}
      className={className}
      priority={priority}
      quality={quality}
      sizes={sizes ?? defaultSizes}
      {...blurProps}
    />
  );
}
