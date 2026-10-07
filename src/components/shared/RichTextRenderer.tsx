import { RichText } from "@payloadcms/richtext-lexical/react";
import { bulletItemsWithoutValue } from "@/components/shared/rich-text-converters";

interface RichTextRendererProps {
  content: React.ComponentProps<typeof RichText>["data"] | null | undefined;
  className: string;
}

export function RichTextRenderer({
  content,
  className,
}: RichTextRendererProps) {
  if (!content) return null;

  return (
    <div className={className}>
      <RichText
        data={content}
        converters={({ defaultConverters }) => ({
          ...defaultConverters,
          ...bulletItemsWithoutValue(defaultConverters),
        })}
      />
    </div>
  );
}
