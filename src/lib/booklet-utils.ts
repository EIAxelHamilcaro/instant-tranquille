export type NormalizedRecommendation = {
  name: string;
  category: string;
  description?: string;
  richDescription?: unknown;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  distanceFromGite?: string | null;
};

export function normalizeRecommendations(
  items: unknown[] | null | undefined,
): NormalizedRecommendation[] {
  if (!items) return [];
  return items
    .map((r: unknown) => {
      const rec = r as Record<string, unknown>;
      return typeof rec === "object" && rec !== null
        ? {
            name: (rec.name as string) || "",
            category: (rec.category as string) || "",
            description:
              typeof rec.description === "string" ? rec.description : undefined,
            richDescription:
              typeof rec.description === "object" && rec.description !== null
                ? rec.description
                : undefined,
            address: rec.address as string | undefined,
            phone: rec.phone as string | undefined,
            website: rec.website as string | undefined,
            distanceFromGite: rec.distanceFromGite as string | undefined,
          }
        : null;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
}
