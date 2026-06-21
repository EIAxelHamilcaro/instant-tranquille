"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProtectedPhoneProps {
  encoded: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function ProtectedPhone({
  encoded,
  className,
  iconClassName,
  textClassName,
}: ProtectedPhoneProps) {
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    try {
      setPhone(atob(encoded));
    } catch {
      setPhone(null);
    }
  }, [encoded]);

  if (!phone) return null;

  return (
    <a href={`tel:${phone.replace(/\s/g, "")}`} className={className}>
      <Phone className={cn("h-4 w-4", iconClassName)} aria-hidden="true" />
      <span className={textClassName}>{phone}</span>
    </a>
  );
}
