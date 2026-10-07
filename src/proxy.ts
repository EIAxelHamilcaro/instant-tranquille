import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PLATFORM_SHORTCUTS = [
  "/airbnb",
  "/booking",
  "/google",
  "/gites-de-france",
];

export function proxy(request: Request) {
  const url = new URL(request.url);

  // Skip next-intl for Payload admin and API routes
  if (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    PLATFORM_SHORTCUTS.includes(url.pathname) ||
    url.pathname.includes(".")
  ) {
    return;
  }

  return intlMiddleware(request as Parameters<typeof intlMiddleware>[0]);
}

export const config = {
  matcher: ["/((?!_next|admin|api|favicon.ico|.*\\.).*)"],
};
