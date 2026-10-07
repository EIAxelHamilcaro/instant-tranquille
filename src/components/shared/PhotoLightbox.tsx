"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { PhotoCredit } from "@/components/shared/PhotoCredit";
import type { ViewerSlide } from "@/components/shared/PhotoViewer";
import { SoftImage } from "@/components/shared/SoftImage";
import { usePhotoSwipe } from "@/components/shared/usePhotoSwipe";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface PhotoLightboxProps {
  slides: ViewerSlide[];
  position: number;
  fades: boolean;
  onMove: (delta: number) => void;
  onClose: () => void;
  onCloseAutoFocus: (event: Event) => void;
}

interface LightboxSlideProps {
  slide: ViewerSlide;
  rank: number;
}

const SLIDE_MS = 360;
const SETTLE_MS = 280;
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const PULL_PROPERTIES = ["--glisse-x", "--glisse-y", "--recul"];

function LightboxSlide({ slide, rank }: LightboxSlideProps) {
  const ratio = slide.width / slide.height;
  const isCurrent = rank === 0;

  return (
    <figure
      className="visionneuse-vue"
      style={{ "--rang": rank, "--ratio": ratio } as React.CSSProperties}
      inert={!isCurrent}
      aria-hidden={!isCurrent}
    >
      <div
        className="visionneuse-cadre"
        data-vignette={slide.thumbnail ? "" : undefined}
      >
        <SoftImage
          src={slide.src}
          alt={slide.alt}
          fill
          sizes={`min(100vw, ${Math.round(ratio * 100)}vh)`}
          loading="eager"
          fetchPriority={isCurrent ? "high" : "low"}
          draggable={false}
          blurDataURL={slide.thumbnail ?? slide.blurDataURL}
        />
      </div>
    </figure>
  );
}

export function PhotoLightbox({
  slides,
  position,
  fades,
  onMove,
  onClose,
  onCloseAutoFocus,
}: PhotoLightboxProps) {
  const t = useTranslations("common.viewer");
  const [surface, setSurface] = useState<HTMLDivElement | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const sliding = useRef<Animation | undefined>(undefined);

  const total = slides.length;
  const hasSeveral = total > 1;
  const indexOf = (place: number) => ((place % total) + total) % total;
  const current = slides[indexOf(position)];
  const places = hasSeveral
    ? [position - 1, position, position + 1]
    : [position];

  const releasePull = () => {
    for (const property of PULL_PROPERTIES)
      surface?.style.removeProperty(property);
  };

  const step = (delta: number, from = 0) => {
    if (!hasSeveral) return;

    const element = track.current;
    sliding.current?.finish();
    releasePull();

    if (!element || fades) {
      onMove(delta);
      return;
    }

    const animation = element.animate(
      {
        translate: [
          `${from}px 0px`,
          `calc(${-delta} * (100% + var(--ecart))) 0px`,
        ],
      },
      { duration: SLIDE_MS, easing: EASING, fill: "forwards" },
    );
    const commit = () => {
      flushSync(() => onMove(delta));
      animation.cancel();
      if (sliding.current === animation) sliding.current = undefined;
    };

    sliding.current = animation;
    animation.finished.then(commit, () => {});
  };

  const settle = (x: number, y: number) => {
    releasePull();
    if (fades) return;

    track.current?.animate(
      { translate: [`${x}px ${y}px`, "0px 0px"] },
      { duration: SETTLE_MS, easing: EASING },
    );
  };

  const closeOnBackdrop = (target: EventTarget | null) => {
    if (target instanceof Element && !target.closest("figure > *, footer"))
      onClose();
  };

  usePhotoSwipe(surface, {
    canStep: hasSeveral,
    onStep: step,
    onClose,
    onSettle: settle,
    onTap: closeOnBackdrop,
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  };

  if (!current) return null;

  return (
    <DialogContent
      ref={setSurface}
      className="visionneuse"
      showCloseButton={false}
      aria-describedby={undefined}
      data-fondu={fades ? "" : undefined}
      onKeyDown={handleKeyDown}
      onCloseAutoFocus={onCloseAutoFocus}
    >
      {hasSeveral && (
        <p className="visionneuse-compteur" aria-live="polite">
          <span aria-hidden="true">
            {indexOf(position) + 1} / {total}
          </span>
          <span className="sr-only">
            {t("position", { current: indexOf(position) + 1, total })}
          </span>
        </p>
      )}
      <DialogClose asChild>
        <Button variant="ghost" className="visionneuse-touche fermer">
          <X aria-hidden="true" />
          <span className="sr-only">{t("close")}</span>
        </Button>
      </DialogClose>

      <div ref={track} className="visionneuse-piste">
        {places.map((place) => {
          const slide = slides[indexOf(place)];

          return (
            slide && (
              <LightboxSlide
                key={place}
                slide={slide}
                rank={place - position}
              />
            )
          );
        })}
      </div>

      <footer className="visionneuse-legende">
        <DialogTitle className="visionneuse-titre">
          {current.alt || t("untitled")}
        </DialogTitle>
        <PhotoCredit media={current} />
      </footer>

      {hasSeveral && (
        <div className="visionneuse-pas flex">
          <Button
            variant="ghost"
            className="visionneuse-touche avant"
            onClick={() => step(-1)}
          >
            <ChevronLeft aria-hidden="true" />
            <span className="sr-only">{t("previous")}</span>
          </Button>
          <Button
            variant="ghost"
            className="visionneuse-touche apres"
            onClick={() => step(1)}
          >
            <ChevronRight aria-hidden="true" />
            <span className="sr-only">{t("next")}</span>
          </Button>
        </div>
      )}
    </DialogContent>
  );
}
