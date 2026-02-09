"use server";

import { z } from "zod";

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
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, error: "validation_error" };
  }

  try {
    // For now, log the contact form submission
    // In production, integrate with an email service (Resend, SendGrid, etc.)
    console.log("Contact form submission:", parsed.data);

    return { success: true };
  } catch {
    return { success: false, error: "server_error" };
  }
}
