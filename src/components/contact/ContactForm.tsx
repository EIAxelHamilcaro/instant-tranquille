"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState, useRef } from "react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
  submitContactForm,
  type ContactFormState,
} from "@/app/(frontend)/[locale]/contact/actions";

const fieldErrorKeys: Record<string, string> = {
  name: "errorNameRequired",
  email: "errorEmailInvalid",
  subject: "errorSubjectRequired",
  message: "errorMessageRequired",
};

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, formAction, isPending] = useActionState<
    ContactFormState,
    FormData
  >(submitContactForm, { success: false });
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <SectionHeading title={t("formTitle")} />

          {state.success ? (
            <div role="status" aria-live="polite" className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
              <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-500" aria-hidden="true" />
              <p className="font-sans font-medium text-green-800">
                {t("success")}
              </p>
            </div>
          ) : (
            <form action={formAction} className="space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="mb-1.5 block font-sans">
                    {t("name")} *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    maxLength={200}
                    defaultValue={state.values?.name}
                    aria-required="true"
                    aria-invalid={!!state.fieldErrors?.name}
                    aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
                    className={cn("border-sand-300 bg-white", state.fieldErrors?.name && "border-red-400")}
                  />
                  {state.fieldErrors?.name && (
                    <p id="name-error" className="mt-1 text-xs text-red-600">{t(fieldErrorKeys.name)}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="mb-1.5 block font-sans">
                    {t("email")} *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    defaultValue={state.values?.email}
                    aria-required="true"
                    aria-invalid={!!state.fieldErrors?.email}
                    aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
                    className={cn("border-sand-300 bg-white", state.fieldErrors?.email && "border-red-400")}
                  />
                  {state.fieldErrors?.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-600">{t(fieldErrorKeys.email)}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone" className="mb-1.5 block font-sans">
                    {t("phone")}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={state.values?.phone}
                    className="border-sand-300 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="mb-1.5 block font-sans">
                    {t("subject")} *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    maxLength={300}
                    defaultValue={state.values?.subject}
                    aria-required="true"
                    aria-invalid={!!state.fieldErrors?.subject}
                    aria-describedby={state.fieldErrors?.subject ? "subject-error" : undefined}
                    className={cn("border-sand-300 bg-white", state.fieldErrors?.subject && "border-red-400")}
                  />
                  {state.fieldErrors?.subject && (
                    <p id="subject-error" className="mt-1 text-xs text-red-600">{t(fieldErrorKeys.subject)}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="mb-1.5 block font-sans">
                  {t("message")} *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  maxLength={5000}
                  aria-required="true"
                  rows={6}
                  defaultValue={state.values?.message}
                  aria-invalid={!!state.fieldErrors?.message}
                  aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
                  className={cn("border-sand-300 bg-white", state.fieldErrors?.message && "border-red-400")}
                />
                {state.fieldErrors?.message && (
                  <p id="message-error" className="mt-1 text-xs text-red-600">{t(fieldErrorKeys.message)}</p>
                )}
              </div>

              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onSuccess={setTurnstileToken}
                  onError={() => setTurnstileToken("")}
                  onExpire={() => setTurnstileToken("")}
                  options={{ theme: "light", size: "normal" }}
                />
              )}

              <input type="hidden" name="cf-turnstile-response" value={turnstileToken} />

              <div aria-live="polite" aria-atomic="true">
                {state.error && state.error !== "validation_error" && (
                  <div role="alert" className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {t("error")}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
                className="w-full bg-primary-500 text-white font-sans hover:bg-primary-600 sm:w-auto"
              >
                <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                {isPending ? t("sending") : t("send")}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
