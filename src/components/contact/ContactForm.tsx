"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import {
  submitContactForm,
  type ContactFormState,
} from "@/app/(frontend)/[locale]/contact/actions";

export function ContactForm() {
  const t = useTranslations("contact");

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
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
              <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-500" />
              <p className="font-sans font-medium text-green-800">
                {t("success")}
              </p>
            </div>
          ) : (
            <form action={formAction} className="space-y-5">
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
                  rows={6}
                  className="border-sand-300 bg-white"
                />
              </div>

              {state.error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {t("error")}
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary-500 text-white font-sans hover:bg-primary-600 sm:w-auto"
              >
                <Send className="mr-2 h-4 w-4" />
                {isPending ? t("sending") : t("send")}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
