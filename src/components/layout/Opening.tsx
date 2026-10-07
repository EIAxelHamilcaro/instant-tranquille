"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Emblem } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { OpeningScenery } from "./OpeningScenery";

const SOUND_CHOICE = "ouverture-son";
const SOUND_LEVEL = 0.3;
const SOUND_FADE = 220;
const GESTURES = ["pointerdown", "keydown", "touchstart"] as const;
const SOUND_FADE_STEPS = 8;
const STILL = "(prefers-reduced-motion: reduce)";
const FISHING_STARTS = 1300;
const FISHING_FROM = 500;
const FISHING_RATE = 1.35;
const POSE_BLEND = 180;
const SLOW_NETWORKS = ["slow-2g", "2g", "3g"];
const STARTED = "ouverture";
const RIGGED = ".heron, .heron *, .heron-onde";

interface NetworkHint {
  saveData?: boolean;
  effectiveType?: string;
}

function storedChoice() {
  try {
    return window.localStorage.getItem(SOUND_CHOICE);
  } catch {
    return null;
  }
}

function storeChoice(choice: "on" | "off") {
  try {
    window.localStorage.setItem(SOUND_CHOICE, choice);
  } catch {}
}

function soundSource(audio: HTMLAudioElement) {
  const opus = audio.canPlayType('audio/webm; codecs="opus"') !== "";

  return opus ? "/sounds/ouverture.webm" : "/sounds/ouverture.mp3";
}

function isFrugal() {
  const { connection } = navigator as Navigator & { connection?: NetworkHint };

  return (
    connection?.saveData === true ||
    SLOW_NETWORKS.includes(connection?.effectiveType ?? "")
  );
}

function decoded(image: HTMLImageElement) {
  image.loading = "eager";

  return image.decode().catch(() => undefined);
}

function playable(video: HTMLVideoElement) {
  if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return undefined;

  return new Promise<void>((resolve) => {
    video.addEventListener("canplay", () => resolve(), { once: true });
    video.addEventListener("error", () => resolve(), { once: true });
  });
}

function sectionReady(section: Element | null | undefined) {
  if (!section) return [];

  return [
    ...[...section.querySelectorAll("img")].map(decoded),
    ...[...section.querySelectorAll("video")].map(playable),
  ];
}

function changePose(
  svg: SVGSVGElement,
  sequence: string,
  from: number,
  rate: number,
) {
  const poses = [...svg.querySelectorAll<SVGElement>(RIGGED)].map((part) => {
    const { rotate, translate, scale, opacity } = getComputedStyle(part);

    return { part, pose: { rotate, translate, scale, opacity } };
  });

  svg.removeAttribute("data-sequence");
  svg.getAnimations({ subtree: true });
  svg.setAttribute("data-sequence", sequence);

  for (const animation of svg.getAnimations({ subtree: true })) {
    animation.currentTime = from;
    animation.playbackRate = rate;
  }

  for (const { part, pose } of poses) {
    part.animate([pose, {}], { duration: POSE_BLEND, easing: "ease-out" });
  }
}

interface OpeningProps {
  name: string;
  baseline: string;
  skipLabel: string;
  soundLabel: string;
}

