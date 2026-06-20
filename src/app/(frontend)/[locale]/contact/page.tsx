import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { AccessInstructions } from "@/components/contact/AccessInstructions";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapSection } from "@/components/contact/MapPlaceholder";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import type { Locale } from "@/i18n/config";
import {
  generateBreadcrumbJsonLd,
  generateLodgingBusinessJsonLd,
} from "@/lib/jsonld";
import { getSiteSettings } from "@/lib/queries";
import { generateCmsPageMetadata } from "@/lib/seo";

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
  const siteSettings = (await getSiteSettings(locale, isDraft)) as Record<
    string,
    unknown
  >;

  const contactRaw = siteSettings?.contact as
    | Record<string, unknown>
    | undefined;
  const coordinatesRaw = contactRaw?.coordinates as
    | Record<string, unknown>
    | undefined;
  const _coordinates = coordinatesRaw;
  const siteName = siteSettings?.siteName as string | undefined;
  const accessRoutes = siteSettings?.accessRoutes as
    | {
        from: string;
        duration: string;
        distance: string;
        description: string;
      }[]
    | undefined;

  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: messages.nav.home, url: "/" },
    { name: messages.contact.title, url: "/contact" },
  ]);

  const businessJsonLd = generateLodgingBusinessJsonLd({
    telephone: contactRaw?.phone as string | undefined,
    email: contactRaw?.email as string | undefined,
    address: contactRaw?.address as string | undefined,
    city: contactRaw?.city as string | undefined,
    postalCode: contactRaw?.postalCode as string | undefined,
    lat: coordinatesRaw?.lat as number | undefined,
    lng: coordinatesRaw?.lng as number | undefined,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <h1 className="sr-only">{messages.contact.h1}</h1>
      <Breadcrumbs
        items={[
          { label: messages.nav.home, href: "/" },
          { label: messages.contact.title },
        ]}
      />
      <ContactForm />
      <MapSection
        lat={coordinatesRaw?.lat as number | undefined}
        lng={coordinatesRaw?.lng as number | undefined}
        zoom={coordinatesRaw?.zoom as number | undefined}
        markerLabel={
          (coordinatesRaw?.markerLabel as string | undefined) ?? siteName
        }
      />
      <AccessInstructions routes={accessRoutes} />
    </>
  );
}
