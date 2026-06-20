import { OG_SIZE, renderOGTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "Le Gîte — L'Instant Tranquille en Sologne";
export const size = OG_SIZE;
export const contentType = "image/png";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function OGImage() {
  const imageSrc = `${SITE_URL}/images/salon-cheminee-canapes-tv.webp`;

  return renderOGTemplate({
    title: "Le Gîte",
    subtitle:
      "120 m², 3 chambres, 6 personnes. Une maison solognote rénovée à Romorantin-Lanthenay.",
    imageSrc,
    tags: ["3 chambres", "6 personnes", "120 m²", "Sologne"],
  });
}
