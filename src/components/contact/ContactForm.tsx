"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState, useRef } from "react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
  submitContactForm,
  type ContactFormState,
} from "@/app/(frontend)/[locale]/contact/actions";

export function ContactForm() {
  const t = useTranslations("contact");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [state, formAction, isPending] = useActionState<
    ContactFormState,
    FormData
  >(submitContactForm, { success: false });

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
                  <label
                    htmlFor="name"
                    className="mb-1.5 block font-sans text-sm font-medium"
                  >
                    {t("name")} *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    required
                    aria-required="true"
                    className="border-sand-300 bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block font-sans text-sm font-medium"
                  >
                    {t("email")} *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    aria-required="true"
                    className="border-sand-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block font-sans text-sm font-medium"
                  >
                    {t("phone")}
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="border-sand-300 bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block font-sans text-sm font-medium"
                  >
                    {t("subject")} *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    aria-required="true"
                    className="border-sand-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block font-sans text-sm font-medium"
                >
                  {t("message")} *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  aria-required="true"
                  rows={6}
                  className="border-sand-300 bg-white"
                />
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
                {state.error && (
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
