"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type Sequence =
  | "attente"
  | "entree"
  | "peche"
  | "envol"
  | "cherche"
  | "regard"
  | "frisson"
  | "depart"
  | "guette"
  | "marche"
  | "toilette"
  | "etire"
  | "gobe"
  | "secoue"
  | "crie";
type Entrance = "load" | "visible";
type Scene = "pond" | "search" | "still" | "tableau";

interface Pause {
  shortest: number;
  longest: number;
}

interface Repertoire {
  deck: Sequence[];
  pause: Pause;
}

const WING =
  "M37 30.5C29 26.5 17 27 6 32l5 2-3.5 2.5 6 .5-2 3C21 41 31 39.5 37 36.5Z";
const STILL = "(prefers-reduced-motion: reduce)";
const LINK: Repertoire = {
  deck: ["regard", "frisson", "regard", "envol"],
  pause: { shortest: 18_000, longest: 40_000 },
};
const SCENES: Record<Scene, Repertoire> = {
  pond: {
    deck: ["peche", "regard", "envol", "frisson"],
    pause: { shortest: 6_000, longest: 11_000 },
  },
  search: {
    deck: ["cherche", "regard"],
    pause: { shortest: 1_800, longest: 4_000 },
  },
  still: { deck: [], pause: { shortest: 60_000, longest: 60_000 } },
  tableau: {
    deck: [
      "guette",
      "peche",
      "gobe",
      "toilette",
      "regard",
      "marche",
      "etire",
      "frisson",
      "guette",
      "secoue",
      "peche",
      "regard",
      "crie",
    ],
    pause: { shortest: 5_000, longest: 13_000 },
  },
};
const SECOND_DISTURBANCE = 8_000;
const FIRST_SEQUENCE: Record<Entrance, Sequence> = {
  load: "entree",
  visible: "attente",
};

interface EmblemProps {
  className: string;
  children?: ReactNode;
  entrance?: Entrance;
  scene?: Scene;
  play?: Sequence;
  size?: number;
}

