"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { useLoopScroll } from "@/components/shared/useLoopScroll";
import { Button } from "@/components/ui/button";

const PIXELS_PER_SECOND = 36;

interface TickerItem {
  id: string;
  label: string;
  detail: string;
}

interface TickerProps {
  items: TickerItem[];
  label: string;
  pauseLabel: string;
  playLabel: string;
}

export function Ticker({ items, label, pauseLabel, playLabel }: TickerProps) {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useLoopScroll(track, { speed: PIXELS_PER_SECOND, paused });

  const list = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.id}>
          <span className="toponyme">{item.label}</span>
          <span className="trajet">{item.detail}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="bandeau">
      <div
        ref={track}
        className="bandeau-piste"
        role="group"
        aria-label={label}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be reachable from the keyboard
        tabIndex={0}
      >
        {list(false)}
        {list(true)}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="bandeau-pause"
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        <span className="sr-only">{paused ? playLabel : pauseLabel}</span>
      </Button>
    </div>
  );
}
