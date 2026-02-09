"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Ban, Shield, Clock, Info } from "lucide-react";

type Policies = {
  cancellation?: any;
  deposit?: any;
  checkIn?: string | null;
  checkOut?: string | null;
  additional?: any;
};

export function PoliciesSection({ policies }: { policies?: Policies | null }) {
  const t = useTranslations("rates");

  const policyItems = [
    {
      id: "cancellation",
      icon: Ban,
      title: t("cancellation"),
      content: policies?.cancellation,
      isRichText: true,
    },
    {
      id: "deposit",
      icon: Shield,
      title: t("deposit"),
      content: policies?.deposit,
      isRichText: true,
    },
    {
      id: "checkinout",
      icon: Clock,
      title: t("checkInOut"),
      content:
        policies?.checkIn || policies?.checkOut
          ? `${policies?.checkIn ? `Arrivée : ${policies.checkIn}` : ""}${policies?.checkIn && policies?.checkOut ? " — " : ""}${policies?.checkOut ? `Départ : ${policies.checkOut}` : ""}`
          : null,
      isRichText: false,
    },
    {
      id: "additional",
      icon: Info,
      title: t("additionalPolicies"),
      content: policies?.additional,
      isRichText: true,
    },
  ];

  return (
    <section className="py-20">
      <Container>
        <SectionHeading title={t("policiesTitle")} />
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {policyItems.map(
              ({ id, icon: Icon, title, content, isRichText }) =>
                content ? (
                  <AccordionItem
                    key={id}
                    value={id}
                    className="border-sand-200"
                  >
                    <AccordionTrigger className="font-sans text-base hover:text-primary-600 hover:no-underline">
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary-500" />
                        {title}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {isRichText ? (
                        <RichTextRenderer content={content} />
                      ) : (
                        <p>{content}</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ) : null,
            )}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}
