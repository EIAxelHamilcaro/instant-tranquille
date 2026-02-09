import { unstable_cache } from "next/cache";
import { getPayload } from "./payload";

// ─── Shared types for CMS data ─────────────────────────────

export type CmsMedia = {
  id: string | number;
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    thumbnail?: { url?: string | null; width?: number | null; height?: number | null } | null;
    card?: { url?: string | null; width?: number | null; height?: number | null } | null;
    hero?: { url?: string | null; width?: number | null; height?: number | null } | null;
  } | null;
};

export type CmsTestimonial = {
  id: string | number;
  guestName: string;
  guestOrigin?: string | null;
  rating: number;
  text: string;
  source?: string | null;
  status?: string | null;
  featured?: boolean | null;
  stayDate?: string | null;
};

export type CmsAmenity = {
  id: string | number;
  name: string;
  icon?: string | null;
  category: string;
  photo?: CmsMedia | string | number | null;
  order?: number | null;
};

export type CmsRecommendation = {
  id: string | number;
  name: string;
  description?: unknown;
  category: string;
  distanceFromGite?: string | null;
  photo?: CmsMedia | string | number | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  featured?: boolean | null;
  order?: number | null;
};

export type CmsPage = {
  id: string | number;
  title?: string | null;
  slug?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: CmsMedia | string | number | null;
  content?: unknown;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    ogImage?: CmsMedia | string | number | null;
  } | null;
};

// ─── Globals ───────────────────────────────────────────────

export async function getSiteSettings(locale: string, draft = false) {
  if (draft) {
    const payload = await getPayload();
    return payload.findGlobal({
      slug: "site-settings",
      locale: locale as "fr" | "en",
      draft: true,
    });
  }
  return unstable_cache(
    async () => {
      const payload = await getPayload();
      return payload.findGlobal({
        slug: "site-settings",
        locale: locale as "fr" | "en",
      });
    },
    ["site-settings", locale],
    { revalidate: 3600, tags: ["site-settings"] },
  )();
}

export async function getHeaderData(locale: string, draft = false) {
  if (draft) {
    const payload = await getPayload();
    return payload.findGlobal({
      slug: "header",
      locale: locale as "fr" | "en",
      draft: true,
    });
  }
  return unstable_cache(
    async () => {
      const payload = await getPayload();
      return payload.findGlobal({
        slug: "header",
        locale: locale as "fr" | "en",
      });
    },
    ["header", locale],
    { revalidate: 3600, tags: ["header"] },
  )();
}

export async function getFooterData(locale: string, draft = false) {
  if (draft) {
    const payload = await getPayload();
    return payload.findGlobal({
      slug: "footer",
      locale: locale as "fr" | "en",
      draft: true,
    });
  }
  return unstable_cache(
    async () => {
      const payload = await getPayload();
      return payload.findGlobal({
        slug: "footer",
        locale: locale as "fr" | "en",
      });
    },
    ["footer", locale],
    { revalidate: 3600, tags: ["footer"] },
  )();
}

export async function getPricingConfig(locale: string, draft = false) {
  if (draft) {
    const payload = await getPayload();
    return payload.findGlobal({
      slug: "pricing-config",
      locale: locale as "fr" | "en",
      draft: true,
    });
  }
  return unstable_cache(
    async () => {
      const payload = await getPayload();
      return payload.findGlobal({
        slug: "pricing-config",
        locale: locale as "fr" | "en",
      });
    },
    ["pricing-config", locale],
    { revalidate: 3600, tags: ["pricing-config"] },
  )();
}

// ─── Collections ───────────────────────────────────────────

export async function getFeaturedTestimonials(locale: string, draft = false) {
  if (draft) {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "testimonials",
      where: {
        featured: { equals: true },
        status: { equals: "approved" },
      },
      sort: "-stayDate",
      locale: locale as "fr" | "en",
      limit: 20,
      draft: true,
    });
    return result.docs as unknown as CmsTestimonial[];
  }
  return unstable_cache(
    async () => {
      const payload = await getPayload();
      const result = await payload.find({
        collection: "testimonials",
        where: {
          featured: { equals: true },
          status: { equals: "approved" },
        },
        sort: "-stayDate",
        locale: locale as "fr" | "en",
        limit: 20,
      });
      return result.docs as unknown as CmsTestimonial[];
    },
    ["testimonials-featured", locale],
    { revalidate: 3600, tags: ["testimonials"] },
  )();
}

export async function getAmenities(locale: string, draft = false) {
  if (draft) {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "amenities",
      sort: "order",
      locale: locale as "fr" | "en",
      limit: 100,
      draft: true,
    });
    return result.docs as unknown as CmsAmenity[];
  }
  return unstable_cache(
    async () => {
      const payload = await getPayload();
      const result = await payload.find({
        collection: "amenities",
        sort: "order",
        locale: locale as "fr" | "en",
        limit: 100,
      });
      return result.docs as unknown as CmsAmenity[];
    },
    ["amenities", locale],
    { revalidate: 3600, tags: ["amenities"] },
  )();
}

export async function getFeaturedRecommendations(locale: string, draft = false) {
  if (draft) {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "local-recommendations",
      where: { featured: { equals: true } },
      sort: "order",
      locale: locale as "fr" | "en",
      limit: 50,
      depth: 1,
      draft: true,
    });
    return result.docs as unknown as CmsRecommendation[];
  }
  return unstable_cache(
    async () => {
      const payload = await getPayload();
      const result = await payload.find({
        collection: "local-recommendations",
        where: { featured: { equals: true } },
        sort: "order",
        locale: locale as "fr" | "en",
        limit: 50,
        depth: 1,
      });
      return result.docs as unknown as CmsRecommendation[];
    },
    ["recommendations-featured", locale],
    { revalidate: 3600, tags: ["recommendations"] },
  )();
}

export async function getPageBySlug(slug: string, locale: string, draft = false) {
  if (draft) {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "pages",
      where: { slug: { equals: slug } },
      locale: locale as "fr" | "en",
      limit: 1,
      depth: 2,
      draft: true,
    });
    return (result.docs[0] as unknown as CmsPage) || null;
  }
  return unstable_cache(
    async () => {
      const payload = await getPayload();
      const result = await payload.find({
        collection: "pages",
        where: { slug: { equals: slug } },
        locale: locale as "fr" | "en",
        limit: 1,
        depth: 2,
      });
      return (result.docs[0] as unknown as CmsPage) || null;
    },
    ["pages", slug, locale],
    { revalidate: 3600, tags: ["pages"] },
  )();
}
