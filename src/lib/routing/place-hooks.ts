import {
  type CollectionBeforeValidateHook,
  type Endpoint,
  type PayloadRequest,
  ValidationError,
} from "payload";
import { isHostAccount } from "@/lib/access";
import type { GeoPoint } from "@/lib/places";
import { type PlacePosition, resolvePosition } from "./position";
import { routeServices } from "./services";

export const SKIP_ROUTING = "skipRouting";

async function cottagePosition(req: PayloadRequest): Promise<GeoPoint> {
  const settings = await req.payload.findGlobal({
    slug: "site-settings",
    depth: 0,
    req,
  });
  const { lat, lng } = settings.contact?.coordinates ?? {};
  if (typeof lat !== "number" || typeof lng !== "number")
    throw new Error("The cottage coordinates are missing in site-settings");

  return { lat, lng };
}

const isComplete = (position: PlacePosition) =>
  [position.lat, position.lng, position.driveMin, position.driveKm].every(
    (value) => typeof value === "number",
  );

export const computeRoute: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (req.context[SKIP_ROUTING] || !data) return data;

  const next: PlacePosition = { ...originalDoc, ...data };
  const { changes, message } = await resolvePosition({
    next,
    previous: originalDoc,
    origin: await cottagePosition(req),
    services: routeServices,
  });

  const computed = {
    ...data,
    ...changes,
    ...(message && { routeMessage: message }),
  };
  if (isComplete({ ...originalDoc, ...computed })) return computed;

  throw new ValidationError(
    {
      collection: "places",
      errors: [
        {
          path: "address",
          label: "Adresse du lieu",
          message:
            message ??
            "Écrivez l'adresse du lieu : elle sert à le placer sur la carte et à calculer le temps de route.",
        },
      ],
    },
    req.t,
  );
};

export const recalculateRoute: Endpoint = {
  path: "/:id/recalculate-route",
  method: "post",
  handler: async (req) => {
    if (!isHostAccount(req.user))
      return Response.json(
        { message: "Connectez-vous pour recalculer un temps de route." },
        { status: 401 },
      );

    const id = Number(req.routeParams?.id);
    const place = await req.payload.findByID({
      collection: "places",
      id,
      depth: 0,
      req,
    });
    const { changes, message, failed } = await resolvePosition({
      next: place,
      previous: place,
      origin: await cottagePosition(req),
      services: routeServices,
      force: true,
    });
    await req.payload.update({
      collection: "places",
      id,
      data: { ...changes, routeMessage: message },
      context: { [SKIP_ROUTING]: true },
      req,
    });

    return Response.json({ message, failed }, { status: failed ? 502 : 200 });
  },
};
