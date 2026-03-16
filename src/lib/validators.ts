export function validatePhone(value: unknown): string | true {
  if (!value) return true; // let required handle this
  if (typeof value !== "string") return "Le numéro de téléphone doit être une chaîne de caractères";
  const cleaned = value.replace(/[\s\-().]/g, "");
  // Accept short emergency numbers (15, 17, 18, 112, etc.) and standard numbers
  if (!/^\+?[0-9]{2,15}$/.test(cleaned)) {
    return "Le numéro de téléphone n'est pas valide (ex: +33 6 12 34 56 78)";
  }
  return true;
}

export function validateUrl(value: unknown): string | true {
  if (!value) return true; // let required handle this
  if (typeof value !== "string") return "L'URL doit être une chaîne de caractères";
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      return "L'URL doit commencer par http:// ou https://";
    }
  } catch {
    return "L'URL n'est pas valide (ex: https://www.exemple.fr)";
  }
  return true;
}

export function validateDistance(value: unknown): string | true {
  if (!value) return true; // let required handle this
  if (typeof value !== "string") return "La distance doit être une chaîne de caractères";
  if (value.trim().length === 0) return "La distance ne peut pas être vide";
  return true;
}

export function validateSlug(value: unknown): string | true {
  if (!value) return true; // let required handle this
  if (typeof value !== "string") return "Le slug doit être une chaîne de caractères";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return "Le slug doit contenir uniquement des minuscules, chiffres et tirets (ex: le-gite)";
  }
  return true;
}

export function validateLucideIcon(value: unknown): string | true {
  if (!value) return true; // let required handle this
  if (typeof value !== "string") return "Le nom d'icône doit être une chaîne de caractères";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return "Le nom d'icône doit être en kebab-case (ex: trees, map-pin, home)";
  }
  return true;
}
