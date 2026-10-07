import { revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from "payload";

const IMMEDIATELY = { expire: 0 };

interface Versioned {
  _status?: "draft" | "published" | null;
}

function expireTag(tag: string, req: PayloadRequest) {
  try {
    revalidateTag(tag, IMMEDIATELY);
  } catch (error) {
    req.payload.logger.debug({
      msg: `Cache tag "${tag}" left untouched: no Next.js request to revalidate from`,
      err: error,
    });
  }
}

const isDraftOnDraft = (doc: Versioned, previousDoc?: Versioned) =>
  doc?._status === "draft" && previousDoc?._status === "draft";

export function revalidateCollection(tag: string) {
  const afterChange: CollectionAfterChangeHook = ({
    doc,
    previousDoc,
    req,
  }) => {
    if (!isDraftOnDraft(doc, previousDoc)) expireTag(tag, req);

    return doc;
  };

  const afterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
    expireTag(tag, req);

    return doc;
  };

  return {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  };
}

export function revalidateGlobal(tag: string) {
  const afterChange: GlobalAfterChangeHook = ({ doc, previousDoc, req }) => {
    if (!isDraftOnDraft(doc, previousDoc)) expireTag(tag, req);

    return doc;
  };

  return {
    afterChange: [afterChange],
  };
}
