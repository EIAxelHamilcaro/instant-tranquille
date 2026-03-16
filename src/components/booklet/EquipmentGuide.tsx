"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import { Wrench } from "lucide-react";

type EquipmentItem = {
  name: string;
  instructions?: any;
  photo?: any;
};

export function EquipmentGuide({ id, sectionTitle, items }: { id?: string; sectionTitle?: string | null; items: EquipmentItem[] }) {
  const t = useTranslations("booklet");

  return (
    <section id={id ?? "equipment"} className="scroll-mt-20">
      <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
        <Wrench className="h-6 w-6 text-primary-500" aria-hidden="true" />
        {sectionTitle || t("equipment")}
      </h2>

      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`equipment-${i}`} className="border-sand-200">
            <AccordionTrigger className="font-sans text-base hover:text-primary-600 hover:no-underline">
              {item.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {item.photo && (
                  <PayloadImage
                    media={item.photo}
                    size="card"
                    alt={item.name}
                    className="rounded-lg"
                  />
                )}
                {item.instructions && (
                  <RichTextRenderer content={item.instructions} className="text-sm text-foreground/80" />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
