import { timingSafeEqual } from "node:crypto";
import type { Access, FieldAccess, PayloadRequest } from "payload";

const ASSISTANT_API = "MCP";

export const isHostAccount = (user: PayloadRequest["user"]) =>
  user?.collection === "users";

export const isAssistant = ({ payloadAPI }: PayloadRequest) =>
  payloadAPI === ASSISTANT_API;

export const isAuthenticated: Access = ({ req: { user } }) =>
  isHostAccount(user);
export const isPublic: Access = () => true;
export const isHostField: FieldAccess = ({ req }) =>
  isHostAccount(req.user) && !isAssistant(req);
export const isPublishedOrAuthenticated: Access = ({ req: { user } }) =>
  isHostAccount(user) ? true : { _status: { equals: "published" } };

export function isScheduler({ req }: { req: PayloadRequest }) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(req.headers.get("authorization") ?? "");

  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}
