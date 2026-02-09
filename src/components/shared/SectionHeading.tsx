import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  className,
  centered = true,
  as: Tag = "h2",
}: {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      <Tag className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </Tag>
      {subtitle && (
        <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
      )}
      <div
        className={cn(
          "heading-underline mt-4 h-1 w-16 rounded-full bg-primary-500",
          centered && "mx-auto",
        )}
      />
    </div>
  );
}
