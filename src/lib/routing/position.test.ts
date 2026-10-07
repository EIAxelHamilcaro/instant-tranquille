import { describe, expect, mock, test } from "bun:test";
import { resolvePosition } from "./position";

const COTTAGE = { lat: 47.360803, lng: 1.7533421 };
const CHEVERNY = { lat: 47.5002, lng: 1.458 };
const TODAY = new Date("2026-10-06T10:00:00Z");

const services = () => ({
  geocode: mock(async () => CHEVERNY),
  route: mock(async () => ({ minutes: 32.6, km: 30.01 })),
});

describe("resolvePosition", () => {
  test("given a new place with an address, when it is saved, then it gets its position and a rounded drive time", async () => {
    const maps = services();

    const { changes, failed } = await resolvePosition({
      next: { address: "Château de Cheverny, 41700 Cheverny" },
      origin: COTTAGE,
      services: maps,
      today: TODAY,
    });

    expect(failed).toBe(false);
    expect(changes).toMatchObject({ ...CHEVERNY, driveMin: 33, driveKm: 30 });
    expect(changes.geocodedAddress).toBe("Château de Cheverny, 41700 Cheverny");
  });

  test("given a position corrected by hand, when the place is recalculated, then the coordinates are kept and only the route is refreshed", async () => {
    const maps = services();
    const place = {
      address: "Château de Cheverny, 41700 Cheverny",
      lat: 47.5011,
      lng: 1.4599,
      driveMin: 30,
      driveKm: 29,
      positionLocked: true,
    };

    const { changes } = await resolvePosition({
      next: place,
      previous: place,
      origin: COTTAGE,
      services: maps,
      force: true,
      today: TODAY,
    });

    expect(maps.geocode).not.toHaveBeenCalled();
    expect(changes).toMatchObject({ lat: 47.5011, lng: 1.4599, driveMin: 33 });
  });

  test("given coordinates edited by hand without ticking the box, when the place is saved, then the position is locked and not geocoded again", async () => {
    const maps = services();
    const previous = {
      address: "Cheverny",
      geocodedAddress: "Cheverny",
      ...CHEVERNY,
      driveMin: 33,
      driveKm: 30,
    };

    const { changes } = await resolvePosition({
      next: { ...previous, lat: 47.5011 },
      previous,
      origin: COTTAGE,
      services: maps,
      today: TODAY,
    });

    expect(maps.geocode).not.toHaveBeenCalled();
    expect(changes).toMatchObject({ lat: 47.5011, positionLocked: true });
  });

  test("given an unchanged address, when the place is saved, then no external service is called", async () => {
    const maps = services();
    const place = {
      address: "Cheverny",
      geocodedAddress: "Cheverny",
      ...CHEVERNY,
      driveMin: 33,
      driveKm: 30,
    };

    const { changes } = await resolvePosition({
      next: place,
      previous: place,
      origin: COTTAGE,
      services: maps,
    });

    expect(maps.geocode).not.toHaveBeenCalled();
    expect(maps.route).not.toHaveBeenCalled();
    expect(changes).toEqual({});
  });

  test("given a routing service that is down, when the address changes, then nothing is overwritten and the failure is explained", async () => {
    const maps = {
      ...services(),
      route: mock(async () => {
        throw new Error("503");
      }),
    };
    const previous = {
      address: "Cheverny",
      geocodedAddress: "Cheverny",
      ...CHEVERNY,
      driveMin: 33,
      driveKm: 30,
    };

    const { changes, failed, message } = await resolvePosition({
      next: { ...previous, address: "Chambord" },
      previous,
      origin: COTTAGE,
      services: maps,
    });

    expect(failed).toBe(true);
    expect(changes).toEqual({});
    expect(message).toContain("valeurs précédentes sont conservées");
  });
});
