import type { GeoPoint } from "@/lib/places";

export interface PlacePosition {
  address?: string | null;
  geocodedAddress?: string | null;
  lat?: number | null;
  lng?: number | null;
  driveMin?: number | null;
  driveKm?: number | null;
  positionLocked?: boolean | null;
}

export interface Route {
  minutes: number;
  km: number;
}

export interface RouteServices {
  geocode: (address: string) => Promise<GeoPoint | null>;
  route: (from: GeoPoint, to: GeoPoint) => Promise<Route>;
}

export interface PositionRequest {
  next: PlacePosition;
  previous?: PlacePosition | null;
  origin: GeoPoint;
  services: RouteServices;
  force?: boolean;
  today?: Date;
}

export interface PositionChanges {
  lat?: number;
  lng?: number;
  driveMin?: number;
  driveKm?: number;
  geocodedAddress?: string;
  positionLocked?: boolean;
}

export interface PositionResult {
  changes: PositionChanges;
  message: string | null;
  failed: boolean;
}

const pointOf = (position?: PlacePosition | null): GeoPoint | null =>
  typeof position?.lat === "number" && typeof position.lng === "number"
    ? { lat: position.lat, lng: position.lng }
    : null;

const samePoint = (a: GeoPoint | null, b: GeoPoint | null) =>
  a?.lat === b?.lat && a?.lng === b?.lng;

const dated = (text: string, today: Date) =>
  `${text} le ${new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" }).format(today)}.`;

const keptNote = (known: GeoPoint | null) =>
  known ? " Les valeurs précédentes sont conservées." : "";

export async function resolvePosition({
  next,
  previous,
  origin,
  services,
  force = false,
  today = new Date(),
}: PositionRequest): Promise<PositionResult> {
  const address = next.address?.trim() ?? "";
  const typed = pointOf(next);
  const known = pointOf(previous);
  const movedByHand = Boolean(typed && known && !samePoint(typed, known));
  const isLocked = Boolean(next.positionLocked) || movedByHand;
  const mustGeocode =
    !isLocked &&
    address !== "" &&
    (force || !typed || address !== (previous?.geocodedAddress ?? ""));

  try {
    const found = mustGeocode ? await services.geocode(address) : typed;
    if (mustGeocode && !found)
      return {
        changes: {},
        failed: true,
        message: `Adresse introuvable : « ${address} ». Vérifiez-la, ou saisissez la latitude et la longitude à la main et cochez « Position corrigée à la main ».${keptNote(known)}`,
      };
    if (!found) return { changes: {}, failed: false, message: null };

    const mustRoute =
      force ||
      mustGeocode ||
      movedByHand ||
      typeof next.driveMin !== "number" ||
      typeof next.driveKm !== "number";
    if (!mustRoute) return { changes: {}, failed: false, message: null };

    const route = await services.route(origin, found);

    return {
      failed: false,
      message: dated(
        isLocked
          ? "Temps de route calculé depuis la position corrigée à la main"
          : "Position et temps de route calculés automatiquement depuis l'adresse",
        today,
      ),
      changes: {
        lat: found.lat,
        lng: found.lng,
        driveMin: Math.round(route.minutes),
        driveKm: Math.round(route.km),
        ...(mustGeocode && { geocodedAddress: address }),
        ...(movedByHand && { positionLocked: true }),
      },
    };
  } catch {
    return {
      changes: {},
      failed: true,
      message: `Le calcul automatique n'a pas abouti : le service de cartes ne répond pas.${keptNote(known)} Réessayez dans quelques minutes.`,
    };
  }
}
