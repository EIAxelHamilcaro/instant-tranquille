import Image from "next/image";
import { HeroVideo } from "@/components/home/HeroVideo";
import { hasVideo, videoUrl } from "@/lib/videos";
import type { Media } from "@/payload-types";

interface HeroFilmProps {
  fallback: number | Media | null | undefined;
  alt: string;
}

const SMALL_SCREEN = "(max-width: 48rem)";
const LOOPS = [
  { file: "hero-mobile.webm", type: "video/webm", media: SMALL_SCREEN },
  { file: "hero-mobile.mp4", type: "video/mp4", media: SMALL_SCREEN },
  { file: "hero.webm", type: "video/webm" },
  { file: "hero.mp4", type: "video/mp4" },
];

export function HeroFilm({ fallback, alt }: HeroFilmProps) {
  const poster = hasVideo("hero-poster.jpg")
    ? videoUrl("hero-poster.jpg")
    : typeof fallback === "object"
      ? fallback?.url
      : null;
  const sources = LOOPS.filter(({ file }) => hasVideo(file)).map(
    ({ file, type, media }) => ({ src: videoUrl(file), type, media }),
  );

  return (
    <div className="hero-film">
      {poster && (
        <Image
          src={poster}
          alt={alt}
          fill
          sizes="(max-width: 40rem) 160vw, (min-width: 120rem) 1920px, 100vw"
          preload
          fetchPriority="high"
        />
      )}
      {sources.length > 0 && <HeroVideo sources={sources} />}
    </div>
  );
}
