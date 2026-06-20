"use client";

import { Wrench } from "lucide-react";
import { useTranslations } from "next-intl";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type EquipmentItem = {
  name: string;
  instructions?: unknown;
  photo?: unknown;
};

export function EquipmentGuide({
  id,
  sectionTitle,
  items,
}: {
  id?: string;
  sectionTitle?: string | null;
  items: EquipmentItem[];
}) {
  const t = useTranslations("booklet");

  return (
    <section id={id ?? "equipment"} className="scroll-mt-20">
      <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
        <Wrench className="h-6 w-6 text-primary-500" aria-hidden="true" />
        {sectionTitle || t("equipment")}
      </h2>

      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem
            key={item.name}
            value={`equipment-${i}`}
            className="border-sand-200"
          >
            <AccordionTrigger className="font-sans text-base hover:text-primary-600 hover:no-underline">
              {item.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {Boolean(item.photo) && (
                  <PayloadImage
                    media={
                      item.photo as Parameters<typeof PayloadImage>[0]["media"]
                    }
                    size="card"
                    alt={item.name}
                    className="rounded-lg"
                  />
                )}
                {Boolean(item.instructions) && (
                  <RichTextRenderer
                    content={
                      item.instructions as Parameters<
                        typeof RichTextRenderer
                      >[0]["content"]
                    }
                    className="text-sm text-foreground/80"
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
