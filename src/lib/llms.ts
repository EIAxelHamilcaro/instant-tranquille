import { getTranslations } from "next-intl/server";
import { defaultLocale, locales } from "@/i18n/config";
import { LEGAL_DOCUMENTS } from "@/lib/legal";
import { NAV_ITEMS } from "@/lib/nav";
import { formatDrive, PLACE_CATEGORIES } from "@/lib/places";
import {
  formatPrice,
  formatRating,
  type NightlyRate,
  nightlyRates,
  platformName,
  ratedPlatforms,
} from "@/lib/platforms";
import { getAmenities, getGlobal, getGuides, getPlaces } from "@/lib/queries";
import { absoluteUrl, type Href, SITE_URL } from "@/lib/seo";
import type { Guide, Place } from "@/payload-types";

const LOCALE = defaultLocale;

export const LLMS_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
};

const FEE_UNITS = {
  per_stay: "par séjour",
  per_night: "par nuit",
  per_person: "par personne",
};

type Line = string | number | false | null | undefined;

const section = (title: string, lines: Line[]) => {
  const content = lines.filter((line) => typeof line === "string");

  return content.some(Boolean) ? [`## ${title}`, "", ...content, ""] : [];
};

const link = (label: string, href: Href, note?: string | null) =>
  `- [${label}](${absoluteUrl(href, LOCALE)})${note ? `: ${note}` : ""}`;

const guideHref = (guide: Guide): Href => ({
  pathname: "/guides/[slug]",
  params: { slug: guide.slug },
});

interface LexicalNode {
  type?: string;
  text?: string;
  fields?: {
    url?: string;
    steps?: { time: string; title: string; details?: string | null }[];
  };
  children?: LexicalNode[];
}

function inlineMarkdown(node: LexicalNode): string {
  if (typeof node.text === "string") return node.text;

  const content = (node.children ?? []).map(inlineMarkdown).join("");
  if (node.type === "linebreak") return "\n";
  if (node.type !== "link" || !node.fields?.url) return content;

  const url = node.fields.url.startsWith("/")
    ? `${SITE_URL}${node.fields.url}`
    : node.fields.url;

  return `[${content}](${url})`;
}

const tableRowMarkdown = (row: LexicalNode) =>
  `| ${(row.children ?? []).map(inlineMarkdown).join(" | ")} |`;

function tableMarkdown(table: LexicalNode) {
  const [head, ...rows] = table.children ?? [];
  if (!head) return "";

  const separator = `|${(head.children ?? []).map(() => " --- |").join("")}`;

  return [
    tableRowMarkdown(head),
    separator,
    ...rows.map(tableRowMarkdown),
  ].join("\n");
}

function blockMarkdown(block: LexicalNode): string {
  if (block.type === "table") return tableMarkdown(block);
  if (block.type === "block")
    return (block.fields?.steps ?? [])
      .map(
        ({ time, title, details }) =>
          `- **${time}** ${title}${details ? ` : ${details}` : ""}`,
      )
      .join("\n");
  if (block.type === "heading") return `#### ${inlineMarkdown(block)}`;
  if (block.type === "quote") return `> ${inlineMarkdown(block)}`;
  if (block.type === "list")
    return (block.children ?? [])
      .map((item) => `- ${inlineMarkdown(item)}`)
      .join("\n");

  return inlineMarkdown(block);
}

function lexicalToMarkdown(
  value: { root: { children: LexicalNode[] } } | null | undefined,
) {
  return (value?.root.children ?? [])
    .map(blockMarkdown)
    .filter(Boolean)
    .join("\n\n");
}

