"use client";

import { useTranslations } from "next-intl";
import { Emblem } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  const t = useTranslations("common.error");

  return (
    <section className="page section grid justify-items-start gap-6">
      <Emblem className="heron-vif heron-etat" scene="search" />
      <h1 className="affiche">{t("title")}</h1>
      <p className="chapeau">{t("text")}</p>
      <Button size="lg" onClick={reset}>
        {t("retry")}
      </Button>
    </section>
  );
}
