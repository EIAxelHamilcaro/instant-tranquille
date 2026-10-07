import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { isSafeRedirectPath } from "@/lib/preview-url";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") || "/";

  if (!isSafeRedirectPath(slug)) {
    return new Response("Invalid slug", { status: 400 });
  }

  const draft = await draftMode();
  draft.disable();

  redirect(slug);
}
