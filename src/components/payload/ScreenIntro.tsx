import { Seam } from "@/components/shared/Seam";
import { SITE_URL } from "@/lib/seo";

interface ScreenIntroProps {
  description?: string;
  where: string;
  path?: string;
}

export default function ScreenIntro({
  description,
  where,
  path,
}: ScreenIntroProps) {
  return (
    <div className="lit-ecran">
      {description && <p className="lit-ecran-role">{description}</p>}
      <p className="lit-ecran-site">
        <strong>Sur le site</strong>
        {where}
        {path && (
          <a href={`${SITE_URL}${path}`} target="_blank" rel="noopener">
            Voir la page
            <span className="lit-hors-ecran"> (ouvre un nouvel onglet)</span>
          </a>
        )}
      </p>
      <Seam kind="arbres" />
    </div>
  );
}
