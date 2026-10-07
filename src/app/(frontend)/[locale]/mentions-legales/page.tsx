import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/legal/LegalDocument";
import type { Locale } from "@/i18n/config";
import { legalMetadata } from "@/lib/legal";

interface LegalNoticePageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: LegalNoticePageProps): Promise<Metadata> {
  const { locale } = await params;

  return legalMetadata("notice", locale);
}

export default async function LegalNoticePage({
  params,
}: LegalNoticePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalDocument document="notice" locale={locale} />;
}
