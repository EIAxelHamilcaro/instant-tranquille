import type { Payload } from "payload";
import type { PlaceCategory } from "../../src/lib/places";
import { GUIDES } from "./content/guides";
import type { MediaIds } from "./media";
import type { PlaceIds } from "./places";
import { type Block, richText } from "./rich-text";

interface GuideText {
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  body: Block[];
  faq: { question: string; answer: string }[];
  practical?: { label: string; value: string }[];
}

export interface SeedSource {
  url: string;
  fr: string;
  en: string;
}

export interface SeedGuide {
  slug: string;
  theme: Exclude<PlaceCategory, "pratique">;
  image?: string;
  places: string[];
  checkedAt?: string;
  sources?: SeedSource[];
  fr: GuideText;
  en: GuideText;
}

export type GuideIds = Record<string, number>;

interface SeedGuidesContext {
  media: MediaIds;
  places: PlaceIds;
}

const localized = (text: GuideText) => ({
  title: text.title,
  excerpt: text.excerpt,
  body: richText(text.body),
  meta: { title: text.metaTitle, description: text.metaDescription },
});

export async function seedGuides(
  payload: Payload,
  { media, places }: SeedGuidesContext,
) {
  const ids: GuideIds = {};

  for (const guide of GUIDES) {
    const existing = await payload.find({
      collection: "guides",
      where: { slug: { equals: guide.slug } },
      limit: 1,
      depth: 0,
    });

    const data = {
      ...localized(guide.fr),
      slug: guide.slug,
      theme: guide.theme,
      places: guide.places
        .map((key) => places[key])
        .filter((id): id is number => id !== undefined),
      faq: guide.fr.faq,
      practical: guide.fr.practical ?? [],
      checkedAt: guide.checkedAt ?? null,
      sources: (guide.sources ?? []).map(({ url, fr }) => ({ url, name: fr })),
      _status: "published" as const,
    };
    const current = existing.docs[0];
    const saved = current
      ? await payload.update({
          collection: "guides",
          id: current.id,
          locale: "fr",
          data,
        })
      : await payload.create({
          collection: "guides",
          locale: "fr",
          data: {
            ...data,
            image: guide.image ? media[guide.image] : undefined,
          },
        });

    await payload.update({
      collection: "guides",
      id: saved.id,
      locale: "en",
      data: {
        ...localized(guide.en),
        faq: saved.faq?.map((item, index) => ({
          id: item.id,
          question: guide.en.faq[index]?.question ?? item.question,
          answer: guide.en.faq[index]?.answer ?? item.answer,
        })),
        practical: saved.practical?.map((item, index) => ({
          id: item.id,
          label: guide.en.practical?.[index]?.label ?? item.label,
          value: guide.en.practical?.[index]?.value ?? item.value,
        })),
        sources: saved.sources?.map((item, index) => ({
          id: item.id,
          url: item.url,
          name: guide.sources?.[index]?.en ?? item.name,
        })),
        _status: "published",
      },
    });

    ids[guide.slug] = saved.id;
  }

  console.log(`Guides ready: ${Object.keys(ids).length}`);

  return ids;
}
