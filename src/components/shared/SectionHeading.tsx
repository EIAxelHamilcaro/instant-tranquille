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
        <p className="subtitle-editorial mb-3 text-sm tracking-wide text-primary-600">
          {eyebrow}
        </p>
      )}
      <Tag className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </Tag>
      {subtitle && (
        <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
      )}
      {!isMinimal && (
        <div
          className={cn(
            "heading-underline mt-4 h-1 w-16 rounded-full bg-primary-500",
            isCentered && "mx-auto",
          )}
        />
      )}
    </div>
  );
}
