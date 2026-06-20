import { OG_SIZE, renderOGTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt =
  "Les Alentours — Châteaux, nature et sports équestres en Sologne";
export const size = OG_SIZE;
export const contentType = "image/png";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function OGImage() {
  const imageSrc = `${SITE_URL}/images/jardin-terrasse-vue-ensemble.webp`;

  return renderOGTemplate({
    title: "Les Alentours",
    subtitle:
      "Châteaux de la Loire, étangs, forêts et Grand Parquet de Lamotte-Beuvron à 17 km.",
    imageSrc,
    tags: ["Chambord", "Cheverny", "Grand Parquet", "Cavaliers"],
  });
}
