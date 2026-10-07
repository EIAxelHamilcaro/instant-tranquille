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
  "arrival",
  "departure",
  "message",
] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

const STAY_TIME_ZONE = "Europe/Paris";

export function stayToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: STAY_TIME_ZONE,
  }).format(now);
}

const phone = z
  .string()
  .trim()
  .max(30, "phoneInvalid")
  .refine((value) => validatePhone(value) === true, "phoneInvalid");

const isDayOrEmpty = (value: string) =>
  value === "" || z.iso.date().safeParse(value).success;

const day = z.string().trim().refine(isDayOrEmpty, "dateInvalid");

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

export const contactSchema = (fields: ContactFormFields, today = stayToday()) =>
  z
    .object({
      name: z.string().trim().min(1, "nameRequired").max(200, "nameTooLong"),
      email: z
        .string()
        .trim()
        .min(1, "emailRequired")
        .max(300, "emailInvalid")
        .pipe(z.email("emailInvalid")),
      phone: asked(fields.phone, phone, "phoneRequired"),
      arrival: asked(fields.dates, day, "arrivalRequired"),
      departure: asked(fields.dates, day, "departureRequired"),
      message: z
        .string()
        .trim()
        .min(1, "messageRequired")
        .max(5000, "messageTooLong"),
    })
    .superRefine(({ arrival, departure }, context) => {
      const refuse = (field: ContactField, message: string) =>
        context.addIssue({ code: "custom", path: [field], message });

      if (!isDayOrEmpty(arrival) || !isDayOrEmpty(departure)) return;
      if (!arrival && !departure) return;
      if (!arrival) return refuse("arrival", "arrivalRequired");
      if (arrival < today) return refuse("arrival", "arrivalPast");
      if (!departure) return refuse("departure", "departureRequired");
      if (departure <= arrival) refuse("departure", "departureBeforeArrival");
    });

export type ContactValues = z.infer<ReturnType<typeof contactSchema>>;

export type ContactEnquiry = Omit<ContactValues, "arrival" | "departure"> & {
  dates: string;
};
