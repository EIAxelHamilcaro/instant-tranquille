"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState, useRef } from "react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle, AlertCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
  submitTestimonial,
  type TestimonialFormState,
} from "@/app/(frontend)/[locale]/actions";

function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "h-7 w-7 transition-colors",
              star <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-sand-300",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function TestimonialForm() {
  const t = useTranslations("home");
  const [rating, setRating] = useState(5);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [state, formAction, isPending] = useActionState<
    TestimonialFormState,
    FormData
  >(submitTestimonial, { success: false });

  return (
    <section className="bg-sand-100 py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            title={t("testimonialFormTitle")}
            subtitle={t("testimonialFormSubtitle")}
          />

          {state.success ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
              <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-500" />
              <p className="font-sans font-medium text-green-800">
                {t("testimonialSuccess")}
              </p>
            </div>
          ) : (
            <form action={formAction} className="space-y-5">
              <input type="hidden" name="rating" value={rating} />
              <input type="hidden" name="cf-turnstile-response" value={turnstileToken} />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="guestName"
                    className="mb-1.5 block font-sans text-sm font-medium"
                  >
                    {t("testimonialName")} *
                  </label>
                  <Input
                    id="guestName"
                    name="guestName"
                    required
                    className="border-sand-300 bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="guestOrigin"
                    className="mb-1.5 block font-sans text-sm font-medium"
                  >
                    {t("testimonialOrigin")}
                  </label>
                  <Input
                    id="guestOrigin"
                    name="guestOrigin"
                    className="border-sand-300 bg-white"
                    placeholder="Paris, France"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-sans text-sm font-medium">
                    {t("testimonialRating")} *
                  </label>
                  <StarInput value={rating} onChange={setRating} />
                </div>
                <div>
                  <label
                    htmlFor="stayDate"
                    className="mb-1.5 block font-sans text-sm font-medium"
                  >
                    {t("testimonialStayDate")}
                  </label>
                  <Input
                    id="stayDate"
                    name="stayDate"
                    type="date"
                    className="border-sand-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="text"
                  className="mb-1.5 block font-sans text-sm font-medium"
                >
                  {t("testimonialText")} *
                </label>
                <Textarea
                  id="text"
                  name="text"
                  required
                  minLength={10}
                  rows={4}
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

              {state.error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {t("testimonialError")}
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
                className="w-full bg-primary-500 font-sans hover:bg-primary-600 sm:w-auto"
              >
                <Send className="mr-2 h-4 w-4" />
                {isPending
                  ? t("testimonialSubmitting")
                  : t("testimonialSubmit")}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
