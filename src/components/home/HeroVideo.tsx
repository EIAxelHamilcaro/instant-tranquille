"use client";

import { useEffect, useRef } from "react";

export interface HeroVideoSource {
  src: string;
  type: string;
  media?: string;
}

interface HeroVideoProps {
  sources: HeroVideoSource[];
}

const STILL = "(prefers-reduced-motion: reduce)";

export function HeroVideo({ sources }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia(STILL).matches) return;

    const start = () => void video.play().catch(() => undefined);

    if (document.readyState === "complete") {
      start();
      return;
    }

    window.addEventListener("load", start, { once: true });

    return () => window.removeEventListener("load", start);
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    >
      {sources.map(({ src, type, media }) => (
        <source key={src} src={src} type={type} media={media} />
      ))}
    </video>
  );
}
