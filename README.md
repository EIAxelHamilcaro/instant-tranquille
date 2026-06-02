# L'Instant Tranquille

Site vitrine d'un gîte en Sologne (Romorantin-Lanthenay, Loir-et-Cher) : présentation du logement,
galerie photos, tarifs, contact, et livret d'accueil privé pour les voyageurs. Pensé pour le
**référencement local** et une **gestion autonome** du contenu via le CMS.

## Stack

Next.js 16 (App Router) · React 19 · Payload CMS 3 (PostgreSQL/Neon, Vercel Blob) · next-intl (FR/EN) ·
Tailwind CSS v4 · shadcn/ui · Biome · TypeScript · Zod.

## Démarrage

```bash
pnpm install
cp .env.example .env   # renseigner DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SITE_URL, BLOB_READ_WRITE_TOKEN
pnpm dev               # http://localhost:3000  (admin : /admin)
pnpm seed              # (optionnel) données d'exemple
```

> Le schéma de base est synchronisé par Payload au démarrage en mode dev. Après l'ajout d'un champ,
> relancer `pnpm dev` avant un `pnpm build` de production.

## Scripts

| Commande | Rôle |
|----------|------|
| `pnpm dev` | Serveur de développement |
| `pnpm build` / `pnpm start` | Build / serveur de production |
| `pnpm lint` / `pnpm format` | Biome (lint / format) |
| `pnpm seed` | Peuple la base de données |

## Structure

```
src/
  app/(frontend)/[locale]/   pages publiques (home, le-gite, tarifs-reservation, contact, livret)
  app/(payload)/admin/       back-office Payload
  collections/ globals/      modèle de contenu (CMS)
  components/                sections vitrine, layout, shared, ui (shadcn), live-preview
  lib/                       queries, seo, jsonld, access, validators, fonts
  i18n/                      routing + messages fr/en  (proxy.ts = middleware next-intl)
  styles/globals.css         design tokens (palette champêtre, fonts)
docs/REFONTE.md              état de la refonte, reste à faire, bloquants
```

## Déploiement

Vercel (ou équivalent). Variables requises : `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`
(domaine réel), `BLOB_READ_WRITE_TOKEN`. Pour activer les notifications de contact et l'anti-spam :
`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

Détails et feuille de route : voir [`docs/REFONTE.md`](docs/REFONTE.md) et [`CLAUDE.md`](CLAUDE.md).
