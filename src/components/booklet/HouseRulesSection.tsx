import { useTranslations } from "next-intl";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import { Book } from "lucide-react";

export function HouseRulesSection({ content }: { content: any }) {
  const t = useTranslations("booklet");

  return (
    <section id="rules" className="scroll-mt-20">
      <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
        <Book className="h-6 w-6 text-primary-500" />
        {t("houseRules")}
      </h2>
      <div className="rounded-lg border border-sand-200 bg-white p-6">
        <RichTextRenderer content={content} />
      </div>
    </section>
  );
}
