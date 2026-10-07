import { timingSafeEqual } from "node:crypto";
import type { Access, FieldAccess, PayloadRequest } from "payload";

export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user);
export const isPublic: Access = () => true;
export const isAuthenticatedField: FieldAccess = ({ req: { user } }) =>
  Boolean(user);
export const isPublishedOrAuthenticated: Access = ({ req: { user } }) =>
  user ? true : { _status: { equals: "published" } };

export function isScheduler({ req }: { req: PayloadRequest }) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(req.headers.get("authorization") ?? "");

  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}
