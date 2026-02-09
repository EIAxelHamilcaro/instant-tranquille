import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: Request) {
  const url = new URL(request.url);

  // Skip next-intl for Payload admin and API routes
  if (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.includes(".")
  ) {
    return;
  }

  return intlMiddleware(request as any);
}

export const config = {
  matcher: ["/((?!_next|admin|api|favicon.ico|.*\\.).*)"],
};
