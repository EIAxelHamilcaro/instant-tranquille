"use client";

import { usePathname } from "@/i18n/navigation";
import { OVERLAY_ROUTES } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlay = OVERLAY_ROUTES.includes(pathname);

  return (
    <main id="main-content" className={cn("flex-1", !overlay && "pt-16")}>
      {children}
    </main>
  );
}
