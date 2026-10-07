import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Platform } from "@/lib/platforms";
import { getGlobal } from "@/lib/queries";

const FALLBACK = "/tarifs-reservation";

export function platformRedirect(name: Platform["platform"]) {
  return async function GET() {
    const settings = await getGlobal("site-settings", routing.defaultLocale);
    const platform = settings.platforms?.find(
      (candidate) => candidate.platform === name,
    );

    redirect(platform?.url ?? FALLBACK);
  };
}
