import type {
  NumberFieldSingleValidation,
  TextareaFieldValidation,
  TextFieldValidation,
} from "payload";
import { number, text, textarea } from "payload/shared";

export function validatePhone(value: unknown): string | true {
  if (!value) return true;
  if (typeof value !== "string")
    return "Écrivez le numéro avec des chiffres, par exemple 06 12 34 56 78.";

  const cleaned = value.replace(/[\s\-().]/g, "");
  if (!/^\+?[0-9]{2,15}$/.test(cleaned)) {
    return "Ce numéro n'est pas reconnu. Écrivez-le comme 06 12 34 56 78 ou +33 6 12 34 56 78.";
  }

  return true;
}

export function validateUrl(value: unknown): string | true {
  if (!value) return true;
  if (typeof value !== "string")
    return "Collez ici l'adresse complète de la page, par exemple https://www.exemple.fr.";

  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      return "L'adresse doit commencer par https://. Copiez-la depuis la barre d'adresse de votre navigateur.";
    }
  } catch {
    return "Cette adresse n'est pas complète. Copiez-la depuis la barre d'adresse de votre navigateur, par exemple https://www.exemple.fr.";
  }

  return true;
}

const LOCAL_HOSTS = ["localhost", "127.0.0.1"];

export function validateCalendarUrl(value: unknown): string | true {
  if (!value) return true;

  const url =
    typeof value === "string" && URL.canParse(value) ? new URL(value) : null;
  const isLocalTest =
    process.env.NODE_ENV !== "production" &&
    url?.protocol === "http:" &&
    LOCAL_HOSTS.includes(url.hostname);
  if (url?.protocol === "https:" || isLocalTest) return true;

  return "Collez le lien complet du calendrier, qui commence par https://.";
}

export const computedNumber: NumberFieldSingleValidation = (value, options) =>
  value === null || value === undefined
    ? true
    : number(value, { ...options, required: false });

export function validateSlug(value: unknown): string | true {
  if (!value) return true;
  if (typeof value !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return "N'utilisez que des minuscules sans accent, des chiffres et des tirets, par exemple zooparc-de-beauval.";
  }

  return true;
}

interface PropertyFacts {
  surface?: number | null;
  maxGuests?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
}

type FactKey = keyof PropertyFacts;

interface FactRule {
  key: FactKey;
  pattern: RegExp;
  isWrong: (written: number, fact: number) => boolean;
  message: (written: number, fact: number) => string;
}

const differs = (written: number, fact: number) => written !== fact;

const FACT_RULES: FactRule[] = [
  {
    key: "surface",
    pattern: /(\d+)\s*m(?:²|2)(?![\wÀ-ÿ])/gi,
    isWrong: differs,
    message: (written, fact) =>
      `Le texte annonce ${written} m², alors que la maison fait ${fact} m². Corrigez le chiffre.`,
  },
  {
    key: "bedrooms",
    pattern: /(\d+)\s*(?:chambres?|bedrooms?)/gi,
    isWrong: differs,
    message: (written, fact) =>
      `Le texte annonce ${written} chambres, alors que la maison en compte ${fact}. Corrigez le chiffre.`,
  },
  {
    key: "bathrooms",
    pattern: /(\d+)\s*(?:salles? de bains?|bathrooms?)/gi,
    isWrong: differs,
    message: (written, fact) =>
      `Le texte annonce ${written} salles de bain, alors que la maison en compte ${fact}. Corrigez le chiffre.`,
  },
  {
    key: "maxGuests",
    pattern: /(\d+)\s*(?:personnes|voyageurs|couchages|guests|people)/gi,
    isWrong: (written, fact) => written > fact,
    message: (written, fact) =>
      `Le texte annonce ${written} personnes, alors que la maison en accueille ${fact} au plus. Corrigez le chiffre.`,
  },
];

export function factMistake(value: string, facts: PropertyFacts) {
  for (const { key, pattern, isWrong, message } of FACT_RULES) {
    const fact = facts[key];
    if (typeof fact !== "number") continue;

    for (const match of value.matchAll(pattern)) {
      const written = Number(match[1]);
      if (isWrong(written, fact)) return message(written, fact);
    }
  }

  return null;
}

const FACTS_TTL_MS = 5000;

let cachedFacts: { at: number; facts: Promise<PropertyFacts> } | null = null;

async function factsMatch(
  value: unknown,
  req: Parameters<TextFieldValidation>[1]["req"],
): Promise<string | true> {
  if (typeof value !== "string" || !value) return true;

  if (!cachedFacts || Date.now() - cachedFacts.at > FACTS_TTL_MS) {
    cachedFacts = {
      at: Date.now(),
      facts: req.payload
        .findGlobal({ slug: "site-settings", depth: 0, draft: true })
        .then((settings) => settings.propertyDetails ?? {}),
    };
  }

  return factMistake(value, await cachedFacts.facts) ?? true;
}

export const factCheckedText: TextFieldValidation = async (value, options) => {
  const base = await text(value, options);

  return base === true ? factsMatch(value, options.req) : base;
};

export const factCheckedTextarea: TextareaFieldValidation = async (
  value,
  options,
) => {
  const base = await textarea(value, options);

  return base === true ? factsMatch(value, options.req) : base;
};
