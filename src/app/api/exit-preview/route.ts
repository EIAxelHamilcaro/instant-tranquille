import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") || "/";

  if (!slug.startsWith("/") || slug.startsWith("//")) {
    return new Response("Invalid slug", { status: 400 });
  }

  const draft = await draftMode();
  draft.disable();

  redirect(slug);
}
