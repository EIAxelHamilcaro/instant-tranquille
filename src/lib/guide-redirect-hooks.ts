import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
} from "payload";

const guidePath = (slug: string) => `/guides/${slug}`;

export const rememberLiveSlug: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  if (operation !== "update" || data._status !== "published") return data;

  const live = await req.payload.findByID({
    collection: "guides",
    id: originalDoc.id,
    depth: 0,
    draft: false,
    trash: true,
    select: { slug: true, _status: true },
    req,
  });
  if (live._status === "published") req.context.liveSlug = live.slug;

  return data;
};

export const redirectFormerSlug: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  const { liveSlug } = req.context;
  if (typeof liveSlug !== "string" || !doc.slug || liveSlug === doc.slug) {
    return doc;
  }

  await req.payload.delete({
    collection: "redirects",
    where: { from: { in: [guidePath(liveSlug), guidePath(doc.slug)] } },
    trash: true,
    req,
  });
  await req.payload.create({
    collection: "redirects",
    data: {
      from: guidePath(liveSlug),
      to: {
        type: "reference",
        reference: { relationTo: "guides", value: doc.id },
      },
    },
    req,
  });

  return doc;
};
