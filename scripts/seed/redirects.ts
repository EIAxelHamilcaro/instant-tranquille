import type { Payload } from "payload";
import { RETIRED_GUIDES } from "./content/guides";

export async function seedRedirects(payload: Payload) {
  let created = 0;

  for (const [retired, target] of Object.entries(RETIRED_GUIDES)) {
    const from = `/guides/${retired}`;
    const [existing, guide] = await Promise.all([
      payload.count({
        collection: "redirects",
        where: { from: { equals: from } },
        trash: true,
      }),
      payload.find({
        collection: "guides",
        where: { slug: { equals: target } },
        limit: 1,
        depth: 0,
      }),
    ]);

    if (existing.totalDocs > 0) continue;
    if (!guide.docs[0]) {
      console.error(`Redirect skipped: guide ${target} does not exist`);
      continue;
    }

    await payload.create({
      collection: "redirects",
      data: {
        from,
        to: {
          type: "reference",
          reference: { relationTo: "guides", value: guide.docs[0].id },
        },
      },
    });
    created += 1;
  }

  console.log(`Redirects created: ${created}`);
}
