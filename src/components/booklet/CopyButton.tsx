"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const t = useTranslations("booklet");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. non-HTTPS or denied permission)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 bg-sand-100 font-sans hover:bg-sand-200",
        copied && "scale-105 bg-green-100 text-green-700",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          {t("copied")}
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {value}
        </>
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? t("copied") : ""}
      </span>
    </Button>
  );
}
