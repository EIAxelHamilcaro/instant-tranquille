"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useNearViewport } from "@/components/shared/useNearViewport";
import type { SurroundingsMapClientProps } from "./SurroundingsMapClient";

interface SurroundingsMapProps extends SurroundingsMapClientProps {
  label: string;
  className?: string;
}

function MapPlaceholder() {
  return <div className="plan" />;
}

const SurroundingsMapClient = dynamic(() => import("./SurroundingsMapClient"), {
  ssr: false,
  loading: MapPlaceholder,
});

export function SurroundingsMap({
  label,
  className,
  ...map
}: SurroundingsMapProps) {
  const frame = useRef<HTMLElement>(null);
  const isNear = useNearViewport(frame);

  return (
    <section ref={frame} aria-label={label} className={className}>
      {isNear ? <SurroundingsMapClient {...map} /> : <MapPlaceholder />}
    </section>
  );
}
