import type { Payload } from "payload";
import { RETIRED_GUIDES } from "./content/guides";

export async function retireGuides(payload: Payload) {
  const { docs, errors } = await payload.delete({
    collection: "guides",
    where: { slug: { in: Object.keys(RETIRED_GUIDES) } },
    depth: 0,
  });

  for (const { id, message } of errors) {
    console.error(`Guide ${id} could not be retired: ${message}`);
  }
  for (const { slug } of docs) {
    console.log(`Guide retired: ${slug}, merged into ${RETIRED_GUIDES[slug]}`);
  }
  console.log(`Guides retired: ${docs.length}`);
}