async function loadContent() {
  const [
    common,
    settings,
    pricing,
    amenities,
    places,
    guides,
    home,
    cottage,
    surroundings,
    rates,
    contact,
  ] = await Promise.all([
    getTranslations({ locale: LOCALE, namespace: "common" }),
    getGlobal("site-settings", LOCALE),
    getGlobal("pricing-config", LOCALE),
    getAmenities(LOCALE),
    getPlaces(LOCALE),
    getGuides(LOCALE),
    getGlobal("home-page", LOCALE),
    getGlobal("cottage-page", LOCALE),
    getGlobal("surroundings-page", LOCALE),
    getGlobal("rates-page", LOCALE),
    getGlobal("contact-page", LOCALE),
  ]);

  const ledes: Partial<Record<string, string | null>> = {
    "/le-gite": cottage.lede,
    "/les-alentours": surroundings.lede,
    "/tarifs-reservation": rates.lede,
    "/contact": contact.lede,
  };

  return {
    common,
    settings,
    pricing,
    amenities,
    places,
    guides,
    home,
    cottage,
    ledes,
  };
}

type Content = Awaited<ReturnType<typeof loadContent>>;

function heading({ common, settings, home }: Content) {
  const { propertyDetails: property, contact } = settings;
  const facts = [
    property?.maxGuests && `Voyageurs : ${property.maxGuests}`,
    property?.bedrooms && `Chambres : ${property.bedrooms}`,
    property?.bathrooms && `Salles de bain : ${property.bathrooms}`,
    property?.surface && `Surface : ${property.surface} m²`,
    contact?.city &&
      `Commune : ${contact.city}${contact.postalCode ? ` (${contact.postalCode})` : ""}`,
  ].filter(Boolean);

  return [
    `# ${common("siteName")}`,
    "",
    `> ${home.lede || settings.siteDescription || settings.tagline}`,
    "",
    `${facts.join(". ")}.`,
    "",
  ];
}

function pageLinks({ common, ledes, guides }: Content) {
  return [
    ...section("Pages", [
      link(common("nav.home"), "/"),
      ...NAV_ITEMS.map(({ key, href }) =>
        link(common(`nav.${key}`), href, ledes[href]),
      ),
      link(common("footer.legalNotice"), LEGAL_DOCUMENTS.notice.href),
      link(common("footer.privacy"), LEGAL_DOCUMENTS.privacy.href),
    ]),
    ...section(
      "Guides de séjour",
      guides.map((guide) => link(guide.title, guideHref(guide), guide.excerpt)),
    ),
  ];
}

function rateLine(rate: NightlyRate, currency: string) {
  return `- ${rate.guests} voyageurs : ${formatPrice(rate.price, currency, LOCALE)} la nuit, prix de base`;
}

function placeLine(place: Place) {
  const events = (place.events ?? [])
    .map((event) =>
      event.period ? `${event.name} (${event.period})` : event.name,
    )
    .join(", ");

  return `- ${[
    `**${place.name}**${place.commune ? ` (${place.commune})` : ""} : ${formatDrive(place.driveMin)} en voiture, ${place.driveKm} km.`,
    place.summary,
    events && `Rendez-vous : ${events}.`,
    place.website,
  ]
    .filter(Boolean)
    .join(" ")}`;
}

function guideBlock(guide: Guide) {
  return [
    `### ${guide.title}`,
    "",
    absoluteUrl(guideHref(guide), LOCALE),
    "",
    guide.excerpt,
    "",
    ...(guide.practical ?? []).map(
      ({ label, value }) => `- ${label} : ${value}`,
    ),
    "",
    lexicalToMarkdown(guide.body),
    "",
    ...(guide.faq ?? []).flatMap(({ question, answer }) => [
      `**${question}**`,
      "",
      answer,
      "",
    ]),
    ...(guide.sources ?? []).map(({ name, url }) => `- [${name}](${url})`),
    "",
  ];
}

export async function llmsIndex() {
  const content = await loadContent();

  return [
    ...heading(content),
    ...pageLinks(content),
    ...section(
      "English",
      locales
        .filter((locale) => locale !== LOCALE)
        .map((locale) => `- [English version](${absoluteUrl("/", locale)})`),
    ),
    ...section("Optional", [
      `- [Contenu complet](${SITE_URL}/llms-full.txt): le gîte, les tarifs, les lieux et le texte des guides en un seul fichier`,
    ]),
  ].join("\n");
}