export function Emblem({
  className,
  children,
  entrance,
  scene = "pond",
  play,
  size,
}: EmblemProps) {
  const ref = useRef<SVGSVGElement>(null);
  const first = entrance && FIRST_SEQUENCE[entrance];
  const current = useRef(first);
  const [sequence, setSequence] = useState(first);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || window.matchMedia(STILL).matches) return;

    const opening = document.documentElement.hasAttribute("data-ouverture");

    if (opening && !svg.closest(".ouverture")) {
      current.current = undefined;
      setSequence(undefined);
    }

    const host = svg.closest("a, button");
    const { deck, pause } = host?.tagName === "A" ? LINK : SCENES[scene];
    let visible = false;
    let turn = 0;
    let lastCatch = Number.NEGATIVE_INFINITY;
    let timer: number | undefined;

    const start = (next: Sequence) => {
      current.current = next;
      setSequence(next);
    };

    const schedule = () => {
      const wait =
        pause.shortest + Math.random() * (pause.longest - pause.shortest);

      window.clearTimeout(timer);
      timer = window.setTimeout(idle, wait);
    };

    const idle = () => {
      const watched = visible && document.visibilityState === "visible";
      const next = deck[turn % deck.length];

      if (current.current || !watched || !next || host?.matches(":hover")) {
        schedule();
        return;
      }

      turn += 1;
      start(next);
    };

    const disturb = () => {
      if (current.current) return;

      if (host?.tagName === "BUTTON") {
        start("frisson");
        return;
      }

      const again = performance.now() - lastCatch < SECOND_DISTURBANCE;
      start(again ? "envol" : "peche");
    };

    const disturbOnFocus = () => {
      if (host?.matches(":focus-visible")) disturb();
    };

    const rest = (event: AnimationEvent) => {
      if (event.target !== svg) return;
      if (current.current === "peche") lastCatch = performance.now();

      current.current = undefined;
      setSequence(undefined);
      schedule();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible && current.current === "attente") start("entree");
      },
      { threshold: 0.6 },
    );

    observer.observe(svg);
    svg.addEventListener("animationend", rest);
    host?.addEventListener("pointerenter", disturb);
    host?.addEventListener("focus", disturbOnFocus);
    schedule();

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      svg.removeEventListener("animationend", rest);
      host?.removeEventListener("pointerenter", disturb);
      host?.removeEventListener("focus", disturbOnFocus);
    };
  }, [scene]);

  useEffect(() => {
    if (!play || window.matchMedia(STILL).matches) return;

    current.current = play;
    setSequence(play);
  }, [play]);

  return (
    <svg
      ref={ref}
      className={className}
      data-sequence={sequence}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
      <g className="heron-rides" strokeWidth="1.5">
        <ellipse
          className="heron-ride"
          cx="29"
          cy="56.5"
          rx="18"
          ry="4.5"
          opacity="0"
        />
        <ellipse
          className="heron-ride"
          cx="29"
          cy="56.5"
          rx="18"
          ry="4.5"
          opacity="0"
        />
      </g>
      <ellipse
        className="heron-onde"
        cx="29"
        cy="56.5"
        rx="18"
        ry="4.5"
        strokeWidth="3"
      />
      <g className="heron">
        <g className="heron-haut">
          <g transform="translate(0 -13)">
            <path
              className="heron-patte-levee"
              strokeWidth="3"
              d="M33 45.5v11"
            />
          </g>
          <g className="heron-cuisse" strokeWidth="3">
            <path d="M29 47v4.75" />
            <path className="heron-tibia" d="M29 51.75v4.75" />
          </g>
          <g className="heron-buste">
            <g
              className="heron-aile heron-aile-loin"
              fill="currentColor"
              stroke="none"
            >
              <path
                transform="translate(38 31.5) rotate(-24) scale(.5) translate(-36 -33)"
                d={WING}
              />
            </g>
            <g className="heron-cou">
              <path d="M32.5 18c1.5 5 7.5 7 7.5 13" />
              <circle
                className="heron-bouchee"
                r="3.3"
                fill="currentColor"
                stroke="none"
                opacity="0"
              />
              <g className="heron-nuque">
                <path d="M40 10c-6 0-9 3-7.5 8" />
                <circle
                  className="heron-bouchee"
                  r="3.3"
                  fill="currentColor"
                  stroke="none"
                  opacity="0"
                />
                <g className="heron-tete" fill="currentColor" stroke="none">
                  <g transform="translate(56 11.5)">
                    <path
                      className="heron-poisson"
                      opacity="0"
                      d="M0-5.5C2.6-4 2.6 1.5 0 3.5l2.4 3.2h-4.8L0 3.5C-2.6 1.5-2.6-4 0-5.5Z"
                    />
                  </g>
                  <path d="M40 8 60 10 40 11Z" />
                  <path className="heron-mandibule" d="M40 9 60 10 40 12Z" />
                </g>
              </g>
            </g>
            <path
              className="heron-queue"
              fill="currentColor"
              stroke="none"
              d="M15.49 38.82C12.65 41.58 10.1 44.7 8 48c3.3.6 6.87.89 10.41.81L22 43Z"
            />
            <path
              className="heron-corps"
              fill="currentColor"
              stroke="none"
              d="M38 27.5C27 28 15 37 8 48c11 2 25 .5 31-6 3.5-4 3.6-8 3-12Z"
            />
            <g className="heron-aile" fill="currentColor" stroke="none">
              <path
                transform="translate(36 33) rotate(-24) scale(.5) translate(-36 -33)"
                d={WING}
              />
            </g>
          </g>
        </g>
      </g>
      <g className="heron-eclats" fill="currentColor" stroke="none">
        <circle className="heron-goutte" r="1.5" opacity="0" />
        <circle className="heron-goutte" r="1.5" opacity="0" />
        <circle className="heron-goutte" r="1.5" opacity="0" />
        <circle className="heron-goutte" r="1.5" opacity="0" />
      </g>
      <path
        className="heron-plume"
        fill="currentColor"
        stroke="none"
        opacity="0"
        d="M-4 0c2.5-2 5.5-2 8 0-2.5 2-5.5 2-8 0Z"
      />
    </svg>
  );
}

interface LogoProps {
  name: string;
  entrance?: Entrance;
}

export function Logo({ name, entrance }: LogoProps) {
  return (
    <span className="logo">
      <Emblem className="embleme" entrance={entrance} />
      {name}
    </span>
  );
}
