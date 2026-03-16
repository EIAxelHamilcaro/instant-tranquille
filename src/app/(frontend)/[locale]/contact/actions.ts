"use server";

import { z } from "zod";
import { getPayload } from "@/lib/payload";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(300),
  phone: z.string().max(30).optional(),
  subject: z.string().min(1).max(300),
  message: z.string().min(1).max(5000),
});

export type ContactFormState = {
  success: boolean;
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "subject" | "message", string>>;
  values?: {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
  };
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Validate Turnstile token if configured
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = formData.get("cf-turnstile-response") as string;
    if (!token) {
      return { success: false, error: "captcha_required" };
    }
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: turnstileSecret, response: token }),
      },
    );
    const verification = (await verifyRes.json()) as { success: boolean };
    if (!verification.success) {
      return { success: false, error: "captcha_failed" };
    }
  }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const values = {
    name: (raw.name as string) || "",
    email: (raw.email as string) || "",
    phone: (raw.phone as string) || "",
    subject: (raw.subject as string) || "",
    message: (raw.message as string) || "",
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof typeof fieldErrors;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.code;
      }
    }
    return { success: false, error: "validation_error", fieldErrors, values };
  }

  try {
    const payload = await getPayload();
    await payload.create({
      collection: "contact-messages",
      data: parsed.data,
    });

    return { success: true };
  } catch {
    return { success: false, error: "server_error", values };
  }
}
