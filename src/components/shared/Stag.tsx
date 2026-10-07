"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type StagSequence =
  | "broute"
  | "ecoute"
  | "brame"
  | "marche"
  | "gratte"
  | "depart";
type Place = 0 | 1;

const BODY =
  "M23 51C21 44 30 40 41 42C52 44 60 43 68 40C77 38 83 45 84 54C84 63 79 69 72 71C60 74 46 72 38 70C29 69 24 62 23 51Z";
const TAIL = "M24 47C19 49 19 55 21 59C25 56 27 52 26 48Z";
const THIGH = "M26 56C23 65 22 74 24 82L30.5 83C34 77 38 70 40 63Z";
const HIND_SHANK = "M24 80.5L26.5 104L31 104L30.5 81.5Z";
const FOREARM = "M67 58L66.5 84.5L72 84.5L76 60Z";
const FORE_SHANK = "M66.5 83L67 104L71.5 104L72 83Z";
const NECK =
  "M61 44C67 36 74 27 81 17L93 27C91 36 91 49 85 63C77 60 67 52 61 44Z";
const HEAD =
  "M80 20C82 14 90 12 95 16L106 24C109 26 108 30 104 30C99 31 93 31 88 29C84 28 81 25 80 20Z";
const EAR = "M83 17C78 12 74 10 70 11C72 16 77 20 83 20Z";
const ANTLER =
  "M87 14C84 4 78 -6 80 -18M87 13Q93 8 97 9M84 3Q90 -1 93 -5M81 -7Q87 -10 89 -15M80 -18L76 -27M80 -18L84 -27M80 -13Q75 -17 72 -22";

const STILL = "(prefers-reduced-motion: reduce)";
const DECK: StagSequence[] = [
  "broute",
  "ecoute",
  "marche",
  "gratte",
  "broute",
  "ecoute",
  "marche",
  "brame",
];
const FIRST_PAUSE = 1_400;
const SHORTEST_PAUSE = 7_000;
const LONGEST_PAUSE = 19_000;

interface StagProps {
  className?: string;
  sequence?: StagSequence;
}

interface LegProps {
  className: string;
  upper: string;
  lower: string;
}

function Leg({ className, upper, lower }: LegProps) {
  return (
    <g className={cn("cerf-patte", className)}>
      <path d={upper} />
      <path className="cerf-bas" d={lower} />
    </g>
  );
}

export function Stag({ className, sequence }: StagProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [current, setCurrent] = useState<StagSequence>();
  const [place, setPlace] = useState<Place>(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || window.matchMedia(STILL).matches) return;

    const deck = sequence ? [sequence, ...DECK] : DECK;
    let visible = false;
    let turn = 0;
    let playing: StagSequence | undefined;
    let timer: number | undefined;

    const schedule = (wait: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(next, wait);
    };

    const pause = () =>
      SHORTEST_PAUSE + Math.random() * (LONGEST_PAUSE - SHORTEST_PAUSE);

    const next = () => {
      const watched = visible && document.visibilityState === "visible";
      const upcoming = deck[turn % deck.length];

      if (playing || !watched || !upcoming) {
        schedule(pause());
        return;
      }

      turn += 1;
      playing = upcoming;
      setCurrent(upcoming);
    };

    const rest = (event: AnimationEvent) => {
      if (event.target !== svg) return;

      const finished = playing;
      playing = undefined;
      setCurrent(undefined);

      if (finished === "depart") {
        setGone(true);
        return;
      }

      if (finished === "marche") setPlace((from) => (from === 0 ? 1 : 0));
      schedule(pause());
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const seen = entry?.isIntersecting ?? false;
        if (seen && !visible && !playing) schedule(FIRST_PAUSE);
        visible = seen;
      },
      { threshold: 0.5 },
    );

    observer.observe(svg);
    svg.addEventListener("animationend", rest);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      svg.removeEventListener("animationend", rest);
    };
  }, [sequence]);

  return (
    <svg
      ref={ref}
      className={cn("cerf", className)}
      data-sequence={current}
      data-place={place}
      data-absent={gone ? "" : undefined}
      viewBox="0 -32 124 140"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <g className="cerf-allure">
        <g className="cerf-sens">
          <g className="cerf-masse">
            <g transform="translate(7 0)">
              <Leg
                className="cerf-arriere cerf-loin"
                upper={THIGH}
                lower={HIND_SHANK}
              />
            </g>
            <g transform="translate(-6 0)">
              <Leg
                className="cerf-avant cerf-loin"
                upper={FOREARM}
                lower={FORE_SHANK}
              />
            </g>
            <path className="cerf-queue" d={TAIL} />
            <path className="cerf-corps" d={BODY} />
            <Leg
              className="cerf-arriere cerf-pres"
              upper={THIGH}
              lower={HIND_SHANK}
            />
            <Leg
              className="cerf-avant cerf-pres"
              upper={FOREARM}
              lower={FORE_SHANK}
            />
            <g className="cerf-encolure">
              <path d={NECK} />
              <g className="cerf-tete">
                <path
                  className="cerf-bois cerf-bois-loin"
                  d={ANTLER}
                  transform="translate(-4 1)"
                />
                <g transform="translate(-3 -1)">
                  <path className="cerf-oreille cerf-oreille-loin" d={EAR} />
                </g>
                <path d={HEAD} />
                <path className="cerf-oreille" d={EAR} />
                <path className="cerf-bois" d={ANTLER} />
                <circle className="cerf-oeil" cx="93" cy="20" r="0.9" />
                <g className="cerf-buee">
                  <circle cx="110" cy="27" r="2.2" />
                  <circle cx="114" cy="24.5" r="3" />
                  <circle cx="118.5" cy="27.5" r="2.4" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
