"use server";

import { z } from "zod";
import { getPayload } from "@/lib/payload";

const testimonialSchema = z.object({
  guestName: z.string().min(1).max(200),
  guestOrigin: z.string().max(200).optional(),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().min(10).max(2000),
  stayDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type TestimonialFormState = {
  success: boolean;
  error?: string;
  fieldErrors?: Partial<Record<"guestName" | "text" | "stayDate" | "rating", string>>;
  values?: {
    guestName?: string;
    guestOrigin?: string;
    rating?: number;
    text?: string;
    stayDate?: string;
  };
};

export async function submitTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
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
    guestName: formData.get("guestName"),
    guestOrigin: formData.get("guestOrigin") || undefined,
    rating: formData.get("rating"),
    text: formData.get("text"),
    stayDate: formData.get("stayDate"),
  };

  const values = {
    guestName: (raw.guestName as string) || "",
    guestOrigin: (raw.guestOrigin as string) || "",
    rating: Number(raw.rating) || 5,
    text: (raw.text as string) || "",
    stayDate: (raw.stayDate as string) || "",
  };

  const parsed = testimonialSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: TestimonialFormState["fieldErrors"] = {};
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
      collection: "testimonials",
      data: {
        guestName: parsed.data.guestName,
        guestOrigin: parsed.data.guestOrigin || "",
        rating: parsed.data.rating,
        text: parsed.data.text,
        stayDate: parsed.data.stayDate,
        source: "direct",
      },
    });

    return { success: true };
  } catch (err) {
    console.error("[submitTestimonial] Error:", err);
    return { success: false, error: "server_error", values };
  }
}
