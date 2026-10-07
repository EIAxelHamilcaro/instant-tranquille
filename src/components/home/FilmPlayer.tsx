"use client";

import { Play, RotateCcw, VolumeX, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { FilmControls } from "@/components/home/FilmControls";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Film, FilmCaptions } from "@/lib/videos";

export type FilmFormat = "paysage" | "portrait";

export interface FilmPlayerProps {
  film: Film;
  format: FilmFormat;
  captions?: FilmCaptions;
  title: string;
  endTitle: string;
  fallbackSrc: string;
  initialDuration?: number;
  resumeAt: number;
  onLeave: (time: number) => void;
  children: React.ReactNode;
}

type Stage = "film" | "fin" | "incident";

const IDLE_DELAY = 2600;
const SEEK_STEP = 5;
const DEFAULT_VOLUME = 0.3;
const REFUSED = "NotAllowedError";

const isRefusal = (error: unknown) =>
  error instanceof DOMException && error.name === REFUSED;

export function FilmPlayer({
  film,
  format,
  captions,
  title,
  endTitle,
  fallbackSrc,
  initialDuration = 0,
  resumeAt,
  onLeave,
  children,
}: FilmPlayerProps) {
  const t = useTranslations("film");
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const ending = useRef<HTMLHeadingElement>(null);
  const idleTimer = useRef<number | undefined>(undefined);

  const track = film.hasBurntCaptions ? undefined : captions;

  const [stage, setStage] = useState<Stage>("film");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [isIdle, setIsIdle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [needsSound, setNeedsSound] = useState(false);
  const [showsCaptions, setShowsCaptions] = useState(
    track?.isTranslation === true,
  );
  const [cue, setCue] = useState("");
  const [time, setTime] = useState(resumeAt);
  const [duration, setDuration] = useState(initialDuration);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState(false);

  const bindVideo = useCallback(
    (player: HTMLVideoElement) => {
      video.current = player;
      player.volume = DEFAULT_VOLUME;

      const [cues] = player.textTracks;
      const readCue = () =>
        setCue(
          Array.from(cues?.activeCues ?? [], (active) =>
            active instanceof VTTCue ? active.text : "",
          ).join("\n"),
        );
      const readFullscreen = () =>
        setIsFullscreen(document.fullscreenElement === frame.current);

      const start = async () => {
        try {
          await player.play();
        } catch (error) {
          if (!isRefusal(error)) return;

          player.muted = true;
          setNeedsSound(true);
          setShowsCaptions(true);
          await player.play().catch(() => setIsWaiting(false));
        }
      };

      if (cues) cues.mode = "hidden";
      cues?.addEventListener("cuechange", readCue);
      document.addEventListener("fullscreenchange", readFullscreen);

      player.src = film.src;
      player.currentTime = resumeAt;
      void start();

      return () => {
        onLeave(player.ended ? 0 : player.currentTime);
        cues?.removeEventListener("cuechange", readCue);
        document.removeEventListener("fullscreenchange", readFullscreen);
        window.clearTimeout(idleTimer.current);
        player.pause();
        video.current = null;
        player.removeAttribute("src");
        player.load();
      };
    },
    [film.src, resumeAt, onLeave],
  );

  useEffect(() => {
    if (stage === "fin") ending.current?.focus();
  }, [stage]);

  const wake = () => {
    setIsIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(setIsIdle, IDLE_DELAY, true);
  };

  const resume = () => video.current?.play().catch(() => setIsPlaying(false));

  const togglePlay = () => {
    if (video.current?.paused) void resume();
    else video.current?.pause();
  };

  const seek = (next: number) => {
    const player = video.current;
    if (!player) return;

    player.currentTime = Math.min(Math.max(next, 0), duration);
    setTime(player.currentTime);
  };

  const setSound = (isOn: boolean) => {
    if (video.current) video.current.muted = !isOn;
    setNeedsSound(false);
  };

  const changeVolume = (next: number) => {
    if (!video.current) return;

    video.current.volume = next;
    setSound(next > 0);
  };

  const toggleCaptions = () => setShowsCaptions((shown) => !shown);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void frame.current?.requestFullscreen();
  };

  const replay = () => {
    seek(0);
    setStage("film");
    void resume();
  };

  const retry = () => {
    const player = video.current;
    if (!player) return;

    setStage("film");
    setIsWaiting(true);
    player.load();
    player.currentTime = time;
    void resume();
  };

  const shortcuts: Record<string, () => void> = {
    " ": togglePlay,
    k: togglePlay,
    m: () => setSound(isMuted),
    c: toggleCaptions,
    f: toggleFullscreen,
    arrowleft: () => seek(time - SEEK_STEP),
    arrowright: () => seek(time + SEEK_STEP),
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    wake();
    if (stage !== "film" || event.metaKey || event.ctrlKey || event.altKey)
      return;

    const key = event.key.toLowerCase();
    const origin = event.target instanceof Element ? event.target : null;
    const isNative =
      (key === " " && origin?.closest("button, a")) ||
      (key.startsWith("arrow") && origin?.closest(".film-volume"));
    const shortcut = shortcuts[key];
    if (isNative || !shortcut) return;

    event.preventDefault();
    shortcut();
  };

  const handleFocus = (event: React.FocusEvent) => {
    if (event.target.matches(":focus-visible")) wake();
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (event.pointerType !== "touch") wake();
  };

  const handleSurfaceClick = (event: React.MouseEvent) => {
    const isTouch =
      event.nativeEvent instanceof PointerEvent &&
      event.nativeEvent.pointerType === "touch";

    if (isTouch && isIdle && isPlaying) wake();
    else togglePlay();
  };

  return (
    <DialogContent
      ref={frame}
      className="cinema section-sombre"
      showCloseButton={false}
      aria-describedby={undefined}
      data-format={format}
      data-etat={stage}
      data-repos={isIdle && isPlaying ? "" : undefined}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onFocusCapture={handleFocus}
    >
      <video
        ref={bindVideo}
        tabIndex={-1}
        poster={film.poster}
        preload="none"
        playsInline
        onClick={handleSurfaceClick}
        onPlay={() => {
          setIsPlaying(true);
          wake();
        }}
        onPause={() => setIsPlaying(false)}
        onLoadStart={() => setIsWaiting(true)}
        onWaiting={() => setIsWaiting(true)}
        onCanPlay={() => setIsWaiting(false)}
        onPlaying={() => setIsWaiting(false)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onDurationChange={(event) => {
          if (Number.isFinite(event.currentTarget.duration))
            setDuration(event.currentTarget.duration);
        }}
        onVolumeChange={(event) => {
          setVolume(event.currentTarget.volume);
          setIsMuted(event.currentTarget.muted);
        }}
        onEnded={() => setStage("fin")}
        onError={() => setStage("incident")}
      >
        <track
          kind="captions"
          src={track?.src}
          srcLang={track?.lang}
          label={t("captions")}
        />
      </video>

      {stage === "film" && (
        <>
          {isWaiting && (
            <p className="film-attente" role="status">
              {t("loading")}
            </p>
          )}
          {!isWaiting && !isPlaying && (
            <Play className="film-relance" aria-hidden="true" />
          )}
          {showsCaptions && cue && (
            <p className="film-sous-titre" lang={track?.lang}>
              {cue}
            </p>
          )}
          <FilmControls
            isPlaying={isPlaying}
            time={time}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            hasCaptions={track !== undefined}
            showsCaptions={showsCaptions}
            canFullscreen={document.fullscreenEnabled}
            isFullscreen={isFullscreen}
            onTogglePlay={togglePlay}
            onSeek={seek}
            onToggleMute={() => setSound(isMuted)}
            onVolumeChange={changeVolume}
            onToggleCaptions={toggleCaptions}
            onToggleFullscreen={toggleFullscreen}
          />
          {needsSound && (
            <Button className="ui film-son" onClick={() => setSound(true)}>
              <VolumeX aria-hidden="true" />
              {t("unmute")}
            </Button>
          )}
        </>
      )}

      {stage === "fin" && (
        <div className="film-fin grid content-end justify-items-start">
          {film.poster && <Image src={film.poster} alt="" fill sizes="100vw" />}
          <h2 ref={ending} tabIndex={-1}>
            {endTitle}
          </h2>
          {children}
          <Button variant="ghost" className="ui film-revoir" onClick={replay}>
            <RotateCcw aria-hidden="true" />
            {t("replay")}
          </Button>
        </div>
      )}

      {stage === "incident" && (
        <div
          className="film-incident grid content-center justify-items-start"
          role="alert"
        >
          <h2>{t("errorTitle")}</h2>
          <p>{t("errorText")}</p>
          <Button className="ui" onClick={retry}>
            {t("retry")}
          </Button>
          <a
            className="ui lien"
            href={fallbackSrc}
            target="_blank"
            rel="noopener"
          >
            {t("openFile")}
          </a>
        </div>
      )}

      <DialogTitle className="cinema-titre">{title}</DialogTitle>
      <DialogClose asChild>
        <Button variant="ghost" className="ui cinema-fermer">
          {t("close")}
          <X aria-hidden="true" />
        </Button>
      </DialogClose>
    </DialogContent>
  );
}
