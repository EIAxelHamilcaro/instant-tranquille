"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import { LogIn, LogOut, Clock } from "lucide-react";

export function CheckInOutInstructions({
  id,
  sectionTitle,
  checkInTime,
  checkIn,
  checkOutTime,
  checkOut,
}: {
  id?: string;
  sectionTitle?: string | null;
  checkInTime?: string | null;
  checkIn: any;
  checkOutTime?: string | null;
  checkOut: any;
}) {
  const t = useTranslations("booklet");

  return (
    <section id={id ?? "checkinout"} className="scroll-mt-20">
      <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
        <Clock className="h-6 w-6 text-primary-500" aria-hidden="true" />
        {sectionTitle || t("checkInOut")}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary-200">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <LogIn className="h-5 w-5 text-primary-500" aria-hidden="true" />
              <h3 className="font-heading text-lg font-semibold">
                {t("checkIn")}
              </h3>
            </div>
            {checkInTime && (
              <p className="mb-3 font-sans text-sm font-medium text-primary-600">
                {checkInTime}
              </p>
            )}
            {checkIn ? (
              <RichTextRenderer content={checkIn} />
            ) : !checkInTime ? (
              <p className="text-sm text-foreground/80">{t("checkInFallback")}</p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-earth-200">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <LogOut className="h-5 w-5 text-earth-500" aria-hidden="true" />
              <h3 className="font-heading text-lg font-semibold">
                {t("checkOut")}
              </h3>
            </div>
            {checkOutTime && (
              <p className="mb-3 font-sans text-sm font-medium text-earth-600">
                {checkOutTime}
              </p>
            )}
            {checkOut ? (
              <RichTextRenderer content={checkOut} />
            ) : !checkOutTime ? (
              <p className="text-sm text-foreground/80">{t("checkOutFallback")}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
