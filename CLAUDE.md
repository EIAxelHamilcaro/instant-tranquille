# CLAUDE.md — L'Instant Tranquille

Site vitrine d'un gîte en Sologne (Romorantin-Lanthenay, Loir-et-Cher). Objectif produit :
vitrine simple et attractive, CMS gérable par une non-technicienne, **référencement local fort**.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Payload CMS 3.79** (`@payloadcms/db-postgres` → Neon, storage `vercel-blob`, `plugin-seo`,
  richtext `lexical`, live-preview)
- **next-intl 4.8** (FR par défaut sans préfixe d'URL, `/en/*` pour l'anglais)
- **Tailwind CSS v4** + **shadcn/ui** (style new-york, base stone) + **radix-ui**
- **Biome** (lint + format), **TypeScript** strict, **Zod**
- Carte : **Leaflet** / react-leaflet · Galeries : **embla-carousel** · Anti-spam : **Turnstile**

## Commandes

```bash
pnpm dev          # dev (Payload pousse le schéma DB automatiquement en dev)
pnpm build        # build prod
pnpm lint         # biome check
pnpm seed         # peuple la base (scripts/seed.ts)
```

> **Gotcha pnpm v11** : un pré-check de build scripts (`ERR_PNPM_IGNORED_BUILDS`) peut faire
> échouer `pnpm exec`/`pnpm build`. Contournement : lancer les binaires directement
> (`node_modules/.bin/next build`, `node_modules/.bin/tsc --noEmit`, `node_modules/.bin/biome check`)
> ou exécuter `pnpm approve-builds` une fois.

> **Schéma DB (workflow push)** : pas de dossier `migrations/`. Payload synchronise le schéma à
> l'init **en dev** (`postgresAdapter` push). Après tout ajout/retrait de champ : lancer `pnpm dev`
> une fois (ou un script d'init Payload) AVANT `pnpm build`, sinon le build prod casse au prerender
> (colonne manquante). Migrations formelles recommandées pour la prod.

## Architecture

- `src/payload.config.ts` — config Payload (collections, globals, plugins, localization fr/en).
- `src/collections/` — Users, Media, **Pages** (conditionnelle par slug : home/le-gite/tarifs/contact),
  Testimonials, Amenities, LocalRecommendations, OnboardingGuides (livret d'accueil), ContactMessages.
- `src/globals/` — SiteSettings (NAP, propriété, réseaux, FAQ, SEO défaut), Header, Footer, PricingConfig.
- `src/app/(frontend)/[locale]/` — pages publiques : `/` (home), `/le-gite`, `/tarifs-reservation`,
  `/contact`, `/livret-accueil/[token]` (noindex). `(payload)/admin` = back-office.
- `src/components/` — `home/ cottage/ rates/ contact/` (sections vitrine), `layout/`, `shared/`,
  `live-preview/` (wrappers draft mode), `ui/` (shadcn), `payload/` (branding admin).
- `src/lib/` — `queries.ts` (accès Payload + `unstable_cache`), `seo.ts` (metadata),
  `jsonld.ts` (schema.org), `access.ts`, `revalidate.ts`, `validators.ts`, `fonts.ts`.
- `src/i18n/` — `routing.ts` (pathnames traduits), `messages/{fr,en}.json`. **`proxy.ts` = middleware
  next-intl de Next 16** (`createMiddleware` + matcher) — NE PAS supprimer, il porte le routing i18n.

## SEO (priorité produit)

- **JSON-LD** (`src/lib/jsonld.ts`) : `LodgingBusiness` (home + contact, `@id` partagé pour
  consolidation d'entité), `VacationRental` (le-gite, relié via `containedInPlace`), `FAQPage`,
  `BreadcrumbList`, Offers/`PriceSpecification` (tarifs). NAP via SiteSettings (ville/CP/géo).
- `generateMetadata` par page via `src/lib/seo.ts` (+ `@payloadcms/plugin-seo` sur Pages).
- `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `icon.svg`, `manifest.ts` à la racine `src/app/`.
- `h1` unique par page (sr-only géolocalisés sur contact/tarifs via clés i18n `*.h1`).

## Conventions

- **Contenu FR**, accents complets (jamais d'ASCII équivalent). Pas de commentaires superflus
  dans le code (le diff parle).
- Props de composant = `interface` ; `type` réservé aux unions/`z.infer`. Pas de barrel `index.ts`.
  Éviter les `<div>` wrappers inutiles (Fragment si pas de layout/sémantique).
- `void navigate(...)` dans les callbacks de mutation (pas `await`).
- **Pas de DDD ici** : billing/SEO/feature-gating restent en infra pragmatique (config typée + guards).
  Le « métier » de ce repo est éditorial/vitrine, pas un domaine complexe.
- Palette de marque (globals.css) : `primary` vert `#4a7c59`, `earth` brun `#b8864f`, `sand` beige.
  Fonts : Playfair Display (titres), Lora (corps), Inter (UI). Rester dans la palette (pas de
  couleurs Tailwind brutes type amber/rose). Thème mono (dark-mode OS neutralisé via `@custom-variant`).

## Variables d'environnement

`DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL` (vrai domaine en prod), `BLOB_READ_WRITE_TOKEN`.
À ajouter pour activer : `RESEND_API_KEY` (notifications de contact — sinon email en console),
`TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (anti-spam formulaire).

## État & feuille de route

Voir **`docs/REFONTE.md`** : ce qui est fait (SEO local, correctifs de thème, cohérence palette),
le reste à faire (polish design éditorial, split CMS `Pages` → pages dédiées) et les bloquants
côté client (photos variées, secrets, NAP réel, décision bilingue FR/EN).
