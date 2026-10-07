"use client";

import { Button, useFormFields } from "@payloadcms/ui";

const text = (value: unknown) => (typeof value === "string" ? value : "");

export default function MessageActions() {
  const email = useFormFields(([fields]) => text(fields.email?.value));
  const phone = useFormFields(([fields]) => text(fields.phone?.value));
  const subject = useFormFields(([fields]) => text(fields.subject?.value));
  const name = useFormFields(([fields]) => text(fields.name?.value));
  if (!email) return null;

  const reply = `mailto:${email}?subject=${encodeURIComponent(`Re : ${subject}`)}`;
  const dial = phone.replace(/[^\d+]/g, "");

  return (
    <div className="lit-reponse">
      <Button el="anchor" url={reply} buttonStyle="primary" size="large">
        Répondre par e-mail
      </Button>
      {dial && (
        <Button
          el="anchor"
          url={`tel:${dial}`}
          buttonStyle="secondary"
          size="large"
        >
          Appeler {name.split(" ")[0]}
        </Button>
      )}
      <p className="lit-aide">
        La réponse part de votre boîte e-mail. Cochez ensuite « Message lu »,
        puis enregistrez : le message quitte la liste des choses à faire.
      </p>
    </div>
  );
}
