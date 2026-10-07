import { withoutEmpty } from "@/lib/jsonld";

interface JsonLdProps {
  data: object | null | (object | null)[];
}

export function JsonLd({ data }: JsonLdProps) {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean);

  return items.map((item, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(withoutEmpty(item)).replace(/</g, "\\u003c"),
      }}
    />
  ));
}
