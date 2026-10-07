import { describe, expect, test } from "bun:test";
import type { PayloadRequest } from "payload";
import { isAuthenticated, isHostField } from "@/lib/access";

const request = (user: unknown, payloadAPI = "REST") =>
  ({ user, payloadAPI }) as unknown as PayloadRequest;

const host = { id: 1, collection: "users" };
const assistantKey = { id: 7, collection: "payload-mcp-api-keys" };

describe("access to the admin data", () => {
  test("a host account gets in", () => {
    expect(isAuthenticated({ req: request(host) })).toBe(true);
  });

  test("an assistant key presented to the REST API is not a host", () => {
    expect(isAuthenticated({ req: request(assistantKey) })).toBe(false);
  });

  test("a visitor stays out", () => {
    expect(isAuthenticated({ req: request(null) })).toBe(false);
  });
});

describe("private fields such as the calendar links", () => {
  const field = (req: PayloadRequest) =>
    isHostField({ req } as Parameters<typeof isHostField>[0]);

  test("a host reads and edits them in the admin", () => {
    expect(field(request(host))).toBe(true);
  });

  test("an assistant acting for that host never sees them", () => {
    expect(field(request(host, "MCP"))).toBe(false);
  });
});
