"use client";

import { divIcon, type LatLngTuple } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoPoint, PlaceCategory } from "@/lib/places";

const DEFAULT_ZOOM = 11;
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export interface MapPlace extends GeoPoint {
  id: string;
  name: string;
  category: PlaceCategory;
  drive: string;
}

export interface SurroundingsMapClientProps {
  origin: GeoPoint;
  originLabel: string;
  places: MapPlace[];
}

const originIcon = divIcon({
  className: "repere repere-gite",
  iconSize: [28, 28],
});

const placeIcon = (category: PlaceCategory) =>
  divIcon({
    className: `repere categorie-${category}`,
    iconSize: [24, 24],
  });

export default function SurroundingsMapClient({
  origin,
  originLabel,
  places,
}: SurroundingsMapClientProps) {
  const center: LatLngTuple = [origin.lat, origin.lng];
  const points = places.map<LatLngTuple>((place) => [place.lat, place.lng]);

  return (
    <MapContainer
      className="plan"
      scrollWheelZoom={false}
      {...(points.length > 0
        ? {
            bounds: [center, ...points],
            boundsOptions: { padding: [24, 24] },
          }
        : { center, zoom: DEFAULT_ZOOM })}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

      <Marker
        position={center}
        icon={originIcon}
        title={originLabel}
        alt={originLabel}
        zIndexOffset={1000}
      >
        <Popup>
          <strong>{originLabel}</strong>
        </Popup>
      </Marker>

      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={placeIcon(place.category)}
          title={`${place.name}, ${place.drive}`}
          alt={`${place.name}, ${place.drive}`}
        >
          <Popup>
            <strong>{place.name}</strong>
            <span className="trajet">{place.drive}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
