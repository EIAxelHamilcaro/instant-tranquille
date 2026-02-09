import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import { generateCmsPageMetadata } from "@/lib/seo";
import { generateBreadcrumbJsonLd } from "@/lib/jsonld";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapPlaceholder } from "@/components/contact/MapPlaceholder";
import { AccessInstructions } from "@/components/contact/AccessInstructions";

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
    `${messages.contact.title} — L'Instant Tranquille`,
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
      <ContactForm />
      <MapPlaceholder />
      <AccessInstructions />
    </>
  );
}
