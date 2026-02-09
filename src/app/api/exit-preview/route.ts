import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") || "/";

  const draft = await draftMode();
  draft.disable();

  redirect(slug);
}
