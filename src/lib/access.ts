import type { Access, FieldAccess } from "payload";

export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user);
export const isPublic: Access = () => true;
export const isAuthenticatedField: FieldAccess = ({ req: { user } }) =>
  Boolean(user);
export const isPublishedOrAuthenticated: Access = ({ req: { user } }) =>
  user ? true : { _status: { equals: "published" } };
