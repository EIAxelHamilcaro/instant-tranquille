"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { CmsRecommendation } from "@/lib/queries";

const DEFAULT_LAT = 47.4833;
const DEFAULT_LNG = 1.7667;
const DEFAULT_ZOOM = 11;

const CATEGORY_COLORS: Record<string, string> = {
  castles: "#b8864f",
  restaurants: "#c8633a",
  nature: "#4a7c59",
  activities: "#3b6347",
  markets: "#6e5030",
  equestrian: "#2d4a35",
  services: "#6b6055",
};

interface SurroundingsMapClientProps {
  recommendations: CmsRecommendation[];
  giteCoordinates?: { lat?: number | null; lng?: number | null } | null;
}

export default function SurroundingsMapClient({
  recommendations,
  giteCoordinates,
}: SurroundingsMapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const giteLat = giteCoordinates?.lat ?? DEFAULT_LAT;
  const giteLng = giteCoordinates?.lng ?? DEFAULT_LNG;

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([giteLat, giteLng], DEFAULT_ZOOM);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const giteIcon = L.icon({
      iconUrl: "/images/marker-icon.png",
      iconRetinaUrl: "/images/marker-icon-2x.png",
      shadowUrl: "/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    L.marker([giteLat, giteLng], { icon: giteIcon })
      .addTo(map)
      .bindPopup("L'Instant Tranquille")
      .openPopup();

    for (const rec of recommendations) {
      const lat = rec.coordinates?.lat;
      const lng = rec.coordinates?.lng;
      if (!lat || !lng) continue;

      const color = CATEGORY_COLORS[rec.category] ?? "#6b6055";

      const svgIcon = L.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" fill="${color}" stroke="#fff" stroke-width="2"/></svg>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        className: "",
      });

      const popupContent = rec.distanceFromGite
        ? `<strong>${rec.name}</strong><br/>${rec.distanceFromGite}`
        : `<strong>${rec.name}</strong>`;

      L.marker([lat, lng], { icon: svgIcon })
        .addTo(map)
        .bindPopup(popupContent);
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [giteLat, giteLng, recommendations]);

  return (
    <div
      ref={mapRef}
      role="application"
      aria-label="Carte des alentours du gîte"
      className="h-[300px] w-full rounded-xl sm:h-[400px] md:h-[480px]"
    />
  );
}
