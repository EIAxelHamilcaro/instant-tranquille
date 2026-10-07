"use server";

import { after } from "next/server";
import { z } from "zod";
import {
  type ContactFormState,
  HONEYPOT_FIELD,
} from "@/components/contact/contact-form-state";
import {
  CONTACT_FIELDS,
  type ContactValues,
  contactSchema,
} from "@/components/contact/contact-schema";
import { notifyContactMessage } from "@/lib/email/notify-contact-message";
import { getPayload } from "@/lib/payload";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const SENT: ContactFormState = {
  status: "success",
  fieldErrors: {},
  values: {},
};

function textField(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value : "";
}

async function passesTurnstile(formData: FormData) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.VERCEL_ENV !== "production";

  const token = textField(formData, "cf-turnstile-response");
  if (!token) return false;

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body: new URLSearchParams({ secret, response: token }),
  });
  const verification: { success?: boolean } = await response.json();

  return verification.success === true;
}

function subjectOf({ name, dates }: ContactValues) {
  return dates ? `Séjour ${dates} : ${name}` : `Message de ${name}`;
}

export async function sendContactMessage(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (textField(formData, HONEYPOT_FIELD)) return SENT;

  const values = Object.fromEntries(
    CONTACT_FIELDS.map((field) => [field, textField(formData, field)]),
  );
  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);

    return {
      status: "error",
      values,
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([field, errors]) => [
          field,
          errors?.[0],
        ]),
      ),
    };
  }

  const payload = await getPayload();

  try {
    if (!(await passesTurnstile(formData))) {
      return {
        status: "error",
        formError: "captcha",
        fieldErrors: {},
        values,
      };
    }

    const { phone, dates, ...message } = parsed.data;

    await payload.create({
      collection: "contact-messages",
      data: {
        ...message,
        phone: phone || undefined,
        dates: dates || undefined,
        subject: subjectOf(parsed.data),
      },
    });

    after(() => notifyContactMessage(payload, parsed.data));

    return SENT;
  } catch (error) {
    payload.logger.error({ err: error }, "Contact message could not be saved");

    return { status: "error", formError: "server", fieldErrors: {}, values };
  }
}
