import { z } from "zod";
import { validatePhone } from "@/lib/validators";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "nameRequired").max(200, "nameTooLong"),
  email: z
    .string()
    .trim()
    .min(1, "emailRequired")
    .max(300, "emailInvalid")
    .pipe(z.email("emailInvalid")),
  phone: z
    .string()
    .trim()
    .max(30, "phoneInvalid")
    .refine((value) => validatePhone(value) === true, "phoneInvalid"),
  dates: z.string().trim().max(80, "datesTooLong"),
  message: z
    .string()
    .trim()
    .min(1, "messageRequired")
    .max(5000, "messageTooLong"),
});

export type ContactValues = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactValues;

export const CONTACT_FIELDS = Object.keys(
  contactSchema.shape,
) as ContactField[];
