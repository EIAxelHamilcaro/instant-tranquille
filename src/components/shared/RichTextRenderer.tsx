import { RichText } from "@payloadcms/richtext-lexical/react";

export function RichTextRenderer({
  content,
  className,
}: {
  content: any;
  className?: string;
}) {
  if (!content) return null;

  return (
    <div className={className ?? "prose prose-stone max-w-none prose-headings:font-heading prose-a:text-primary-600"}>
      <RichText data={content} />
    </div>
  );
}
