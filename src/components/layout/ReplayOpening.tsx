"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ReplayOpeningProps {
  label: string;
  className: string;
  children: ReactNode;
}

export function ReplayOpening({
  label,
  className,
  children,
}: ReplayOpeningProps) {
  return (
    <Button
      variant="link"
      className={className}
      aria-label={label}
      onClick={() => document.dispatchEvent(new Event("ouverture"))}
    >
      {children}
    </Button>
  );
}
