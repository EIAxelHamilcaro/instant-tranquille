import type { EmailAdapter, SendEmailOptions } from "payload";
import type { EmailConfig } from "@/lib/email/email-config";
import type { EmailWorkerResponse } from "@/lib/email/email-worker-contract";
import { sendEmail } from "@/lib/email/send-email";

const DEFAULT_FROM_ADDRESS = "contact@instant-tranquille.com";
const DEFAULT_FROM_NAME = "L'Instant Tranquille";

type Recipients = SendEmailOptions["to"];

function addressesOf(recipients: Recipients): string[] {
  if (!recipients) return [];
  if (Array.isArray(recipients)) return recipients.flatMap(addressesOf);

  return [typeof recipients === "string" ? recipients : recipients.address];
}

export function workerEmailAdapter(
  config: EmailConfig,
): EmailAdapter<EmailWorkerResponse> {
  return () => ({
    name: "cloudflare-email-worker",
    defaultFromAddress: DEFAULT_FROM_ADDRESS,
    defaultFromName: DEFAULT_FROM_NAME,
    sendEmail: async ({ to, subject, text, html }) => {
      const result = await sendEmail(
        {
          to: addressesOf(to),
          subject: subject ?? DEFAULT_FROM_NAME,
          text: typeof text === "string" ? text : undefined,
          html: typeof html === "string" ? html : undefined,
        },
        config,
      );

      if (result.rejected.length > 0) {
        const [refusal] = result.rejected;

        throw new Error(
          `Email was refused for ${result.rejected.length} recipient(s): ${refusal?.code} ${refusal?.message}`,
        );
      }

      return result;
    },
  });
}
