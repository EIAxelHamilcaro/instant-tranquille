import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

export interface OfficialLink {
  name: string;
  url: string;
  detail?: string;
}

interface OfficialLinksProps {
  links: OfficialLink[];
  className?: string;
}

const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, "");

export async function OfficialLinks({ links, className }: OfficialLinksProps) {
  const t = await getTranslations("common");
  const s = await getTranslations("surroundings");

  return (
    <ul className={cn("liens-officiels", className)}>
      {links.map((link) => (
        <li key={link.url}>
          <a href={link.url} rel="noopener" target="_blank">
            {link.name}
            <span className="sr-only">
              , {s("officialSite")} ({t("opensNewTab")})
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <span className="ui discret">{hostname(link.url)}</span>
          {link.detail && <p className="description">{link.detail}</p>}
        </li>
      ))}
    </ul>
  );
}
