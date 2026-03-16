"use client";

import type { BookletSection } from "@/types/booklet";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { Separator } from "@/components/ui/separator";
import { LivretTableOfContents } from "./LivretTableOfContents";
import { BookletSectionRenderer } from "./BookletSectionRenderer";
import { Trees } from "lucide-react";

export function BookletLayout({
  title,
  siteName,
  sections,
}: {
  title?: string;
  siteName: string;
  sections: BookletSection[];
}) {
  const t = useTranslations("booklet");

  return (
    <Container className="py-12">
      <div className="mb-10 text-center">
        <Trees className="mx-auto mb-4 h-12 w-12 text-primary-500" />
        <h1 className="font-heading text-4xl font-bold">
          {title || t("title")}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">{siteName}</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <LivretTableOfContents sections={sections} />
          </div>
        </aside>

        <div className="space-y-12">
          <div className="lg:hidden">
            <LivretTableOfContents sections={sections} />
            <Separator className="mt-6" />
          </div>

          {sections.map((section, i) => (
            <div key={section.id}>
              <BookletSectionRenderer section={section} />
              {i < sections.length - 1 && <Separator className="mt-12" />}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
