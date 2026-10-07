import { z } from "zod";
import { EMAIL_WORKER_SECRET_MIN_LENGTH } from "@/lib/email/email-worker-contract";

const emailEnvSchema = z.object({
  EMAIL_WORKER_URL: z.url({ protocol: /^https$/ }),
  EMAIL_WORKER_SECRET: z.string().min(EMAIL_WORKER_SECRET_MIN_LENGTH),
});

export interface EmailConfig {
  workerUrl: string;
  workerSecret: string;
}

type EmailEnv = Record<string, string | undefined>;

export function readEmailConfig(
  env: EmailEnv = process.env,
): EmailConfig | null {
  const { EMAIL_WORKER_URL, EMAIL_WORKER_SECRET } = env;
  if (!EMAIL_WORKER_URL && !EMAIL_WORKER_SECRET) return null;

  const parsed = emailEnvSchema.safeParse({
    EMAIL_WORKER_URL,
    EMAIL_WORKER_SECRET,
  });

  if (!parsed.success) {
    throw new Error(
      `Email is misconfigured, set both EMAIL_WORKER_URL (https) and EMAIL_WORKER_SECRET (${EMAIL_WORKER_SECRET_MIN_LENGTH}+ characters) or neither: ${z.prettifyError(parsed.error)}`,
    );
  }

  return {
    workerUrl: parsed.data.EMAIL_WORKER_URL,
    workerSecret: parsed.data.EMAIL_WORKER_SECRET,
  };
}
