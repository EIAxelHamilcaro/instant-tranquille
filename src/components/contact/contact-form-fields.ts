import type { ContactFormFields } from "@/components/contact/contact-schema";
import type { ContactPage } from "@/payload-types";

export const contactFormFields = (page: ContactPage): ContactFormFields => ({
  phone: page.form?.phoneField ?? "optional",
  dates: page.form?.datesField ?? "optional",
});
