import type { ContactValues } from "@/components/contact/contact-schema";
import type { EmailWorkerRequest } from "@/lib/email/email-worker-contract";

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const LABEL_STYLE =
  "padding:6px 16px 6px 0;color:#5c665f;vertical-align:top;white-space:nowrap";
const VALUE_STYLE = "padding:6px 0;vertical-align:top";

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]!);
}

export function headerSafe(value: string) {
  return value
    .replace(/[\p{Cc}\p{Zl}\p{Zp}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function subjectOf({ name, dates }: ContactValues) {
  const traveller = headerSafe(name);
  const stay = headerSafe(dates);

  return stay
    ? `Nouveau message de ${traveller}, séjour : ${stay}`
    : `Nouveau message de ${traveller}`;
}

function rowsOf({ name, email, phone, dates }: ContactValues) {
  return [
    { label: "Nom", value: name },
    { label: "E-mail", value: email },
    { label: "Téléphone", value: phone || "Non renseigné" },
    { label: "Dates souhaitées", value: dates || "Non renseignées" },
  ];
}

function textOf(values: ContactValues) {
  const fields = rowsOf(values).map(
    ({ label, value }) => `${label} : ${value}`,
  );

  return [
    "Un voyageur vient d'écrire depuis le site de L'Instant Tranquille.",
    "",
    ...fields,
    "",
    "Message :",
    values.message,
    "",
    `Pour lui répondre, répondez simplement à cet e-mail : votre réponse partira vers ${values.email}.`,
    "Le message est aussi enregistré dans l'espace de gestion du site.",
  ].join("\n");
}

function htmlOf(values: ContactValues) {
  const rows = rowsOf(values)
    .map(
      ({ label, value }) =>
        `<tr><td style="${LABEL_STYLE}">${escapeHtml(label)}</td><td style="${VALUE_STYLE}">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return [
    '<div style="font-family:Georgia,serif;font-size:16px;line-height:1.5;color:#1f2a24;max-width:640px">',
    "<p>Un voyageur vient d'écrire depuis le site de L'Instant Tranquille.</p>",
    `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows}</table>`,
    `<p style="margin:24px 0 0;padding:16px;background:#f3f1ea;border-left:3px solid #6b7f6a;white-space:pre-wrap">${escapeHtml(values.message)}</p>`,
    `<p style="margin:24px 0 0;color:#5c665f;font-size:14px">Pour lui répondre, répondez simplement à cet e-mail : votre réponse partira vers ${escapeHtml(values.email)}.<br>Le message est aussi enregistré dans l'espace de gestion du site.</p>`,
    "</div>",
  ].join("");
}

export function buildContactNotification(
  values: ContactValues,
): EmailWorkerRequest {
  return {
    replyTo: headerSafe(values.email),
    subject: subjectOf(values),
    text: textOf(values),
    html: htmlOf(values),
  };
}
