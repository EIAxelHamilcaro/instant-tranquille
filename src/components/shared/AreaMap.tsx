"use client";

import { useEffect, useRef } from "react";
import { useNearViewport } from "@/components/shared/useNearViewport";
import "leaflet/dist/leaflet.css";

interface AreaMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  label: string;
  markerLabel: string;
}

const TILES_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILES_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const MARKER_SIZE = 22;

export function AreaMap({
  lat,
  lng,
  zoom = 13,
  label,
  markerLabel,
}: AreaMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const isNear = useNearViewport(container);

  useEffect(() => {
    const node = container.current;
    if (!node || !isNear) return;

    let disposed = false;
    let remove = () => {};

    void import("leaflet").then(({ default: L }) => {
      if (disposed) return;

      const map = L.map(node, { scrollWheelZoom: false }).setView(
        [lat, lng],
        zoom,
      );

      L.tileLayer(TILES_URL, { attribution: TILES_ATTRIBUTION }).addTo(map);
      L.marker([lat, lng], {
        alt: markerLabel,
        title: markerLabel,
        icon: L.divIcon({
          className: "repere-gite",
          iconSize: [MARKER_SIZE, MARKER_SIZE],
        }),
      }).addTo(map);

      remove = () => map.remove();
    });

    return () => {
      disposed = true;
      remove();
    };
  }, [isNear, lat, lng, zoom, markerLabel]);

  return (
    <div ref={container} role="region" aria-label={label} className="plan" />
  );
}
