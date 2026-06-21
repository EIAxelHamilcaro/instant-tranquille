import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
  variant?: "default" | "left" | "minimal";
  centered?: boolean;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  className,
  variant = "default",
  centered = true,
  as: Tag = "h2",
}: SectionHeadingProps) {
  const isLeft = variant === "left" || (!centered && variant === "default");
  const isMinimal = variant === "minimal";
  const isCentered = variant === "default" && centered;

  return (
    <div
      className={cn(
        "mb-12",
        isCentered && "text-center",
        isLeft && "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="eyebrow mb-4 text-xs text-primary-600">{eyebrow}</p>
      )}
      <Tag className="display-section font-display font-semibold text-foreground">
        {title}
      </Tag>
      {subtitle && (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
      {!isMinimal && (
        <div
          className={cn(
            "heading-underline mt-5 h-px w-16 bg-primary-400",
            isCentered && "mx-auto",
          )}
        />
      )}
    </div>
  );
}
