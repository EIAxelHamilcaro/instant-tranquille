import type { JSXConverters } from "@payloadcms/richtext-lexical/react";
import { cloneElement, isValidElement } from "react";

type ListItemConverter = NonNullable<JSXConverters["listitem"]>;

export function bulletItemsWithoutValue(
  defaults: JSXConverters,
): Pick<JSXConverters, "listitem"> {
  const render = defaults.listitem;
  if (typeof render !== "function") return {};

  const listitem: ListItemConverter = (args) => {
    const item = render(args);
    const numbered =
      "listType" in args.parent && args.parent.listType === "number";
    if (numbered || !isValidElement<{ value?: number }>(item)) return item;

    return cloneElement(item, { value: undefined });
  };

  return { listitem };
}
