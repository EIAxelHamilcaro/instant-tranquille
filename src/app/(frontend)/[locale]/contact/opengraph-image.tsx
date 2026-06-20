import { OG_SIZE, renderOGTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "Contact — L'Instant Tranquille, gîte en Sologne";
export const size = OG_SIZE;
export const contentType = "image/png";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function OGImage() {
  const imageSrc = `${SITE_URL}/images/entree-commode-deco-briques.webp`;

  return renderOGTemplate({
    title: "Nous contacter",
    subtitle:
      "Une question sur votre séjour en Sologne ? Contactez-nous directement.",
    imageSrc,
    tags: ["Romorantin-Lanthenay", "Loir-et-Cher", "Sologne"],
  });
}
