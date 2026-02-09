import { revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

function safeRevalidateTag(tag: string) {
  try {
    revalidateTag(tag, "default");
  } catch {
    // Outside Next.js request context (e.g. seed script) — ignore
  }
}

export function revalidateCollection(tag: string) {
  const afterChange: CollectionAfterChangeHook = ({ doc }) => {
    safeRevalidateTag(tag);
    return doc;
  };

  const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
    safeRevalidateTag(tag);
    return doc;
  };

  return {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  };
}

export function revalidateGlobal(tag: string) {
  const afterChange: GlobalAfterChangeHook = ({ doc }) => {
    safeRevalidateTag(tag);
    return doc;
  };

  return {
    afterChange: [afterChange],
  };
}
