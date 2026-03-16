"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState, useRef } from "react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  starLabel,
  starsLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  starLabel: string;
  starsLabel: string;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1" role="group" aria-labelledby="rating-label">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${star} ${star === 1 ? starLabel : starsLabel}`}
          className="h-8 w-8 p-0.5 hover:scale-110"
        >
          <Star
            className={cn(
              "h-7 w-7 transition-colors",
              star <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-sand-300",
            )}
          />
        </Button>
      ))}
    </div>
  );
}

export function TestimonialForm() {
  const t = useTranslations("home");
  const [state, formAction, isPending] = useActionState<
    TestimonialFormState,
    FormData
  >(submitTestimonial, { success: false });
  const [rating, setRating] = useState(5);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  return (
    <section className="bg-sand-100 py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            title={t("testimonialFormTitle")}
            subtitle={t("testimonialFormSubtitle")}
          />

          {state.success ? (
            <div
              role="status"
              aria-live="polite"
              className="rounded-lg border border-green-200 bg-green-50 p-6 text-center"
            >
              <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-500" aria-hidden="true" />
              <p className="font-sans font-medium text-green-800">
                {t("testimonialSuccess")}
              </p>
            </div>
          ) : (
            <form action={formAction} className="space-y-5" noValidate>
              <input type="hidden" name="rating" value={rating} />
              <input type="hidden" name="cf-turnstile-response" value={turnstileToken} />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="guestName" className="mb-1.5 block font-sans">
                    {t("testimonialName")} *
                  </Label>
                  <Input
                    id="guestName"
                    name="guestName"
                    required
                    maxLength={200}
                    defaultValue={state.values?.guestName}
                    aria-required="true"
                    aria-invalid={!!state.fieldErrors?.guestName}
                    aria-describedby={state.fieldErrors?.guestName ? "guestName-error" : undefined}
                    className={cn("border-sand-300 bg-white", state.fieldErrors?.guestName && "border-red-400")}
                  />
                  {state.fieldErrors?.guestName && (
                    <p id="guestName-error" className="mt-1 text-xs text-red-600">{t("errorNameRequired")}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="guestOrigin" className="mb-1.5 block font-sans">
                    {t("testimonialOrigin")}
                  </Label>
                  <Input
                    id="guestOrigin"
                    name="guestOrigin"
                    defaultValue={state.values?.guestOrigin}
                    className="border-sand-300 bg-white"
                    placeholder="Paris, France"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label id="rating-label" className="mb-1.5 block font-sans">
                    {t("testimonialRating")} *
                  </Label>
                  <StarInput value={rating} onChange={setRating} starLabel={t("star")} starsLabel={t("stars")} />
                </div>
                <div>
                  <Label htmlFor="stayDate" className="mb-1.5 block font-sans">
                    {t("testimonialStayDate")} *
                  </Label>
                  <Input
                    id="stayDate"
                    name="stayDate"
                    type="date"
                    required
                    defaultValue={state.values?.stayDate}
                    aria-required="true"
                    aria-invalid={!!state.fieldErrors?.stayDate}
                    aria-describedby={state.fieldErrors?.stayDate ? "stayDate-error" : undefined}
                    className={cn("border-sand-300 bg-white", state.fieldErrors?.stayDate && "border-red-400")}
                  />
                  {state.fieldErrors?.stayDate && (
                    <p id="stayDate-error" className="mt-1 text-xs text-red-600">{t("errorDateRequired")}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="text" className="mb-1.5 block font-sans">
                  {t("testimonialText")} *
                </Label>
                <Textarea
                  id="text"
                  name="text"
                  required
                  aria-required="true"
                  minLength={10}
                  maxLength={2000}
                  rows={4}
                  defaultValue={state.values?.text}
                  aria-invalid={!!state.fieldErrors?.text}
                  aria-describedby={state.fieldErrors?.text ? "text-error" : undefined}
                  className={cn("border-sand-300 bg-white", state.fieldErrors?.text && "border-red-400")}
                />
                {state.fieldErrors?.text && (
                  <p id="text-error" className="mt-1 text-xs text-red-600">{t("errorTextTooShort")}</p>
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

              <div aria-live="polite" aria-atomic="true">
                {state.error && state.error !== "validation_error" && (
                  <div role="alert" className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {t("testimonialError")}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
                className="w-full bg-primary-500 text-white font-sans hover:bg-primary-600 sm:w-auto"
              >
                <Send className="mr-2 h-4 w-4" aria-hidden="true" />
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
