import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/legal/LegalDocument";
import type { Locale } from "@/i18n/config";
import { legalMetadata } from "@/lib/legal";

interface PrivacyPolicyPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: PrivacyPolicyPageProps): Promise<Metadata> {
  const { locale } = await params;

  return legalMetadata("privacy", locale);
}

export default async function PrivacyPolicyPage({
  params,
}: PrivacyPolicyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalDocument document="privacy" locale={locale} />;
}
