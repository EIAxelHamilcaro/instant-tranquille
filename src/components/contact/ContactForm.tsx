"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState } from "react";
import { sendContactMessage } from "@/app/(frontend)/[locale]/contact/actions";
import {
  HONEYPOT_FIELD,
  INITIAL_CONTACT_STATE,
} from "@/components/contact/contact-form-state";
import type {
  ContactField,
  ContactFormFields,
  OptionalFieldMode,
} from "@/components/contact/contact-schema";
import { Emblem } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface FieldProps extends React.ComponentProps<typeof Input> {
  name: ContactField;
  label: string;
  hint?: string;
  error?: string;
}

function Field({ name, label, hint, error, className, ...input }: FieldProps) {
  const id = `contact-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("champ", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        {...input}
      />
      {hint && (
        <p id={`${id}-hint`} className="indice">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface ContactFormProps {
  fields: ContactFormFields;
  datesHint?: string | null;
  sentTitle?: string | null;
  sentText?: string | null;
}

function sentenceList(labels: string[], locale: string) {
  const list = new Intl.ListFormat(locale, { type: "conjunction" })
    .format(labels)
    .toLocaleLowerCase(locale);

  return list.replace(/^./u, (first) => first.toLocaleUpperCase(locale));
}

export function ContactForm({
  fields,
  datesHint,
  sentTitle,
  sentText,
}: ContactFormProps) {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    INITIAL_CONTACT_STATE,
  );
  const form = useRef<HTMLFormElement>(null);
  const turnstile = useRef<TurnstileInstance>(null);
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    if (state.status !== "error") return;

    turnstile.current?.reset();
    form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <p role="status" className="confirmation">
        <Emblem
          className="heron-vif heron-confirmation"
          scene="still"
          play="peche"
        />
        <strong>{sentTitle || t("successTitle")}</strong>
        {sentText || t("successText")}
      </p>
    );
  }

  const errorOf = (field: ContactField) => {
    const code = state.fieldErrors[field];

    return code ? t(`errors.${code}`) : undefined;
  };
  const messageError = errorOf("message");
  const labelOf = (field: "phone" | "dates", mode: OptionalFieldMode) =>
    mode === "required" ? t(field) : t("optional", { label: t(field) });
  const requiredLabels = [
    t("name"),
    t("email"),
    ...(["phone", "dates"] as const)
      .filter((field) => fields[field] === "required")
      .map((field) => t(field)),
    t("message"),
  ];
  const isLoneField =
    (fields.phone === "hidden") !== (fields.dates === "hidden");

  return (
    <form
      ref={form}
      action={formAction}
      noValidate
      className="formulaire"
      onFocusCapture={() => setIsArmed(true)}
    >
      <p className="indice">
        {t("requiredNote", { fields: sentenceList(requiredLabels, locale) })}
      </p>
      <Field
        name="name"
        type="text"
        label={t("name")}
        autoComplete="name"
        required
        defaultValue={state.values.name}
        error={errorOf("name")}
      />
      <Field
        name="email"
        type="email"
        label={t("email")}
        autoComplete="email"
        inputMode="email"
        spellCheck={false}
        autoCapitalize="none"
        required
        defaultValue={state.values.email}
        error={errorOf("email")}
      />
      {fields.phone !== "hidden" && (
        <Field
          name="phone"
          type="tel"
          label={labelOf("phone", fields.phone)}
          autoComplete="tel"
          required={fields.phone === "required"}
          className={isLoneField ? "large" : undefined}
          defaultValue={state.values.phone}
          error={errorOf("phone")}
        />
      )}
      {fields.dates !== "hidden" && (
        <Field
          name="dates"
          type="text"
          label={labelOf("dates", fields.dates)}
          hint={datesHint || t("datesHint")}
          autoComplete="off"
          required={fields.dates === "required"}
          className={isLoneField ? "large" : undefined}
          defaultValue={state.values.dates}
          error={errorOf("dates")}
        />
      )}

      <div className="champ large">
        <Label htmlFor="contact-message">{t("message")}</Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          autoComplete="off"
          defaultValue={state.values.message}
          aria-invalid={messageError ? true : undefined}
          aria-describedby={messageError ? "contact-message-error" : undefined}
        />
        {messageError && (
          <p id="contact-message-error" role="alert">
            {messageError}
          </p>
        )}
      </div>

      <div className="piege" aria-hidden="true">
        <Input
          name={HONEYPOT_FIELD}
          type="text"
          aria-label={t("honeypot")}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {TURNSTILE_SITE_KEY && (
        <div className="verification">
          {isArmed && (
            <Turnstile
              ref={turnstile}
              siteKey={TURNSTILE_SITE_KEY}
              options={{ language: locale, theme: "light" }}
            />
          )}
        </div>
      )}

      {state.formError && (
        <p role="alert" className="erreur-formulaire">
          {t(`errors.${state.formError}`)}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="justify-self-start"
      >
        {pending ? t("sending") : t("submit")}
      </Button>

      <p className="indice">
        {t.rich("privacyNote", {
          privacy: (chunks) => (
            <Link href="/confidentialite" className="lien">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </form>
  );
}
