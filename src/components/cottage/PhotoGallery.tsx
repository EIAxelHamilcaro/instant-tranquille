"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/shared/Container";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

type GalleryItem = {
  image?: unknown;
  caption?: string | null;
};

type ResolvedItem = {
  image: Parameters<typeof PayloadImage>[0]["media"];
  caption: string | null;
  key: string;
};

function resolveItems(gallery: GalleryItem[]): ResolvedItem[] {
  return gallery.flatMap((item, i) => {
    const hasImage =
      item.image &&
      typeof item.image === "object" &&
      (item.image as Record<string, unknown>).url;
    if (!hasImage) return [];
    const key =
      item.caption ?? String((item.image as Record<string, unknown>).url ?? i);
    return [
      {
        image: item.image as Parameters<typeof PayloadImage>[0]["media"],
        caption: item.caption ?? null,
        key,
      },
    ];
  });
}

interface LightboxProps {
  items: ResolvedItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  galleryTitle: string;
  tClose: string;
  tPrev: string;
  tNext: string;
  tCounter: (current: number, total: number) => string;
}

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
  galleryTitle,
  tClose,
  tPrev,
  tNext,
  tCounter,
}: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const item = items[index];

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        onPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        onNext();
        return;
      }

      if (e.key === "Tab" && overlayRef.current) {
        const focusable = Array.from(
          overlayRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleOverlayKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current && e.key === "Enter") onClose();
  };

  if (!item) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={galleryTitle}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
    >
      <button
        ref={closeRef}
        type="button"
        aria-label={tClose}
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <button
        type="button"
        aria-label={tPrev}
        onClick={onPrev}
        disabled={items.length <= 1}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        aria-label={tNext}
        onClick={onNext}
        disabled={items.length <= 1}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <figure className="flex max-h-[90vh] max-w-[90vw] flex-col items-center gap-3">
        <div className="relative max-h-[80vh] max-w-[90vw] overflow-hidden rounded-lg">
          <PayloadImage
            media={item.image}
            size="hero"
            alt={item.caption || galleryTitle}
            className="max-h-[80vh] max-w-[90vw] object-contain"
          />
        </div>
        {item.caption && (
          <figcaption className="text-center text-sm text-white/70">
            {item.caption}
          </figcaption>
        )}
        <p className="text-xs text-white/50" aria-live="polite">
          {tCounter(index + 1, items.length)}
        </p>
      </figure>
    </div>
  );
}

interface PhotoGalleryProps {
  gallery: GalleryItem[];
}

export function PhotoGallery({ gallery }: PhotoGalleryProps) {
  const t = useTranslations("cottage");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const items = resolveItems(gallery ?? []);

  const openLightbox = useCallback((idx: number) => {
    setLightboxIndex(idx);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev !== null) {
        setTimeout(() => {
          triggerRefs.current.get(prev)?.focus();
        }, 0);
      }
      return null;
    });
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % items.length,
    );
  }, [items.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + items.length) % items.length,
    );
  }, [items.length]);

  if (!items.length) return null;

  const useFallbackGrid = items.length < 3;

  return (
    <section className="bg-sand-100 py-20">
      <Container>
        <SectionHeading title={t("galleryTitle")} />

        {useFallbackGrid ? (
          <div
            className={cn(
              "grid gap-4",
              items.length === 1 ? "grid-cols-1" : "grid-cols-2",
            )}
          >
            {items.map((item, i) => (
              <button
                key={item.key}
                ref={(el) => {
                  if (el) triggerRefs.current.set(i, el);
                  else triggerRefs.current.delete(i);
                }}
                type="button"
                aria-label={item.caption || t("openImage")}
                onClick={() => openLightbox(i)}
                className="overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[--color-primary]"
              >
                <PayloadImage
                  media={item.image}
                  size="card"
                  alt={item.caption || t("galleryTitle")}
                  className="h-full w-full object-cover motion-safe:transition motion-safe:duration-300 hover:scale-[1.02]"
                />
              </button>
            ))}
          </div>
        ) : (
          <div
            className="columns-2 gap-4 md:columns-3 lg:columns-4"
            style={{ columnFill: "balance" }}
          >
            {items.map((item, i) => (
              <button
                key={item.key}
                ref={(el) => {
                  if (el) triggerRefs.current.set(i, el);
                  else triggerRefs.current.delete(i);
                }}
                type="button"
                aria-label={item.caption || t("openImage")}
                onClick={() => openLightbox(i)}
                className="mb-4 block w-full overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[--color-primary]"
              >
                <PayloadImage
                  media={item.image}
                  size="card"
                  alt={item.caption || t("galleryTitle")}
                  className="w-full motion-safe:transition motion-safe:duration-300 hover:scale-[1.02]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </button>
            ))}
          </div>
        )}

        {lightboxIndex !== null && (
          <Lightbox
            items={items}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
            galleryTitle={t("galleryTitle")}
            tClose={t("lightboxClose")}
            tPrev={t("lightboxPrev")}
            tNext={t("lightboxNext")}
            tCounter={(current, total) =>
              t("lightboxCounter", { current, total })
            }
          />
        )}
      </Container>
    </section>
  );
}
