import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function CustomSection({
  id,
  title,
  content,
}: {
  id?: string;
  title: string;
  content?: unknown;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
        <FileText className="h-6 w-6 text-primary-500" aria-hidden="true" />
        {title}
      </h2>
      {content != null && (
        <Card className="border-sand-200">
          <CardContent className="p-6">
            <RichTextRenderer content={content as Record<string, unknown>} />
          </CardContent>
        </Card>
      )}
    </section>
  );
}