export function Opening({
  name,
  baseline,
  skipLabel,
  soundLabel,
}: OpeningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const toggle = useRef<() => void>(undefined);
  const router = useRouter();
  const [sound, setSound] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const layer = ref.current;
    const root = document.documentElement;
    if (!layer) return;

    const still = window.matchMedia(STILL).matches;
    const audio = new Audio();
    let gesture: AbortController | undefined;
    let fading: number | undefined;
    let fishing: number | undefined;
    let phase: string | undefined;
    let began = 0;

    const herons = () => layer.querySelectorAll<SVGSVGElement>("svg.heron-vif");

    const play = async () => {
      window.clearInterval(fading);
      audio.preload = "auto";
      audio.src = soundSource(audio);
      audio.volume = SOUND_LEVEL;
      audio.currentTime = (performance.now() - began) / 1000;

      try {
        await audio.play();
        setSound(true);
      } catch {
        setSound(false);
        playOnGesture();
      }
    };

    const playOnGesture = () => {
      gesture?.abort();
      gesture = new AbortController();

      const retry = (event: Event) => {
        const onControls =
          event.target instanceof Element &&
          event.target.closest(".ouverture-commandes");
        if (onControls) return;

        gesture?.abort();
        if (root.dataset.ouverture === "" && storedChoice() !== "off")
          void play();
      };

      for (const type of GESTURES)
        window.addEventListener(type, retry, {
          capture: true,
          signal: gesture.signal,
        });
    };

    const fadeOut = () => {
      let step = SOUND_FADE_STEPS;

      window.clearInterval(fading);
      fading = window.setInterval(() => {
        step -= 1;
        audio.volume = (SOUND_LEVEL * Math.max(step, 0)) / SOUND_FADE_STEPS;

        if (step > 0) return;

        window.clearInterval(fading);
        audio.pause();
      }, SOUND_FADE / SOUND_FADE_STEPS);

      setSound(false);
    };

    const alignWithMark = () => {
      const mark = document.querySelector(".entete .embleme");
      if (!mark) return;

      const { left, top } = mark.getBoundingClientRect();

      layer.style.setProperty("--logo-x", `${left}px`);
      layer.style.setProperty("--logo-y", `${top}px`);
    };

    const warmUp = async () => {
      const [hero, next] = document.querySelectorAll("#contenu > *");

      await Promise.all([document.fonts.ready, ...sectionReady(hero)]);
      root.setAttribute("data-ouverture-pret", "");

      if (isFrugal()) return;

      void Promise.all(sectionReady(next));
      window.requestIdleCallback?.(() => {
        for (const { href } of NAV_ITEMS) router.prefetch(href);
      });
    };

    const begin = () => {
      began =
        performance.getEntriesByName(STARTED).at(-1)?.startTime ??
        performance.now();
      alignWithMark();
      void warmUp();

      if (still) return;

      if (storedChoice() !== "off") void play();
      const elapsed = performance.now() - began;
      const late = Math.max(elapsed - FISHING_STARTS, 0);

      fishing = window.setTimeout(
        () => {
          for (const heron of herons())
            changePose(
              heron,
              "peche",
              FISHING_FROM + late * FISHING_RATE,
              FISHING_RATE,
            );
        },
        Math.max(FISHING_STARTS - elapsed, 0),
      );
    };

    const leave = () => {
      window.clearTimeout(fishing);
      alignWithMark();

      if (still) return;

      if (!audio.paused) fadeOut();
      for (const heron of herons()) changePose(heron, "depart", 0, 1);
    };

    const sync = () => {
      const next = root.dataset.ouverture;
      if (next === phase) return;

      const previous = phase;
      phase = next;

      if (next === "") begin();
      if (next === "envol" && previous === "") leave();
      if (next === undefined) root.removeAttribute("data-ouverture-pret");
    };

    toggle.current = () => {
      if (audio.paused) {
        storeChoice("on");
        void play();
        return;
      }

      storeChoice("off");
      fadeOut();
    };

    const replay = () => {
      if (!root.hasAttribute("data-ouverture")) setRun((count) => count + 1);
    };

    const watcher = new MutationObserver(sync);

    watcher.observe(root, {
      attributes: true,
      attributeFilter: ["data-ouverture"],
    });
    document.addEventListener("ouverture", replay, { capture: true });
    sync();

    return () => {
      watcher.disconnect();
      document.removeEventListener("ouverture", replay, { capture: true });
      gesture?.abort();
      window.clearInterval(fading);
      window.clearTimeout(fishing);
      audio.pause();
    };
  }, [router]);

  const [first, ...rest] = name.split(" ");

  return (
    <div ref={ref} className="ouverture section-sombre">
      <OpeningScenery />
      <span className="ouverture-voile" aria-hidden="true" />
      <span className="ouverture-sillage" aria-hidden="true" />
      <div key={run} className="ouverture-trajet">
        <div className="ouverture-vol">
          <Emblem
            className="heron-vif ouverture-reflet"
            entrance="load"
            scene="still"
          />
          <Emblem
            className="heron-vif ouverture-heron"
            entrance="load"
            scene="still"
          />
        </div>
      </div>
      <div className="ouverture-titre" aria-hidden="true">
        <p className="ouverture-nom">
          <span className="ouverture-mot">
            <span>{first}</span>
          </span>{" "}
          <span className="ouverture-mot">
            <span>{rest.join(" ")}</span>
          </span>
        </p>
        <p className="ouverture-baseline">{baseline}</p>
      </div>
      <div className="ouverture-commandes">
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={sound}
          data-ouverture-son=""
          onClick={() => toggle.current?.()}
        >
          {sound ? (
            <Volume2 aria-hidden="true" />
          ) : (
            <VolumeX aria-hidden="true" />
          )}
          {soundLabel}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.dispatchEvent(new Event("ouverture-fin"))}
        >
          {skipLabel}
        </Button>
      </div>
    </div>
  );
}
