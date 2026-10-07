import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { followRedirect } from "@/lib/follow-redirect";

interface CatchAllPageProps {
  params: Promise<{ locale: Locale; rest: string[] }>;
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { locale, rest } = await params;
  await followRedirect(`/${rest.join("/")}`, locale);

  notFound();
}
