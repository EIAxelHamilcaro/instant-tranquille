import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/jsonld";
import { cn } from "@/lib/utils";

interface FaqProps {
  items: FaqItem[];
  className?: string;
}

export function Faq({ items, className }: FaqProps) {
  return (
    <Accordion type="multiple" className={cn("faq", className)}>
      {items.map(({ question, answer }) => (
        <AccordionItem key={question} value={question}>
          <AccordionTrigger className="question">{question}</AccordionTrigger>
          <AccordionContent forceMount className="reponse">
            {answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
