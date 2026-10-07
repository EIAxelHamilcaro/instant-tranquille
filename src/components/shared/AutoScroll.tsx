"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { useLoopScroll } from "@/components/shared/useLoopScroll";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PIXELS_PER_SECOND = 16;

interface AutoScrollProps {
  children: React.ReactNode;
  pauseLabel: string;
  playLabel: string;
  className?: string;
}

export function AutoScroll({
  children,
  pauseLabel,
  playLabel,
  className,
}: AutoScrollProps) {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useLoopScroll(track, { speed: PIXELS_PER_SECOND, paused });

  return (
    <div className={cn("defile-cadre", className)}>
      <div ref={track} className="defile">
        <ul>{children}</ul>
        <ul aria-hidden="true" inert>
          {children}
        </ul>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="defile-pause"
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        <span className="sr-only">{paused ? playLabel : pauseLabel}</span>
      </Button>
    </div>
  );
}
