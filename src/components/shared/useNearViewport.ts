"use client";

import { type RefObject, useEffect, useState } from "react";

const AHEAD = "100% 0px";

export function useNearViewport(target: RefObject<Element | null>) {
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const element = target.current;
    if (!element || isNear) return;

    const watcher = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setIsNear(true);
      },
      { rootMargin: AHEAD },
    );
    watcher.observe(element);

    return () => watcher.disconnect();
  }, [target, isNear]);

  return isNear;
}
