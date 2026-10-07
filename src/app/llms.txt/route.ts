import { LLMS_HEADERS, llmsIndex } from "@/lib/llms";

export const revalidate = 86400;

export async function GET() {
  return new Response(await llmsIndex(), { headers: LLMS_HEADERS });
}
