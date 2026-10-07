import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { pageShareImage } from "@/lib/share-image/content";

export const LEGAL_UPDATED_AT = "2026-10-07";

export const LEGAL_DOCUMENTS = {
  notice: {
    href: "/mentions-legales",
    sections: ["publisher", "hosting", "booking", "property", "data"],
  },
  privacy: {
    href: "/confidentialite",
    sections: [
      "controller",
      "collected",
      "purpose",
      "recipients",
      "retention",
      "transfers",
      "cookies",
      "booking",
      "rights",
    ],
  },
} as const;

export type LegalDocumentKey = keyof typeof LEGAL_DOCUMENTS;

export async function legalMetadata(
  document: LegalDocumentKey,
  locale: Locale,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `legal.${document}` });

  return pageMetadata({
    locale,
    href: LEGAL_DOCUMENTS[document].href,
    title: t("metaTitle"),
    description: t("description"),
    share: await pageShareImage("home", locale),
  });
}
