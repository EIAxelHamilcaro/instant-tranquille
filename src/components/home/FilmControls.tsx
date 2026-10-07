"use client";

import {
  Captions,
  CaptionsOff,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Slider } from "radix-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilmControlsProps {
  isPlaying: boolean;
  time: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  hasCaptions: boolean;
  showsCaptions: boolean;
  canFullscreen: boolean;
  isFullscreen: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleCaptions: () => void;
  onToggleFullscreen: () => void;
}

interface FilmSliderProps {
  className: string;
  label: string;
  valueText: string;
  value: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

const SEEK_PRECISION = 0.1;
const VOLUME_STEP = 0.05;

function clock(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));

  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function leaveArrowsToShortcuts(event: React.KeyboardEvent) {
  if (event.key.startsWith("Arrow")) event.preventDefault();
}

function FilmSlider({
  className,
  label,
  valueText,
  value,
  max,
  step,
  onChange,
  onKeyDown,
}: FilmSliderProps) {
  return (
    <Slider.Root
      className={cn("film-curseur", className)}
      value={[value]}
      max={max}
      step={step}
      onValueChange={([next]) => next !== undefined && onChange(next)}
      onKeyDown={onKeyDown}
    >
      <Slider.Track className="film-piste">
        <Slider.Range className="film-jauge" />
      </Slider.Track>
      <Slider.Thumb
        className="film-poignee"
        aria-label={label}
        aria-valuetext={valueText}
      />
    </Slider.Root>
  );
}

export function FilmControls({
  isPlaying,
  time,
  duration,
  volume,
  isMuted,
  hasCaptions,
  showsCaptions,
  canFullscreen,
  isFullscreen,
  onTogglePlay,
  onSeek,
  onToggleMute,
  onVolumeChange,
  onToggleCaptions,
  onToggleFullscreen,
}: FilmControlsProps) {
  const t = useTranslations("film");
  const elapsed = clock(time);
  const total = clock(duration);
  const heard = isMuted ? 0 : volume;

  return (
    <fieldset
      className="film-commandes flex items-center"
      aria-label={t("controls")}
    >
      <Button
        variant="ghost"
        size="icon-lg"
        className="film-touche"
        aria-label={t(isPlaying ? "pause" : "play")}
        onClick={onTogglePlay}
      >
        {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </Button>
      <span className="film-temps">{elapsed}</span>
      <FilmSlider
        className="film-avancement"
        label={t("progress")}
        valueText={t("position", { current: elapsed, total })}
        value={time}
        max={duration || 1}
        step={SEEK_PRECISION}
        onChange={onSeek}
        onKeyDown={leaveArrowsToShortcuts}
      />
      <span className="film-temps film-duree">{total}</span>
      <Button
        variant="ghost"
        size="icon-lg"
        className="film-touche"
        aria-label={t("mute")}
        aria-pressed={isMuted}
        onClick={onToggleMute}
      >
        {isMuted ? (
          <VolumeX aria-hidden="true" />
        ) : (
          <Volume2 aria-hidden="true" />
        )}
      </Button>
      <FilmSlider
        className="film-volume"
        label={t("volume")}
        valueText={t("volumeLevel", { percent: Math.round(heard * 100) })}
        value={heard}
        max={1}
        step={VOLUME_STEP}
        onChange={onVolumeChange}
      />
      {hasCaptions && (
        <Button
          variant="ghost"
          size="icon-lg"
          className="film-touche"
          aria-label={t("captions")}
          aria-pressed={showsCaptions}
          onClick={onToggleCaptions}
        >
          {showsCaptions ? (
            <Captions aria-hidden="true" />
          ) : (
            <CaptionsOff aria-hidden="true" />
          )}
        </Button>
      )}
      {canFullscreen && (
        <Button
          variant="ghost"
          size="icon-lg"
          className="film-touche"
          aria-label={t("fullscreen")}
          aria-pressed={isFullscreen}
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize aria-hidden="true" />
          ) : (
            <Maximize aria-hidden="true" />
          )}
        </Button>
      )}
    </fieldset>
  );
}
