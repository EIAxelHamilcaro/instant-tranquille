import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPayload } from "@/lib/payload";
import { getSiteSettings } from "@/lib/queries";
import { BookletLayout } from "@/components/booklet/BookletLayout";
import { BookletPageClient } from "@/components/live-preview/BookletPageClient";
import type { BookletSection } from "@/types/booklet";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booklet" });

  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

async function getGuide(accessToken: string, locale: string, draft = false) {
  try {
    const payload = await getPayload();
    const now = new Date().toISOString();
    const result = await payload.find({
      collection: "onboarding-guides",
      where: {
        and: [
          { accessToken: { equals: accessToken } },
          { isActive: { equals: true } },
          { or: [{ validFrom: { exists: false } }, { validFrom: { less_than_equal: now } }] },
          { or: [{ validUntil: { exists: false } }, { validUntil: { greater_than_equal: now } }] },
        ],
      },
      locale: locale as "fr" | "en",
      limit: 1,
      depth: 2,
      draft,
    });
    return result.docs[0] || null;
  } catch {
    return null;
  }
}

export default async function BookletPage({
  params,
}: {
  params: Promise<{ locale: string; accessToken: string }>;
}) {
  const { locale, accessToken } = await params;
  setRequestLocale(locale);

  const { isEnabled: isDraft } = await draftMode();

  const siteSettings = await getSiteSettings(locale, isDraft) as Record<string, any>;
  const siteName = (siteSettings?.siteName as string) || "L'Instant Tranquille";

  const guide = await getGuide(accessToken, locale, isDraft);

  if (!guide) {
    notFound();
  }

  const sections = (guide.sections ?? []) as BookletSection[];

  if (isDraft) {
    return (
      <BookletPageClient
        siteName={siteName}
        initialData={{ title: guide.title as string, sections }}
      />
    );
  }

  return (
    <BookletLayout
      title={guide.title as string}
      siteName={siteName}
      sections={sections}
    />
  );
}
