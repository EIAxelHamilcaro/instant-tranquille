import type { Access } from "payload";

export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user);
export const isPublic: Access = () => true;

export const isActiveGuideOrAdmin: Access = ({ req: { user } }) => {
  if (user) return true;
  return false;
};
