import type { ServerProps } from "payload";
import { getUnreadMessages } from "@/lib/admin-stats";
import TabBarLinks from "./TabBarLinks";

export default async function TabBar({ payload, user }: ServerProps) {
  if (!user) return null;

  return (
    <TabBarLinks
      adminRoute={payload.config.routes.admin}
      unread={await getUnreadMessages()}
    />
  );
}