export async function llmsFull() {
  const content = await loadContent();
  const { common, settings, pricing, amenities, places, guides, cottage } =
    content;
  const { contact, propertyDetails: property } = settings;
  const currency = pricing.currency || "EUR";
  const rates = nightlyRates(pricing);

  return [
    ...heading(content),
    ...section("Le gîte", [
      lexicalToMarkdown(cottage.description),
      "",
      contact?.address &&
        `- Adresse : ${contact.address}, ${contact.postalCode ?? ""} ${contact.city ?? ""}`,
      contact?.coordinates?.lat &&
        `- Coordonnées GPS : ${contact.coordinates.lat}, ${contact.coordinates.lng}`,
      contact?.phone && `- Téléphone : ${contact.phone}`,
      contact?.email && `- Email : ${contact.email}`,
      settings.hosts && `- Hôtes : ${settings.hosts}`,
      typeof property?.petsAllowed === "boolean" &&
        `- Animaux : ${property.petsAllowed ? "acceptés" : "non admis"}`,
      pricing.policies?.checkIn && `- Arrivée : ${pricing.policies.checkIn}`,
      pricing.policies?.checkOut && `- Départ : ${pricing.policies.checkOut}`,
      ...(cottage.rooms ?? []).map(
        (room) =>
          `- ${[room.name, room.details, room.description].filter(Boolean).join(" : ")}`,
      ),
    ]),
    ...section(
      "Équipements",
      amenities.map((amenity) => `- ${amenity.name}`),
    ),
    ...section("Tarifs", [
      ...rates.map((rate) => rateLine(rate, currency)),
      pricing.minimumStay && `- Séjour minimum : ${pricing.minimumStay} nuits`,
      rates.length > 0 && `- ${common("rates.base")} ${common("rates.exact")}`,
      pricing.note && `- ${pricing.note}`,
      ...(pricing.additionalFees ?? []).map(
        (fee) =>
          `- ${fee.name} : ${formatPrice(fee.amount, currency, LOCALE)} ${FEE_UNITS[fee.type ?? "per_stay"]}${fee.description ? ` (${fee.description})` : ""}`,
      ),
      "",
      lexicalToMarkdown(pricing.policies?.cancellation),
      "",
      lexicalToMarkdown(pricing.policies?.deposit),
      "",
      lexicalToMarkdown(pricing.policies?.additional),
      "",
      link("Vérifier les disponibilités", "/tarifs-reservation"),
    ]),
    ...section(
      "Avis des voyageurs",
      ratedPlatforms(settings).map(
        (platform) =>
          `- ${platformName(platform)} : ${formatRating(platform.rating ?? 0, LOCALE)} sur ${platform.ratingScale ?? 5}, ${platform.reviewCount} avis (${platform.url})`,
      ),
    ),
    ...section(
      "Venir au gîte",
      (settings.accessRoutes ?? []).map(
        (route) =>
          `- Depuis ${route.from} : ${route.duration}, ${route.distance}. ${route.description}`,
      ),
    ),
    ...section(
      "Questions fréquentes",
      (settings.faqs ?? []).flatMap((faq) => [
        `### ${faq.question}`,
        "",
        lexicalToMarkdown(faq.answer),
        "",
      ]),
    ),
    ...section(
      "Lieux aux alentours, temps de route depuis le gîte",
      PLACE_CATEGORIES.flatMap((category) => {
        const group = places.filter((place) => place.category === category);

        return group.length > 0
          ? [
              `### ${common(`categories.${category}`)}`,
              "",
              ...group.map(placeLine),
              "",
            ]
          : [];
      }),
    ),
    ...section("Guides de séjour", guides.flatMap(guideBlock)),
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}
