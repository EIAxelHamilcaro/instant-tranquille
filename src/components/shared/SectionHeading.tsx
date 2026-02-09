import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  className,
  centered = true,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
}) {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
      )}
      <div
        className={cn(
          "mt-4 h-1 w-16 rounded-full bg-primary-500",
          centered && "mx-auto",
        )}
      />
    </div>
  );
}
