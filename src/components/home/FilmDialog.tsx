"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { flushSync } from "react-dom";
import { type FilmFormat, FilmPlayer } from "@/components/home/FilmPlayer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { Film, FilmSources } from "@/lib/videos";

interface FilmDialogProps {
  sources: FilmSources;
  label: string;
  title: string;
  endTitle: string;
  children: React.ReactNode;
}

interface FilmChoice {
  film: Film;
  format: FilmFormat;
}

type MorphPhase = "ouvre" | "ferme";

type NetworkNavigator = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
};

const SMALL_PORTRAIT = "(orientation: portrait) and (max-width: 48rem)";
const HANDHELD = "(pointer: coarse)";
const STILL = "(prefers-reduced-motion: reduce)";
const WIDE_PIXELS = 1920;
const FAST_NETWORK = "4g";

function isFrugal() {
  const { connection } = navigator as NetworkNavigator;
  const isSlow =
    connection?.effectiveType !== undefined &&
    connection.effectiveType !== FAST_NETWORK;

  return (
    connection?.saveData === true ||
    isSlow ||
    window.matchMedia(HANDHELD).matches
  );
}

function pickFilm({ master, wide, mobile }: FilmSources): FilmChoice {
  if (mobile && window.matchMedia(SMALL_PORTRAIT).matches)
    return { film: mobile, format: "portrait" };

  const pixels = window.screen.width * window.devicePixelRatio;
  if (wide && (isFrugal() || pixels <= WIDE_PIXELS))
    return { film: wide, format: "paysage" };

  return { film: master, format: "paysage" };
}

function morph(phase: MorphPhase, update: () => void) {
  if (window.matchMedia(STILL).matches || !document.startViewTransition) {
    update();
    return;
  }

  const root = document.documentElement;
  const settle = () => root.removeAttribute("data-film");

  root.dataset.film = phase;
  document
    .startViewTransition(() => flushSync(update))
    .finished.then(settle, settle);
}

export function FilmDialog({
  sources,
  label,
  title,
  endTitle,
  children,
}: FilmDialogProps) {
  const t = useTranslations("film");
  const format = useFormatter();
  const [choice, setChoice] = useState<FilmChoice | null>(null);
  const [resumeAt, setResumeAt] = useState(0);

  const { poster } = sources.master;
  const length =
    sources.duration &&
    format.number(Math.round(sources.duration), {
      style: "unit",
      unit: "second",
    });

  const toggle = (isOpen: boolean) =>
    morph(isOpen ? "ouvre" : "ferme", () =>
      setChoice(isOpen ? pickFilm(sources) : null),
    );

  return (
    <Dialog open={choice !== null} onOpenChange={toggle}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="film-declencheur">
          <span className="film-vignette">
            {poster && <Image src={poster} alt="" fill sizes="7rem" />}
            <Play aria-hidden="true" />
          </span>
          {label}
          {length && <small>{t("length", { duration: length })}</small>}
        </Button>
      </DialogTrigger>
      {choice && (
        <FilmPlayer
          film={choice.film}
          format={choice.format}
          captions={sources.captions}
          title={title}
          endTitle={endTitle}
          fallbackSrc={(sources.wide ?? sources.master).src}
          initialDuration={sources.duration}
          resumeAt={resumeAt}
          onLeave={setResumeAt}
        >
          {children}
        </FilmPlayer>
      )}
    </Dialog>
  );
}
