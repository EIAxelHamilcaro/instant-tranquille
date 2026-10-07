import { describe, expect, test } from "bun:test";
import { UNKNOWN_ROOT_SEGMENT } from "./root-routes";

const unknown = new RegExp(`^${UNKNOWN_ROOT_SEGMENT}$`);

describe("unknown root segment", () => {
  test("given a routed segment, when Vercel asks for its RSC payload, then it is not sent to the localized 404", () => {
    expect(unknown.test("admin.rsc")).toBe(false);
    expect(unknown.test("admin.segments")).toBe(false);
  });

  test("given a routed segment, when it is requested as a page, then it keeps its own route", () => {
    expect(unknown.test("admin")).toBe(false);
    expect(unknown.test("airbnb")).toBe(false);
  });

  test("given a segment that only starts like a routed one, when it is requested, then it goes to the localized 404", () => {
    expect(unknown.test("administration")).toBe(true);
    expect(unknown.test("nimporte-quoi")).toBe(true);
  });
});
