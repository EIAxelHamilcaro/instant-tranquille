import type {
  ContactField,
  ContactValues,
} from "@/components/contact/contact-schema";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  formError?: "captcha" | "server" | "tooMany";
  fieldErrors: Partial<Record<ContactField, string>>;
  values: Partial<ContactValues>;
}

export const INITIAL_CONTACT_STATE: ContactFormState = {
  status: "idle",
  fieldErrors: {},
  values: {},
};

export const HONEYPOT_FIELD = "contact_ref";
