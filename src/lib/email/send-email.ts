import type { EmailConfig } from "@/lib/email/email-config";
import {
  type EmailWorkerRequest,
  type EmailWorkerResponse,
  emailWorkerErrorSchema,
  emailWorkerRequestSchema,
  emailWorkerResponseSchema,
} from "@/lib/email/email-worker-contract";

const SEND_TIMEOUT_MS = 10_000;

async function failureOf(response: Response) {
  const body = emailWorkerErrorSchema.safeParse(
    await response.json().catch(() => null),
  );
  const detail = body.success
    ? `${body.data.error.code}: ${body.data.error.message}`
    : "no readable error body";

  return new Error(
    `Email worker answered ${response.status} (${detail}), the email was not sent`,
  );
}

export async function sendEmail(
  message: EmailWorkerRequest,
  { workerUrl, workerSecret }: EmailConfig,
): Promise<EmailWorkerResponse> {
  const body = emailWorkerRequestSchema.parse(message);

  const response = await fetch(workerUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${workerSecret}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
  });

  if (!response.ok) throw await failureOf(response);

  return emailWorkerResponseSchema.parse(await response.json());
}
