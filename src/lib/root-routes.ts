export const ROUTED_SEGMENTS = [
  "fr",
  "en",
  "api",
  "admin",
  "og",
  "_next",
  "airbnb",
  "booking",
  "google",
  "gites-de-france",
];

export const UNKNOWN_ROOT_SEGMENT = `(?!(?:${ROUTED_SEGMENTS.join("|")})(?:[/.]|$))[^/]+`;
