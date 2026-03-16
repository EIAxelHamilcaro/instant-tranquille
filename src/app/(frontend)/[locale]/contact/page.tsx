import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import { getSiteSettings } from "@/lib/queries";
import { generateCmsPageMetadata } from "@/lib/seo";
import { generateBreadcrumbJsonLd } from "@/lib/jsonld";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapSection } from "@/components/contact/MapPlaceholder";
import { AccessInstructions } from "@/components/contact/AccessInstructions";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;

  return generateCmsPageMetadata(
    "contact",
    locale as Locale,
    "/contact",
    messages.contact.title,
    messages.contact.description,
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { isEnabled: isDraft } = await draftMode();
  const siteSettings = await getSiteSettings(locale, isDraft) as Record<string, any>;

  const coordinates = siteSettings?.contact?.coordinates;
  const siteName = siteSettings?.siteName as string | undefined;
  const accessRoutes = siteSettings?.accessRoutes as
    | { from: string; duration: string; distance: string; description: string }[]
    | undefined;

  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: messages.nav.home, url: "/" },
    { name: messages.contact.title, url: "/contact" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Breadcrumbs
        items={[
          { label: messages.nav.home, href: "/" },
          { label: messages.contact.title },
        ]}
      />
      <ContactForm />
      <MapSection
        lat={coordinates?.lat}
        lng={coordinates?.lng}
        zoom={coordinates?.zoom as number | undefined}
        markerLabel={(coordinates?.markerLabel as string | undefined) ?? siteName}
      />
      <AccessInstructions routes={accessRoutes} />
    </>
  );
}
