import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export interface Crumb {
  label: string;
  href?: React.ComponentProps<typeof Link>["href"];
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export async function Breadcrumbs({ items }: BreadcrumbsProps) {
  const t = await getTranslations("common");

  return (
    <nav aria-label={t("breadcrumb")} className="ui discret">
      <ol className="flex flex-wrap gap-x-2">
        <li>
          <Link href="/" className="lien">
            {t("nav.home")}
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex gap-x-2">
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link href={item.href} className="lien">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
