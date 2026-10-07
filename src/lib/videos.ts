import type { Locale } from "@/i18n/config";
import manifest from "@/lib/video-manifest.json";

export const FILM_SPOKEN_LOCALE: Locale = "fr";

export const FILM_PUBLISHED_ON = "2026-10-06T08:00:00+02:00";

export interface VideoManifest {
  files: string[];
  filmSeconds?: number;
}

export interface FilmCaptions {
  src: string;
  lang: Locale;
  isTranslation: boolean;
}

export interface Film {
  src: string;
  poster?: string;
  hasBurntCaptions?: boolean;
}

export interface FilmSources {
  master: Film;
  wide?: Film;
  mobile?: Film;
  captions?: FilmCaptions;
  duration?: number;
}

const { files, filmSeconds }: VideoManifest = manifest;

export const hasVideo = (file: string) => files.includes(file);

export const videoUrl = (file: string) => `/videos/${file}`;

const optionalUrl = (file: string) =>
  hasVideo(file) ? videoUrl(file) : undefined;

function filmCaptions(locale: Locale): FilmCaptions | undefined {
  const translated = optionalUrl(`film.${locale}.vtt`);
  if (translated)
    return {
      src: translated,
      lang: locale,
      isTranslation: locale !== FILM_SPOKEN_LOCALE,
    };

  const spoken = optionalUrl("film.vtt");

  return spoken
    ? { src: spoken, lang: FILM_SPOKEN_LOCALE, isTranslation: false }
    : undefined;
}

export const filmSources = (locale: Locale): FilmSources | null => {
  if (!hasVideo("film.mp4")) return null;

  const poster = optionalUrl("film-poster.jpg");
  const wide = optionalUrl("film-1080.mp4");
  const mobile = optionalUrl("film-mobile.mp4");

  return {
    master: { src: videoUrl("film.mp4"), poster },
    wide: wide ? { src: wide, poster } : undefined,
    mobile: mobile
      ? {
          src: mobile,
          poster: optionalUrl("film-poster-mobile.jpg") ?? poster,
          hasBurntCaptions: true,
        }
      : undefined,
    captions: filmCaptions(locale),
    duration: filmSeconds,
  };
};
