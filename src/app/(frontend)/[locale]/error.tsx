"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations("common");

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <AlertTriangle className="mb-6 h-16 w-16 text-earth-400" />
      <h1 className="font-heading text-3xl font-bold">{t("error")}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">{t("errorDesc")}</p>
      <Button
        onClick={reset}
        className="mt-8 bg-primary-500 font-sans hover:bg-primary-600"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        {t("retry")}
      </Button>
    </Container>
  );
}
