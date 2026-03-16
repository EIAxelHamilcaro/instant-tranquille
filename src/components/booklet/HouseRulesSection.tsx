"use client";

import { useTranslations } from "next-intl";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import { Card, CardContent } from "@/components/ui/card";
import { Book } from "lucide-react";

export function HouseRulesSection({ id, sectionTitle, content }: { id?: string; sectionTitle?: string | null; content: any }) {
  const t = useTranslations("booklet");

  if (!content) return null;

  return (
    <section id={id ?? "rules"} className="scroll-mt-20">
      <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
        <Book className="h-6 w-6 text-primary-500" aria-hidden="true" />
        {sectionTitle || t("houseRules")}
      </h2>
      <Card className="border-sand-200">
        <CardContent className="p-6">
          <RichTextRenderer content={content} />
        </CardContent>
      </Card>
    </section>
  );
}
