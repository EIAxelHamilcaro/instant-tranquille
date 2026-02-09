import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import { getPayload } from "@/lib/payload";
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

  const payload = await getPayload();
  const siteSettings = await payload.findGlobal({
    slug: "site-settings",
  });

  const coordinates = siteSettings?.contact?.coordinates;
  const siteName = siteSettings?.siteName as string | undefined;
  const accessRoutes = siteSettings?.accessRoutes as
    | { from: string; duration: string; distance: string; description: string }[]
    | undefined;

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: "Accueil", url: "/" },
    { name: "Contact", url: "/contact" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Breadcrumbs
        items={[
          { label: locale === "fr" ? "Accueil" : "Home", href: "/" },
          { label: "Contact" },
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
