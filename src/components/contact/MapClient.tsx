"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_LAT = 47.4833;
const DEFAULT_LNG = 1.7667;
const DEFAULT_ZOOM = 12;

interface MapClientProps {
  lat?: number | null;
  lng?: number | null;
  zoom?: number | null;
  markerLabel?: string | null;
}

export default function MapClient({ lat, lng, zoom, markerLabel }: MapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const latitude = lat ?? DEFAULT_LAT;
  const longitude = lng ?? DEFAULT_LNG;
  const zoomLevel = zoom ?? DEFAULT_ZOOM;
  const label = markerLabel ?? "L'Instant Tranquille";

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([latitude, longitude], zoomLevel);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const icon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    L.marker([latitude, longitude], { icon })
      .addTo(map)
      .bindPopup(label)
      .openPopup();

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude, zoomLevel, label]);

  return (
    <div
      ref={mapRef}
      className="h-[400px] w-full rounded-xl"
    />
  );
}
