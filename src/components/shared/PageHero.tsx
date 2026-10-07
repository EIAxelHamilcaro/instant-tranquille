import { Breadcrumbs, type Crumb } from "@/components/shared/Breadcrumbs";
import { focalPosition } from "@/components/shared/Photo";
import { PhotoCredit } from "@/components/shared/PhotoCredit";
import { Seam } from "@/components/shared/Seam";
import { SoftImage } from "@/components/shared/SoftImage";
import { asMedia } from "@/lib/queries";
import type { Media } from "@/payload-types";

interface PageHeroProps {
  title: string;
  lede?: string | null;
  image?: number | Media | null;
  crumbs: Crumb[];
  children?: React.ReactNode;
}

export function PageHero({
  title,
  lede,
  image,
  crumbs,
  children,
}: PageHeroProps) {
  const media = asMedia(image);

  return (
    <header className="entete-page section-sombre">
      {media?.url && (
        <div
          className="entete-photo"
          style={{ "--foyer": focalPosition(media) } as React.CSSProperties}
        >
          <SoftImage
            src={media.url}
            alt=""
            fill
            sizes="(max-width: 40rem) 160vw, (min-width: 120rem) 1920px, 100vw"
            preload
            fetchPriority="high"
            blurDataURL={media.blurDataURL}
          />
        </div>
      )}
      <div className="page grid gap-6">
        <Breadcrumbs items={crumbs} />
        <h1 className="affiche">{title}</h1>
        {lede && <p className="chapeau">{lede}</p>}
        {children}
      </div>
      <Seam kind="arbres" />
      {media && <PhotoCredit media={media} />}
    </header>
  );
}
