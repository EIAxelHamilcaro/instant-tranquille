"use server";

import { after } from "next/server";
import { z } from "zod";
import { contactFormFields } from "@/components/contact/contact-form-fields";
import {
  type ContactFormState,
  HONEYPOT_FIELD,
} from "@/components/contact/contact-form-state";
import { contactRefusal } from "@/components/contact/contact-guard";
import {
  CONTACT_FIELDS,
  type ContactEnquiry,
  contactSchema,
} from "@/components/contact/contact-schema";
import { stayLabel } from "@/components/contact/stay-label";
import { defaultLocale } from "@/i18n/config";
import { notifyContactMessage } from "@/lib/email/notify-contact-message";
import { getPayload } from "@/lib/payload";
import { getGlobal } from "@/lib/queries";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const DAY_MS = 86_400_000;
const DAILY_MESSAGES_PER_SENDER = 3;

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

function subjectOf({ name, dates }: ContactEnquiry) {
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
  const page = await getGlobal("contact-page", defaultLocale);
  const parsed = contactSchema(contactFormFields(page)).safeParse(values);

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

  const refusal = contactRefusal(parsed.data);
  if (refusal) {
    return { status: "error", values, fieldErrors: { message: refusal } };
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

    const { arrival, departure, ...message } = parsed.data;
    const enquiry = { ...message, dates: stayLabel(arrival, departure) };
    const { totalDocs: sentToday } = await payload.count({
      collection: "contact-messages",
      where: {
        email: { equals: enquiry.email },
        createdAt: {
          greater_than: new Date(Date.now() - DAY_MS).toISOString(),
        },
      },
    });

    if (sentToday >= DAILY_MESSAGES_PER_SENDER) {
      return {
        status: "error",
        formError: "tooMany",
        fieldErrors: {},
        values,
      };
    }

    await payload.create({
      collection: "contact-messages",
      data: {
        ...enquiry,
        phone: enquiry.phone || undefined,
        dates: enquiry.dates || undefined,
        subject: subjectOf(enquiry),
      },
    });

    after(() => notifyContactMessage(payload, enquiry));

    return SENT;
  } catch (error) {
    payload.logger.error({ err: error }, "Contact message could not be saved");

    return { status: "error", formError: "server", fieldErrors: {}, values };
  }
}
