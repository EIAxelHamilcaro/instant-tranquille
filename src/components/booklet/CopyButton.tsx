"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md bg-sand-100 px-3 py-1.5 font-sans text-sm font-medium transition-colors hover:bg-sand-200",
        copied && "bg-green-100 text-green-700",
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
    </button>
  );
}
