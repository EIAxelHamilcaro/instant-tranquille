import { LLMS_HEADERS, llmsFull } from "@/lib/llms";

export const revalidate = 86400;

export async function GET() {
  return new Response(await llmsFull(), { headers: LLMS_HEADERS });
}
