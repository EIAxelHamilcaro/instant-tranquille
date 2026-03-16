"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "./CopyButton";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import { KeyRound, MapPin, Car } from "lucide-react";

type ArrivalData = {
  accessCode?: string | null;
  instructions?: unknown;
  parkingInfo?: string | null;
};

export function ArrivalInstructions({ id, sectionTitle, data }: { id?: string; sectionTitle?: string | null; data: ArrivalData }) {
  const t = useTranslations("booklet");

  return (
    <section id={id ?? "arrival"} className="scroll-mt-20">
      <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
        <MapPin className="h-6 w-6 text-primary-500" aria-hidden="true" />
        {sectionTitle || t("arrival")}
      </h2>

      {data.accessCode && (
        <Card className="mb-6 border-primary-200 bg-primary-50">
          <CardContent className="flex items-center gap-4 p-6">
            <KeyRound className="h-8 w-8 text-primary-500" aria-hidden="true" />
            <div>
              <p className="font-sans text-sm font-medium text-primary-700">
                {t("accessCode")}
              </p>
              <CopyButton
                value={data.accessCode}
                className="mt-1 bg-white text-lg font-bold"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {data.instructions != null && (
        <div className="mb-4 leading-relaxed text-foreground/80">
          <RichTextRenderer content={data.instructions as Record<string, unknown>} />
        </div>
      )}

      {data.parkingInfo && (
        <div className="flex items-start gap-3 rounded-lg bg-sand-100 p-4">
          <Car className="mt-0.5 h-5 w-5 text-earth-500" aria-hidden="true" />
          <p className="text-sm text-foreground/80">{data.parkingInfo}</p>
        </div>
      )}
    </section>
  );
}
