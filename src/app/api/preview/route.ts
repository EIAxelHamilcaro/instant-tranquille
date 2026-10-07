import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { isSafeRedirectPath, previewSecret } from "@/lib/preview-url";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const slug = request.nextUrl.searchParams.get("slug") || "/";

  if (!secret || secret !== previewSecret()) {
    return new Response("Invalid secret", { status: 401 });
  }

  if (!isSafeRedirectPath(slug)) {
    return new Response("Invalid slug", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(slug);
}
