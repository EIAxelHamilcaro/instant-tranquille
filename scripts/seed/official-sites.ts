import type { Payload } from "payload";
import { OFFICIAL_SITES } from "./content/official-sites";

export type OfficialSiteIds = Record<string, number>;

const ORDER_STEP = 10;

export async function seedOfficialSites(payload: Payload) {
  const ids: OfficialSiteIds = {};

  for (const [index, site] of OFFICIAL_SITES.entries()) {
    const existing = await payload.find({
      collection: "official-sites",
      where: { url: { equals: site.url } },
      limit: 1,
      depth: 0,
    });

    if (existing.docs[0]) {
      ids[site.key] = existing.docs[0].id;
      continue;
    }

    const created = await payload.create({
      collection: "official-sites",
      locale: "fr",
      data: {
        ...site.fr,
        url: site.url,
        group: site.group,
        order: (index + 1) * ORDER_STEP,
        showInFooter: site.showInFooter ?? false,
      },
    });
    await payload.update({
      collection: "official-sites",
      id: created.id,
      locale: "en",
      data: site.en,
    });

    ids[site.key] = created.id;
  }

  console.log(`Official sites ready: ${Object.keys(ids).length}`);

  return ids;
}
