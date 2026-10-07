"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import "lenis/dist/lenis.css";

const WHEEL_DEVICE =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const NATIVE_SCROLL = ".leaflet-container, [role='dialog']";
const SIDEWAYS_SCROLL = ".defile, .bandeau-piste, .rose-filtres";
const SNAP_TARGETS = "#contenu > :is(section, header), .pied";
const SNAP_REACH = 0.5;
const SNAP_REST = 150;
const SNAP_LERP = 0.07;

function documentTop(element: Element) {
  return element.getBoundingClientRect().top + window.scrollY;
}

function snapPoints(direction: number) {
  const viewport = window.innerHeight;
  const content = document.getElementById("contenu");
  const pageTop = content ? documentTop(content) : 0;

  return [...document.querySelectorAll<HTMLElement>(SNAP_TARGETS)]
    .filter((target) => target.offsetHeight >= viewport / 2)
    .flatMap((target) => {
      const top = documentTop(target);
      const start = top > pageTop ? top : 0;
      const end = top + target.offsetHeight - viewport;

      if (end <= start) return [start];

      return direction > 0 ? [start] : [end];
    });
}

function landingAhead(from: number, direction: number) {
  const reach = window.innerHeight * SNAP_REACH;
  const distances = snapPoints(direction)
    .map((point) => (point - from) * direction)
    .filter((distance) => distance >= 1 && distance <= reach);

  if (distances.length === 0) return undefined;

  return from + Math.min(...distances) * direction;
}

export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia(WHEEL_DEVICE).matches) return;

    let sideways = false;

    const readGesture = ({ deltaX, deltaY }: WheelEvent) => {
      sideways = Math.abs(deltaX) > Math.abs(deltaY);
    };
    window.addEventListener("wheel", readGesture, {
      capture: true,
      passive: true,
    });

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      stopInertiaOnNavigate: true,
      lerp: 0.09,
      wheelMultiplier: 0.9,
      prevent: (node) =>
        node.closest(NATIVE_SCROLL) !== null ||
        (sideways && node.closest(SIDEWAYS_SCROLL) !== null),
    });

    let rest: number | undefined;

    const cancelSnap = () => window.clearTimeout(rest);

    const snap = (direction: number) => {
      if (lenis.isStopped) return;

      const landing = landingAhead(lenis.targetScroll, direction);
      if (landing !== undefined) lenis.scrollTo(landing, { lerp: SNAP_LERP });
    };

    lenis.on("virtual-scroll", ({ deltaY, event }) => {
      if (event.type !== "wheel" || event.ctrlKey || deltaY === 0) return;
      if (sideways) return cancelSnap();

      const { target } = event;
      if (target instanceof Element && target.closest(NATIVE_SCROLL)) return;

      cancelSnap();
      rest = window.setTimeout(snap, SNAP_REST, Math.sign(deltaY));
    });
    window.addEventListener("keydown", cancelSnap);
    window.addEventListener("pointerdown", cancelSnap);

    const syncLock = () => {
      if (document.body.hasAttribute("data-scroll-locked")) lenis.stop();
      else lenis.start();
    };
    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-scroll-locked"],
    });

    return () => {
      cancelSnap();
      window.removeEventListener("wheel", readGesture, { capture: true });
      window.removeEventListener("keydown", cancelSnap);
      window.removeEventListener("pointerdown", cancelSnap);
      lockObserver.disconnect();
      lenis.destroy();
    };
  }, []);

  return null;
}
