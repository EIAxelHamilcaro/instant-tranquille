export type ContactRefusal = "messageLinks" | "messageSolicitation";

interface GuardedMessage {
  name: string;
  email: string;
  message: string;
}

const SITE_NAME = "instant-tranquille";
const SITE_DOMAIN = `${SITE_NAME}.com`;
const SOLICITATION_THRESHOLD = 2;

const LINK = /(?:https?:\/\/|www\.)([a-z0-9.-]+)/gi;
const TRUSTED_HOST =
  /(?:^|\.)(?:instant-tranquille\.com|airbnb\.[a-z.]+|booking\.com|abritel\.fr|gites-de-france\.com)$/;

const SOLICITATION_SIGNS = [
  /\bseo\b|\breferencement\b/,
  /\baudits?\b/,
  /\b(?:your|votre) (?:web ?site|site)\b/,
  /\brankings?\b|\bbacklinks?\b|\bsearch results\b|\bresultats de recherche\b|googlesearchindex/,
  /\bfollowers\b|\babonnes\b/,
  /\boutreach\b|\blead generation\b|\bprospects?\b|\bmarketing\b/,
  /\bour prices\b|\bnos tarifs\b|\bpricing\b|\$ ?\d|\busd\b/,
  /\bproposal\b|\bour services\b|\bnos services\b|\bwe help\b|\bnous aidons\b/,
  /instant-tranquille\.com/,
];

function plain(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");
}

function hasForeignLink(text: string) {
  return [...text.matchAll(LINK)].some(
    ([, host = ""]) => !TRUSTED_HOST.test(host.replace(/\.+$/, "")),
  );
}

function mimicsSite(email: string) {
  const domain = email.split("@").at(-1) ?? "";

  return domain.includes(SITE_NAME) && domain !== SITE_DOMAIN;
}

export function contactRefusal({
  name,
  email,
  message,
}: GuardedMessage): ContactRefusal | null {
  const text = plain(`${name} ${message}`);
  if (hasForeignLink(text)) return "messageLinks";

  const signs = SOLICITATION_SIGNS.filter((sign) => sign.test(text)).length;
  const isSolicitation =
    signs >= SOLICITATION_THRESHOLD || mimicsSite(plain(email));

  return isSolicitation ? "messageSolicitation" : null;
}
