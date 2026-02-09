import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-1.5 font-sans text-sm text-muted-foreground">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {item.href ? (
                <Link
                  href={item.href as "/"}
                  className="rounded transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-foreground font-medium">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
