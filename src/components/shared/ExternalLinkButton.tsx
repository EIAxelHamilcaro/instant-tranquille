import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export function ExternalLinkButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "earth" | "outline";
  className?: string;
}) {
  const variants = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600",
    earth:
      "bg-earth-500 text-white hover:bg-earth-600",
    outline:
      "border-2 border-primary-500 text-primary-600 hover:bg-primary-50",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-6 py-3 font-sans text-sm font-semibold transition-colors",
        variants[variant],
        className,
      )}
    >
      {children}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}
