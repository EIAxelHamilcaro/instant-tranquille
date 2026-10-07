import { z } from "zod";
import { validatePhone } from "@/lib/validators";

export const OPTIONAL_FIELD_MODES = ["hidden", "optional", "required"] as const;
export type OptionalFieldMode = (typeof OPTIONAL_FIELD_MODES)[number];

export interface ContactFormFields {
  phone: OptionalFieldMode;
  dates: OptionalFieldMode;
}

export const CONTACT_FIELDS = [
  "name",
  "email",
  "phone",
  "dates",
  "message",
] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

const phone = z
  .string()
  .trim()
  .max(30, "phoneInvalid")
  .refine((value) => validatePhone(value) === true, "phoneInvalid");

const dates = z.string().trim().max(80, "datesTooLong");

function asked(
  mode: OptionalFieldMode,
  field: z.ZodType<string, string>,
  requiredCode: string,
) {
  if (mode === "hidden") return z.string().transform(() => "");
  if (mode === "required")
    return z.string().trim().min(1, requiredCode).pipe(field);

  return field;
}

export const contactSchema = (fields: ContactFormFields) =>
  z.object({
    name: z.string().trim().min(1, "nameRequired").max(200, "nameTooLong"),
    email: z
      .string()
      .trim()
      .min(1, "emailRequired")
      .max(300, "emailInvalid")
      .pipe(z.email("emailInvalid")),
    phone: asked(fields.phone, phone, "phoneRequired"),
    dates: asked(fields.dates, dates, "datesRequired"),
    message: z
      .string()
      .trim()
      .min(1, "messageRequired")
      .max(5000, "messageTooLong"),
  });

export type ContactValues = z.infer<ReturnType<typeof contactSchema>>;
