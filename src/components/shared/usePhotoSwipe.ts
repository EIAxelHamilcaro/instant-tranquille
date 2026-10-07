"use client";

import { useEffect, useEffectEvent } from "react";

const AXIS_LOCK = 8;
const STEP_SHARE = 0.16;
const CLOSE_PULL = 96;
const FLICK_PULL = 24;
const FLICK_SPEED = 0.5;
const PULL_FADE = 480;
const MAX_FADE = 0.8;
const LONE_DRAG = 0.3;
const STALE_MOVE_MS = 80;
const ZOOMED_SCALE = 1.01;

type Axis = "x" | "y";

interface Swipe {
  pointerId: number;
  target: EventTarget | null;
  startX: number;
  startY: number;
  axis?: Axis;
  lastX: number;
  lastY: number;
  lastTime: number;
  speedX: number;
  speedY: number;
}

interface PhotoSwipeOptions {
  canStep: boolean;
  onStep: (delta: number, from: number) => void;
  onClose: () => void;
  onSettle: (x: number, y: number) => void;
  onTap: (target: EventTarget | null) => void;
}

export function usePhotoSwipe(
  surface: HTMLElement | null,
  options: PhotoSwipeOptions,
) {
  const latest = useEffectEvent(() => options);

  useEffect(() => {
    if (!surface) return;

    const touches = new Set<number>();
    let swipe: Swipe | undefined;

    const offsets = (current: Swipe, event: PointerEvent) => {
      const x = event.clientX - current.startX;

      return {
        x: latest().canStep ? x : x * LONE_DRAG,
        y: Math.max(event.clientY - current.startY, 0),
      };
    };

    const start = (event: PointerEvent) => {
      touches.add(event.pointerId);
      if (touches.size > 1) {
        abandon(event);
        return;
      }

      const { target } = event;
      const onControl =
        target instanceof Element && target.closest("button, a");
      const zoomed = (window.visualViewport?.scale ?? 1) > ZOOMED_SCALE;
      const sideButton = event.pointerType === "mouse" && event.button !== 0;
      if (onControl || zoomed || sideButton) return;

      swipe = {
        pointerId: event.pointerId,
        target,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
        lastTime: event.timeStamp,
        speedX: 0,
        speedY: 0,
      };
    };

    const move = (event: PointerEvent) => {
      if (!swipe || event.pointerId !== swipe.pointerId) return;

      const travelX = event.clientX - swipe.startX;
      const travelY = event.clientY - swipe.startY;

      if (!swipe.axis) {
        if (Math.hypot(travelX, travelY) < AXIS_LOCK) return;

        swipe.axis = Math.abs(travelX) > Math.abs(travelY) ? "x" : "y";
        surface.setPointerCapture(swipe.pointerId);
        surface.setAttribute("data-glisse", "");
      }

      const span = event.timeStamp - swipe.lastTime;
      if (span > 0) {
        swipe.speedX = (event.clientX - swipe.lastX) / span;
        swipe.speedY = (event.clientY - swipe.lastY) / span;
      }
      swipe.lastX = event.clientX;
      swipe.lastY = event.clientY;
      swipe.lastTime = event.timeStamp;

      const { x, y } = offsets(swipe, event);

      if (swipe.axis === "x") {
        surface.style.setProperty("--glisse-x", `${x}px`);
        return;
      }

      surface.style.setProperty("--glisse-y", `${y}px`);
      surface.style.setProperty(
        "--recul",
        String(Math.min(y / PULL_FADE, MAX_FADE)),
      );
    };

    const abandon = (event: PointerEvent) => {
      if (!swipe) return;

      const { x, y } = offsets(swipe, event);
      const { axis } = swipe;
      swipe = undefined;
      surface.removeAttribute("data-glisse");
      if (axis) latest().onSettle(axis === "x" ? x : 0, axis === "y" ? y : 0);
    };

    const end = (event: PointerEvent) => {
      touches.delete(event.pointerId);
      if (!swipe || event.pointerId !== swipe.pointerId) return;

      if (event.type === "pointercancel") {
        abandon(event);
        return;
      }

      const done = swipe;
      const { x, y } = offsets(done, event);
      const fresh = event.timeStamp - done.lastTime <= STALE_MOVE_MS;
      const { canStep, onStep, onClose, onSettle, onTap } = latest();

      swipe = undefined;
      surface.removeAttribute("data-glisse");

      if (!done.axis) {
        onTap(done.target);
        return;
      }

      if (done.axis === "x") {
        const far = Math.abs(x) > surface.clientWidth * STEP_SHARE;
        const flicked =
          fresh &&
          Math.abs(done.speedX) > FLICK_SPEED &&
          Math.sign(done.speedX) === Math.sign(x);

        if (canStep && (far || flicked)) onStep(x < 0 ? 1 : -1, x);
        else onSettle(x, 0);
        return;
      }

      const flicked = fresh && done.speedY > FLICK_SPEED && y > FLICK_PULL;

      if (y > CLOSE_PULL || flicked) onClose();
      else onSettle(0, y);
    };

    surface.addEventListener("pointerdown", start);
    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerup", end);
    surface.addEventListener("pointercancel", end);

    return () => {
      surface.removeEventListener("pointerdown", start);
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerup", end);
      surface.removeEventListener("pointercancel", end);
    };
  }, [surface]);
}
