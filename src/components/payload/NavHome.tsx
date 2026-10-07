"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavHomeProps {
  href: string;
}

export default function NavHome({ href }: NavHomeProps) {
  const isCurrent = usePathname().replace(/\/$/, "") === href;

  return (
    <Link
      className="lit-nav-resume"
      href={href}
      aria-current={isCurrent ? "page" : undefined}
    >
      Résumé
    </Link>
  );
}
