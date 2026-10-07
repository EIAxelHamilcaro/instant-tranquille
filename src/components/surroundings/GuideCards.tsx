import { getTranslations } from "next-intl/server";
import { PhotoViewer } from "@/components/shared/PhotoViewer";
import { readingMinutes } from "@/components/surroundings/guide-content";
import { Vignette } from "@/components/surroundings/Vignette";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Guide } from "@/payload-types";

interface GuideCardsProps {
  guides: Guide[];
  showTheme?: boolean;
  featured?: boolean;
  className?: string;
}

export async function GuideCards({
  guides,
  showTheme = true,
  featured = false,
  className,
}: GuideCardsProps) {
  const t = await getTranslations("common");
  const g = await getTranslations("guides");

  return (
    <PhotoViewer>
      <ul className={cn("cartes", featured && "cartes-une", className)}>
        {guides.map((guide) => (
          <li
            key={guide.id}
            className="carte carte-guide"
            data-theme={guide.theme}
          >
            <Vignette
              media={guide.image}
              category={guide.theme}
              zoom="loupe"
              sizes={
                featured
                  ? "(min-width: 90rem) 730px, (min-width: 64rem) 52vw, 100vw"
                  : "(min-width: 80rem) 400px, (min-width: 68rem) 31vw, (min-width: 44rem) 46vw, 100vw"
              }
            />
            {showTheme && (
              <p className="etiquette">{t(`categories.${guide.theme}`)}</p>
            )}
            <h3>
              <Link
                href={{
                  pathname: "/guides/[slug]",
                  params: { slug: guide.slug },
                }}
              >
                {guide.title}
              </Link>
            </h3>
            <p className="description">{guide.excerpt}</p>
            <p className="ui discret">
              {g("readTime", { minutes: readingMinutes(guide.body) })}
            </p>
          </li>
        ))}
      </ul>
    </PhotoViewer>
  );
}
