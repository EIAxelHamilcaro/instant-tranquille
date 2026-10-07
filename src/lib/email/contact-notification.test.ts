import { describe, expect, test } from "bun:test";
import type { ContactValues } from "@/components/contact/contact-schema";
import { buildContactNotification } from "@/lib/email/contact-notification";
import { emailWorkerRequestSchema } from "@/lib/email/email-worker-contract";

const traveller: ContactValues = {
  name: "Jeanne Martin",
  email: "jeanne@example.org",
  phone: "06 12 34 56 78",
  dates: "du 12 au 15 août",
  message: "Bonjour,\nle gîte est-il libre ?",
};

describe("buildContactNotification", () => {
  test("given dates, when the notification is built, then the subject names the traveller and the stay", () => {
    const { subject, replyTo } = buildContactNotification(traveller);

    expect(subject).toBe(
      "Nouveau message de Jeanne Martin, séjour : du 12 au 15 août",
    );
    expect(replyTo).toBe("jeanne@example.org");
  });

  test("given no dates and no phone, when the notification is built, then the subject is short and the body says so", () => {
    const { subject, text } = buildContactNotification({
      ...traveller,
      dates: "",
      phone: "",
    });

    expect(subject).toBe("Nouveau message de Jeanne Martin");
    expect(text).toContain("Dates souhaitées : Non renseignées");
    expect(text).toContain("Téléphone : Non renseigné");
  });

  test("given line breaks in the name and dates, when the notification is built, then no header can be injected through the subject", () => {
    const notification = buildContactNotification({
      ...traveller,
      name: "Jeanne\r\nBcc: pirate@example.org",
      dates: "12 août\n\tX-Injected: 1 fin",
    });

    expect(notification.subject).toBe(
      "Nouveau message de Jeanne Bcc: pirate@example.org, séjour : 12 août X-Injected: 1 fin",
    );
    expect(emailWorkerRequestSchema.safeParse(notification).success).toBe(true);
  });

  test("given markup in every field, when the notification is built, then the HTML shows it as text and the plain version keeps it verbatim", () => {
    const message = `<script>alert("x")</script> & <img src=x onerror='y'>`;
    const { html, text } = buildContactNotification({
      ...traveller,
      name: "<b>Jeanne</b>",
      dates: '"><a href="https://evil.example">ici</a>',
      message,
    });

    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>Jeanne</b>");
    expect(html).not.toContain("<a href");
    expect(html).not.toContain("<img");
    expect(html).toContain(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &lt;img src=x onerror=&#39;y&#39;&gt;",
    );
    expect(text).toContain(message);
  });

  test("given a full message, when the notification is built, then every field reaches both bodies", () => {
    const { html, text } = buildContactNotification(traveller);

    for (const value of [
      "Jeanne Martin",
      "jeanne@example.org",
      "06 12 34 56 78",
      "du 12 au 15 août",
      "le gîte est-il libre ?",
    ]) {
      expect(text).toContain(value);
      expect(html).toContain(value);
    }
  });
});
