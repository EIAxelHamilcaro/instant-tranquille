"use client";

import { type RefObject, useEffect } from "react";

const RESUME_AFTER_TOUCH_MS = 2500;
const DRAG_THRESHOLD = 6;
const FRICTION_PER_FRAME = 0.94;
const FRAME_MS = 16;
const REST_SPEED = 0.02;
const STALE_MOVE_MS = 80;

interface LoopScrollOptions {
  speed: number;
  paused: boolean;
}

interface Drag {
  pointerId: number;
  startX: number;
  startLeft: number;
  moved: boolean;
  lastX: number;
  lastTime: number;
}

export function useLoopScroll(
  track: RefObject<HTMLElement | null>,
  { speed, paused }: LoopScrollOptions,
) {
  useEffect(() => {
    const element = track.current;
    if (!element) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let held = false;
    let drag: Drag | undefined;
    let velocity = 0;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    let position = element.scrollLeft;
    let previous = performance.now();
    let loop = 0;
    let frame = 0;
    let isOnScreen = false;

    const measureLoop = () => {
      const [first, second] = element.children;
      const looping =
        !reducedMotion &&
        first instanceof HTMLElement &&
        second instanceof HTMLElement;

      loop = looping ? second.offsetLeft - first.offsetLeft : 0;
    };

    const wrap = (value: number) => {
      if (loop <= 0) return value;

      return ((value % loop) + loop) % loop;
    };

    const giveRoom = () => {
      if (loop > 0 && element.scrollLeft < element.clientWidth)
        element.scrollLeft += loop;
    };

    const hold = () => {
      clearTimeout(resumeTimer);
      held = true;
    };
    const release = () => {
      position = element.scrollLeft;
      held = false;
    };
    const holdForTouch = () => {
      hold();
      velocity = 0;
      giveRoom();
    };
    const releaseLater = () => {
      resumeTimer = setTimeout(release, RESUME_AFTER_TOUCH_MS);
    };

    const step = (now: number) => {
      const elapsed = Math.min(now - previous, 64);
      previous = now;

      if (!drag && Math.abs(velocity) > REST_SPEED) {
        position = wrap(element.scrollLeft - velocity * elapsed);
        velocity *= FRICTION_PER_FRAME ** (elapsed / FRAME_MS);
        element.scrollLeft = position;
      } else if (!drag && !held && !paused && !reducedMotion) {
        position = wrap(position + (elapsed / 1000) * speed);
        element.scrollLeft = position;
      }

      frame = requestAnimationFrame(step);
    };

    const sizes = new ResizeObserver(measureLoop);
    sizes.observe(element);
    if (element.firstElementChild) sizes.observe(element.firstElementChild);

    const watcher = new IntersectionObserver(([entry]) => {
      const isVisible = entry?.isIntersecting ?? false;
      if (isVisible === isOnScreen) return;

      isOnScreen = isVisible;
      cancelAnimationFrame(frame);
      if (!isOnScreen) return;

      previous = performance.now();
      frame = requestAnimationFrame(step);
    });
    watcher.observe(element);

    const swallowClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const grab = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;

      velocity = 0;
      giveRoom();
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startLeft: element.scrollLeft,
        moved: false,
        lastX: event.clientX,
        lastTime: event.timeStamp,
      };
    };

    const pull = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) return;

      const travelled = event.clientX - drag.startX;
      if (!drag.moved && Math.abs(travelled) < DRAG_THRESHOLD) return;

      if (!drag.moved) {
        drag.moved = true;
        element.setAttribute("data-glisse", "");
        element.setPointerCapture(drag.pointerId);
      }

      const span = event.timeStamp - drag.lastTime;
      if (span > 0) velocity = (event.clientX - drag.lastX) / span;
      drag.lastX = event.clientX;
      drag.lastTime = event.timeStamp;
      element.scrollLeft = drag.startLeft - travelled;
    };

    const drop = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) return;

      if (drag.moved) {
        element.removeAttribute("data-glisse");
        element.addEventListener("click", swallowClick, {
          capture: true,
          once: true,
        });
        setTimeout(
          () => element.removeEventListener("click", swallowClick, true),
          0,
        );
      }

      if (!drag.moved || event.timeStamp - drag.lastTime > STALE_MOVE_MS)
        velocity = 0;
      position = element.scrollLeft;
      drag = undefined;
    };

    const keepStill = (event: DragEvent) => event.preventDefault();

    element.addEventListener("pointerenter", hold);
    element.addEventListener("pointerleave", release);
    element.addEventListener("focusin", hold);
    element.addEventListener("focusout", release);
    element.addEventListener("touchstart", holdForTouch, { passive: true });
    element.addEventListener("touchend", releaseLater);
    element.addEventListener("pointerdown", grab);
    element.addEventListener("pointermove", pull);
    element.addEventListener("pointerup", drop);
    element.addEventListener("pointercancel", drop);
    element.addEventListener("dragstart", keepStill);

    return () => {
      cancelAnimationFrame(frame);
      sizes.disconnect();
      watcher.disconnect();
      clearTimeout(resumeTimer);
      element.removeAttribute("data-glisse");
      element.removeEventListener("pointerenter", hold);
      element.removeEventListener("pointerleave", release);
      element.removeEventListener("focusin", hold);
      element.removeEventListener("focusout", release);
      element.removeEventListener("touchstart", holdForTouch);
      element.removeEventListener("touchend", releaseLater);
      element.removeEventListener("pointerdown", grab);
      element.removeEventListener("pointermove", pull);
      element.removeEventListener("pointerup", drop);
      element.removeEventListener("pointercancel", drop);
      element.removeEventListener("dragstart", keepStill);
    };
  }, [track, speed, paused]);
}
