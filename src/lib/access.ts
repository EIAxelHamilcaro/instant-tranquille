import type { Access } from "payload";

export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user);
export const isPublic: Access = () => true;

export const isActiveGuideOrAdmin: Access = ({ req: { user } }) => {
  if (user) return true;
  const now = new Date().toISOString();
  return {
    and: [
      { isActive: { equals: true } },
      { or: [{ validFrom: { exists: false } }, { validFrom: { less_than_equal: now } }] },
      { or: [{ validUntil: { exists: false } }, { validUntil: { greater_than_equal: now } }] },
    ],
  };
};
