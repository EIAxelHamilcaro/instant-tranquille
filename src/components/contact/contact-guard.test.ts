import { describe, expect, test } from "bun:test";
import { contactRefusal } from "@/components/contact/contact-guard";

const from = (message: string, email = "someone@gmail.com", name = "Lisa") =>
  contactRefusal({ name, email, message });

describe("contactRefusal", () => {
  test.each([
    "Bonjour, j'ai vu votre site. Le gîte est-il libre du 12 au 15 juillet pour 4 personnes ? Quels sont vos tarifs ?",
    "Hello, we found you on Instagram. Is the cottage free in August? We would come with our dog.",
    "Bonjour, voici l'annonce que j'ai vue : https://www.airbnb.fr/rooms/123456. Est-ce bien la même maison ?",
    "Nous venons pour le Generali Open de France à Lamotte-Beuvron, y a-t-il un pré pour deux chevaux ?",
  ])("lets a traveller's question through: %s", (message) => {
    expect(from(message)).toBeNull();
  });

  test.each([
    "Hello, I noticed some technical SEO issues on your website that might be affecting its performance on Google. I've documented them in a short audit.",
    "Hi, I was just looking at instant-tranquille.com and wanted to ask: are you looking to scale your Instagram presence? We help brands like yours add 300+ targeted Instagram followers using manual outreach and ads.",
    "Hi, I just visited instant-tranquille.com and wondered if you'd ever thought about having an engaging video? Our prices start from just $195 (USD).",
    "Hello instant-tranquille.com, I noticed a few design-related issues on your website. I can also prepare a detailed audit report, along with a proposal and pricing to optimize its ranking.",
    "Bonjour, nous aidons les gîtes à améliorer le référencement de votre site internet. Souhaitez-vous un audit gratuit ?",
  ])("refuses a sales pitch: %s", (message) => {
    expect(from(message)).toBe("messageSolicitation");
  });

  test("refuses a message carrying a link to an unknown site", () => {
    const pitch =
      "Hi, our videos can generate impressive results. Unsubscribe: https://unsubscribe.video/unsubscribe.php?d=x";

    expect(from(pitch)).toBe("messageLinks");
  });

  test("refuses a sender whose domain imitates the site's", () => {
    const refusal = from(
      "Hello, list your cottage to show up in web search.",
      "judi@search-instant-tranquille.com",
    );

    expect(refusal).toBe("messageSolicitation");
  });
});
