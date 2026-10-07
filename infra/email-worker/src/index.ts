import { z } from "zod";
import {
  EMAIL_WORKER_SECRET_MIN_LENGTH,
  type EmailWorkerResponse,
  emailWorkerRequestSchema,
} from "../../../src/lib/email/email-worker-contract";

const MAX_BODY_BYTES = 200_000;
const UNDELIVERED_REASON =
  "Message not delivered, please retry later or use the contact form on instant-tranquille.com";

const envSchema = z.object({
  EMAIL_WORKER_SECRET: z.string().min(EMAIL_WORKER_SECRET_MIN_LENGTH),
  CONTACT_NOTIFY_TO: z
    .string()
    .transform((list) =>
      list
        .split(",")
        .map((address) => address.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.email()).min(1).max(5)),
  EMAIL_FROM_ADDRESS: z.email(),
  EMAIL_FROM_NAME: z.string().min(1),
});

const inboundEnvSchema = envSchema.pick({ CONTACT_NOTIFY_TO: true });

function failure(status: number, code: string, message: string, headers = {}) {
  return Response.json({ error: { code, message } }, { status, headers });
}

async function digestOf(value: string) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
}

async function isAuthorized(request: Request, secret: string) {
  const [scheme, token] = (request.headers.get("authorization") ?? "").split(
    " ",
  );
  if (scheme !== "Bearer" || !token) return false;

  const [received, expected] = await Promise.all([
    digestOf(token),
    digestOf(secret),
  ]);

  return crypto.subtle.timingSafeEqual(received, expected);
}

function parseJson(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return undefined;
  }
}

function refusalOf(reason: unknown) {
  const { code, message } = z
    .object({ code: z.string(), message: z.string() })
    .partial()
    .catch({})
    .parse(reason);

  return {
    code: code ?? "E_UNKNOWN",
    message: message ?? "The email service gave no reason",
  };
}

export default {
  async fetch(request, env): Promise<Response> {
    if (new URL(request.url).pathname !== "/") {
      return failure(404, "NOT_FOUND", "Nothing lives at this path");
    }

    if (request.method !== "POST") {
      return failure(405, "METHOD_NOT_ALLOWED", "Only POST is accepted", {
        allow: "POST",
      });
    }

    const settings = envSchema.safeParse(env);

    if (!settings.success) {
      console.error({
        event: "email_worker_misconfigured",
        issues: z.prettifyError(settings.error),
      });

      return failure(
        500,
        "WORKER_MISCONFIGURED",
        "The email worker is missing a valid secret or recipient list",
      );
    }

    const {
      EMAIL_WORKER_SECRET,
      CONTACT_NOTIFY_TO,
      EMAIL_FROM_ADDRESS,
      EMAIL_FROM_NAME,
    } = settings.data;

    if (!(await isAuthorized(request, EMAIL_WORKER_SECRET))) {
      return failure(
        401,
        "UNAUTHORIZED",
        "A valid bearer secret is required to send an email",
      );
    }

    const body = await request.text();

    if (body.length > MAX_BODY_BYTES) {
      return failure(413, "BODY_TOO_LARGE", "The request body is too large");
    }

    const message = emailWorkerRequestSchema.safeParse(parseJson(body));

    if (!message.success) {
      return failure(
        400,
        "INVALID_REQUEST",
        `The email request is malformed: ${z.prettifyError(message.error)}`,
      );
    }

    const { to, replyTo, subject, text, html } = message.data;
    const recipients = to ?? CONTACT_NOTIFY_TO;

    const outcomes = await Promise.allSettled(
      recipients.map((recipient) =>
        env.EMAIL.send({
          from: { email: EMAIL_FROM_ADDRESS, name: EMAIL_FROM_NAME },
          to: recipient,
          replyTo,
          subject,
          text,
          html,
        }),
      ),
    );

    const rejected = outcomes
      .filter((outcome) => outcome.status === "rejected")
      .map((outcome) => refusalOf(outcome.reason));
    const result: EmailWorkerResponse = {
      accepted: outcomes.length - rejected.length,
      rejected,
    };

    console.log({ event: "email_send", ...result });

    if (result.accepted === 0) {
      const [refusal] = rejected;

      return failure(
        502,
        refusal?.code ?? "E_UNKNOWN",
        `The email service refused every recipient: ${refusal?.message}`,
      );
    }

    return Response.json(result);
  },

  async email(message, env): Promise<void> {
    const settings = inboundEnvSchema.safeParse(env);

    if (!settings.success) {
      console.error({
        event: "email_worker_misconfigured",
        issues: z.prettifyError(settings.error),
      });
      message.setReject(UNDELIVERED_REASON);
      return;
    }

    const messageId = message.headers.get("message-id");
    let forwarded = 0;

    for (const [
      position,
      recipient,
    ] of settings.data.CONTACT_NOTIFY_TO.entries()) {
      try {
        await message.forward(recipient);
        forwarded += 1;
      } catch (error) {
        console.error({
          event: "inbound_forward_failed",
          messageId,
          recipient: position + 1,
          ...refusalOf(error),
        });
      }
    }

    console.log({
      event: "inbound_forward",
      messageId,
      size: message.rawSize,
      forwarded,
      recipients: settings.data.CONTACT_NOTIFY_TO.length,
    });

    if (forwarded === 0) message.setReject(UNDELIVERED_REASON);
  },
} satisfies ExportedHandler<Env>;
