import type { Payload } from "payload";
import type { ContactEnquiry } from "@/components/contact/contact-schema";
import { buildContactNotification } from "@/lib/email/contact-notification";
import { readEmailConfig } from "@/lib/email/email-config";
import { sendEmail } from "@/lib/email/send-email";

export async function notifyContactMessage(
  payload: Payload,
  values: ContactEnquiry,
) {
  try {
    const config = readEmailConfig();

    if (!config) {
      payload.logger.info(
        "Contact notification skipped, email is not configured",
      );
      return;
    }

    const { accepted, rejected } = await sendEmail(
      buildContactNotification(values),
      config,
    );

    if (rejected.length > 0) {
      payload.logger.error(
        { accepted, rejected },
        "Contact notification was refused for some recipients",
      );
      return;
    }

    payload.logger.info({ accepted }, "Contact notification sent");
  } catch (error) {
    payload.logger.error(
      { err: error },
      "Contact notification could not be sent, the message itself is saved",
    );
  }
}
