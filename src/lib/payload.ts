import { cache } from "react";
import { getPayload as getPayloadInstance } from "payload";
import config from "@payload-config";

export const getPayload = cache(async () => {
  return getPayloadInstance({ config });
});
