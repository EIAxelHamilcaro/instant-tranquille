import { draftMode } from "next/headers";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { shareContent } from "@/lib/share-image/content";
import { renderShareImage } from "@/lib/share-image/render";
import { parseShareKey, SHARE_IMAGE_TYPE } from "@/lib/share-image/spec";
import type { Media } from "@/payload-types";

const PUBLIC_CACHE =
  "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800";
const PRIVATE_CACHE = "private, no-store";
const DEFAULT_FOCAL = 50;

interface RouteContext {
  params: Promise<{ locale: string; key: string[] }>;
}

async function downloadPhoto(photo: Media | null, request: Request) {
  if (!photo?.url) return null;

  const attempts = [photo.url, photo.url, photo.sizes?.share?.url];

  for (const url of attempts) {
    if (!url) continue;

    const response = await fetch(new URL(url, request.url));
    if (response.ok) return Buffer.from(await response.arrayBuffer());
  }

  return null;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { locale, key } = await params;
  const target = parseShareKey(key);
  if (!target || !hasLocale(routing.locales, locale)) {
    return new Response("Not found", { status: 404 });
  }

  const [content, common, draft] = await Promise.all([
    shareContent(target, locale),
    getTranslations({ locale, namespace: "common" }),
    draftMode(),
  ]);
  if (!content) return new Response("Not found", { status: 404 });

  const photo = await downloadPhoto(content.photo, request);
  const image = await renderShareImage({
    siteName: common("siteName"),
    title: content.title,
    proof: content.proof,
    panel: content.panel,
    photo,
    focal: {
      x: content.photo?.focalX ?? DEFAULT_FOCAL,
      y: content.photo?.focalY ?? DEFAULT_FOCAL,
    },
  });

  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": SHARE_IMAGE_TYPE,
      "Content-Length": String(image.byteLength),
      "Cache-Control": draft.isEnabled || !photo ? PRIVATE_CACHE : PUBLIC_CACHE,
    },
  });
}
