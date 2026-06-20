# Refonte vitrine L'Instant Tranquille — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refondre la vitrine du gîte (5 pages, design hybride photo-first façon Elyse mais sobre, axe cavaliers) avec un SEO/GEO « godlike » 2026 et des dépendances à jour, build vert.

**Architecture:** On capitalise sur l'existant (Next.js 16 App Router + Payload CMS + next-intl + Tailwind v4 + shadcn). Pas de réécriture : montée de version prudente, enrichissement du design system, refonte des sections selon les patterns Elyse (whitespace, plein-bleed, asymétrie, masonry), ajout d'une page `/les-alentours` (dont une section cavaliers), et durcissement SEO/GEO porté depuis `axelhamilcaro.com`.

**Tech Stack:** Next.js 16.2.x · React 19.2.x · Payload CMS 3.85.x · next-intl 4.13.x · Tailwind CSS 4.3.x · shadcn/ui · Zod · Biome · Leaflet · embla-carousel · Turnstile · Resend.

## Global Constraints

- **Build vert obligatoire** : `node_modules/.bin/tsc --noEmit` + `node_modules/.bin/biome check` + `pnpm build` (ou `node_modules/.bin/next build`) sans erreur à la fin de chaque phase.
- **Workflow schéma DB** : pas de `migrations/`. Après tout ajout/retrait de champ Payload, lancer `pnpm dev` une fois (push schéma) AVANT `pnpm build`.
- **pnpm v11.8+** : build scripts natifs approuvés via `allowBuilds` dans `pnpm-workspace.yaml` (`sharp`, `esbuild`, `@swc/core`, `@parcel/watcher`, `unrs-resolver` à `true`). Repli : binaires directs `node_modules/.bin/*`.
- **Positionnement** : « un gîte en Sologne », PAS « gîte de charme ». Ton sobre, factuel. Aucun cliché luxe/marketing (« havre de paix », superlatifs creux).
- **Axe cavaliers** : proximité seule (pas d'accueil chevaux sur place). Base pour cavaliers proches du Grand Parquet de Lamotte-Beuvron (FFE, Generali Open de France, ~17 km à confirmer).
- **Design** : hybride typographique — titres sans-serif bold (Inter display heavy par défaut), accents Playfair italic, corps Lora. Vert `#4a7c59` signature + earth + neutres chauds (crème/taupe/pierre/terracotta). Jamais de blanc pur. Dark-mode OS neutralisé.
- **Conventions code** : props composant = `interface` ; pas de barrel `index.ts` ; pas de `<div>` wrapper inutile (Fragment si possible) ; pas de commentaires superflus ; `void navigate(...)` dans les callbacks mutation ; pas de DDD (infra pragmatique).
- **Bilingue FR/EN** : conserver `/en/*`. `src/i18n/proxy.ts` NE PAS supprimer. Toute clé i18n ajoutée doit exister dans `fr.json` ET `en.json` (symétrie stricte) + `pathnames` traduits dans `routing.ts`.
- **Réservation** : CTA Airbnb/Booking/Abritel branchés sur `PricingConfig.platformLinks` (aucune URL en dur). Les CTA doivent être très accessibles (header, hero, section dédiée, page tarifs) mais sobres et intégrés au design.
- **Base de prod — restart propre** : la DB de `.env` est la PROD ; son contenu existant n'a aucune valeur. On repart de zéro : OK de reset/clear les collections et de re-seeder un contenu propre, correct et on-brand. Le seed doit être **re-jouable** sans planter (clear → create ; `updateGlobal` idempotent ; admin en find-or-create).
- **Resend / Turnstile — hors scope** : pas d'envoi d'email, pas de captcha. Le formulaire contact stocke seulement dans `ContactMessages` (dégrade proprement sans secret). La réservation passe par les CTA Booking/Airbnb.
- **Capacité** : 6 personnes / 3 chambres / 2 sdb / 120 m². À lire depuis `SiteSettings.propertyDetails`, ne pas hardcoder.
- **Vérification** : pas de suite de tests unitaires dans ce repo. Vérifier par typecheck + lint + build + Google Rich Results Test (JSON-LD) + Lighthouse (INP/LCP/CLS) + revue visuelle (screenshots).
- **Photos** : 19 `.webp` dans `public/images/` (intérieur : entrée, 3 chambres, séjour, salon cheminée + baby-foot, cuisine verte, jardin/terrasse, détails déco). Manques connus : pas d'extérieur/façade, pas de paysage Sologne, pas de photo équestre → placeholders calibrés pour ces emplacements.

---

## Phase 0 — Dépendances SOTA prudent

### Task 0.1: Montée des versions mineures

**Files:**
- Modify: `package.json`
- Modify: `pnpm-workspace.yaml` (vérifier `allowBuilds`)
- Modify: `pnpm-lock.yaml` (généré)

**Interfaces:**
- Produces: lockfile à jour, aucune API cassée.

- [ ] **Step 1:** Relever les versions installées : `node_modules/.bin/next --version` et inspecter `package.json`.
- [ ] **Step 2:** Monter les minors compatibles :
  ```bash
  pnpm up next@^16.2 react@^19.2 react-dom@^19.2 next-intl@^4.13 \
    payload@latest @payloadcms/db-postgres@latest @payloadcms/storage-vercel-blob@latest \
    @payloadcms/plugin-seo@latest @payloadcms/richtext-lexical@latest @payloadcms/live-preview-react@latest \
    @payloadcms/next@latest @payloadcms/ui@latest \
    tailwindcss@^4.3 @tailwindcss/postcss@^4.3 embla-carousel-react@^8.6 @marsidev/react-turnstile@latest
  ```
  (les packages `@payloadcms/*` doivent rester à la même version entre eux).
- [ ] **Step 3:** `node_modules/.bin/tsc --noEmit` — résoudre les éventuelles ruptures de types.
- [ ] **Step 4:** Migrer `src/lib/queries.ts` de `unstable_cache` vers la directive `'use cache'` (Next 16) si le typecheck signale la dépréciation ; sinon conserver et noter. Vérifier que les tags de revalidation (`src/lib/revalidate.ts`) restent cohérents.
- [ ] **Step 5:** `pnpm dev` une fois (push schéma) puis `node_modules/.bin/next build` — build vert.
- [ ] **Step 6:** Commit.
  ```bash
  git add package.json pnpm-lock.yaml pnpm-workspace.yaml src/lib/queries.ts
  git commit -m "chore: montee des deps SOTA prudent (Next 16.2 / Payload 3.85 / next-intl 4.13 / Tailwind 4.3)"
  ```

### Task 0.2: Zod 4 et radix unifié (conditionnel)

**Files:** `package.json`, fichiers consommant Zod (`src/lib/validators.ts`, server actions).

- [ ] **Step 1:** Tenter `pnpm up zod@^4` puis `node_modules/.bin/tsc --noEmit`.
- [ ] **Step 2:** Si rupture limitée (`z.string().email()` → `z.email()`, `error` au lieu de `message`), appliquer le codemod / corriger manuellement. Si la migration est large ou risquée, **revenir en arrière** (`pnpm up zod@^3`) et noter le report dans `docs/REFONTE.md`. Idem pour le package `radix-ui` unifié (optionnel — ne migrer que si propre).
- [ ] **Step 3:** Build + lint verts.
- [ ] **Step 4:** Commit (qu'on ait migré ou reporté, tracer la décision).

---

## Phase 1 — Design system (fondations)

### Task 1.1: Enrichir la palette de neutres chauds + terracotta

**Files:**
- Modify: `src/styles/globals.css`

**Interfaces:**
- Produces: variables CSS `--color-stone-*`, `--color-terracotta-*` (accent), tokens `@theme inline` exposant les nouvelles familles aux classes Tailwind.

- [ ] **Step 1:** Ajouter une échelle `stone`/`taupe` chaude (50→900) et un accent `terracotta` (harmonisé avec les photos chambre 2 / briques), sans casser `primary`/`earth`/`sand` existants.
- [ ] **Step 2:** Exposer ces familles dans `@theme inline`. Vérifier que `--color-popover`, `--primary`, `--secondary` restent définis (régression thème déjà corrigée auparavant).
- [ ] **Step 3:** `pnpm dev` — vérifier visuellement qu'aucune section existante ne casse.
- [ ] **Step 4:** Commit.

### Task 1.2: Typographie hybride

**Files:**
- Modify: `src/lib/fonts.ts`
- Modify: `src/styles/globals.css` (mapping `--font-heading`/`--font-body`/`--font-display`)

**Interfaces:**
- Produces: rôle des polices — titres display sans-serif bold (Inter heavy), accents Playfair italic, corps Lora. Variable `--font-display` ajoutée.

- [ ] **Step 1:** Dans `fonts.ts`, s'assurer qu'Inter charge les graisses lourdes (700/800/900) et `display: "swap"`. Ajouter une variable `--font-display`.
- [ ] **Step 2:** Dans `globals.css`, mapper les `h1`/eyebrows sur le display sans-serif (tracking serré), réserver Playfair italic aux sous-titres/citations, garder Lora en corps.
- [ ] **Step 3:** Vérifier le nombre de fichiers de police chargés (perf : éviter d'ajouter une 4ᵉ famille — réutiliser Inter). Lighthouse « fonts » sans warning bloquant.
- [ ] **Step 4:** Commit.

### Task 1.3: SectionHeading — 3 variants + sous-titre

**Files:**
- Modify: `src/components/shared/SectionHeading.tsx`

**Interfaces:**
- Produces: `interface SectionHeadingProps { variant?: "default" | "left" | "minimal"; subtitle?: string; eyebrow?: string; centered?: boolean; ... }`. Consommé par toutes les sections refondues.

- [ ] **Step 1:** Étendre les props avec `variant` et `eyebrow` (label court Playfair italic), garder rétro-compat (`centered` continue de fonctionner).
- [ ] **Step 2:** Implémenter les 3 rendus (centré / aligné gauche / minimal sans underline).
- [ ] **Step 3:** `tsc --noEmit` vert ; vérifier les usages existants.
- [ ] **Step 4:** Commit.

### Task 1.4: PayloadImage — blur-up

**Files:**
- Modify: `src/components/shared/PayloadImage.tsx`
- Modify: `src/collections/Media.ts` (hook génération `blurDataURL` via sharp à l'upload, stocké en champ)
- Possible: `src/lib/blur.ts` (helper)

**Interfaces:**
- Produces: `PayloadImage` passe `placeholder="blur"` + `blurDataURL` quand disponible ; sinon dégrade proprement (pas de blur).

- [ ] **Step 1:** Ajouter dans `Media.ts` un champ `blurDataURL` (text, admin hidden) peuplé par un `beforeChange`/`afterRead` hook utilisant sharp (resize 10px → base64).
- [ ] **Step 2:** Dans `PayloadImage`, lire ce champ et le passer à `next/image` (`placeholder`, `blurDataURL`). Garder `sizes` existants.
- [ ] **Step 3:** `pnpm dev` (push schéma pour le nouveau champ), re-uploader/re-seed une image, vérifier le blur-up.
- [ ] **Step 4:** Commit.

---

## Phase 2 — Photos dans Payload

### Task 2.1: Refonte du seed — contenu propre on-brand + photos dans Payload Media (restart prod)

**Files:**
- Modify: `scripts/seed.ts`

**Interfaces:**
- Produces: seed re-jouable produisant un contenu propre (copy sobre, capacité 6/3/2/120) + 19 documents Media (`alt`/`caption` FR+EN + `blurDataURL`) câblés aux Pages.

- [ ] **Step 1:** Rendre le seed **re-jouable** : `payload.delete` (where vide) sur `pages`/`amenities`/`testimonials`/`local-recommendations`/`media` en début de seed ; `updateGlobal` (déjà idempotent) ; admin en find-or-create (try create, ignorer l'erreur d'unicité). La prod repart de zéro.
- [ ] **Step 2:** **Purger la copy interdite** : retirer tout « gîte de charme » / « havre de paix » / « parenthèse nature » des globals/pages/testimonials → ton sobre et factuel. Garder la capacité réelle 6 pers / 3 ch / 2 sdb / 120 m².
- [ ] **Step 3:** Mapping explicite `{ filename, altFr, altEn, captionFr, captionEn, category }` pour les 19 `.webp` de `public/images/` (ex. `chambre-1-lit-double-vert-sauge.webp` → « Chambre 1, lit double, tons vert sauge »). Catégories : entrée / chambre / séjour / salon / cuisine / jardin / détail.
- [ ] **Step 4:** Créer les Media via `payload.create({ collection: 'media', filePath: 'public/images/<f>', data })`, et câbler home (`heroImage`/`introImage`) + le-gite (`gallery`/`previewImages`) dessus.
- [ ] **Step 5:** Lancer le seed (script `seed` du `package.json`) **sur la prod**, vérifier dans l'admin : 19 Media + tailles + blurDataURL, pages correctes, zéro doublon.
- [ ] **Step 6:** Commit.

---

## Phase 3 — Refonte des sections (patterns Elyse)

> Chaque task : modifier le composant, vérifier via `pnpm dev` + screenshot, `tsc`/`biome` verts, commit. Respect `prefers-reduced-motion` et accessibilité (alt, focus, aria).

### Task 3.1: HeroSection plein-bleed

**Files:** Modify `src/components/home/HeroSection.tsx`
- [ ] Hero 100vh full-bleed (pas de border-radius), overlay dégradé paramétrable (remplacer `bg-primary-900/50` fixe), titre display + sous-titre Playfair italic, CTA primaire « Réserver » → lien plateforme, CTA secondaire « Découvrir le gîte ». Image `priority` + blur-up. Calibrer sur une photo forte (salon cheminée / jardin) tant qu'il n'y a pas d'extérieur. Commit.

### Task 3.2: StatsBand (nouveau)

**Files:** Create `src/components/home/StatsBand.tsx` ; Modify `src/app/(frontend)/[locale]/page.tsx` ; i18n keys.
- [ ] Bande de stats épurée (8 pers · 3 ch · surface · 12 km Chambord · ~17 km Grand Parquet). Données depuis `SiteSettings.propertyDetails` + distances depuis i18n/CMS. Whitespace généreux. Commit.

### Task 3.3: IntroSection asymétrique

**Files:** Modify `src/components/home/IntroSection.tsx`
- [ ] Layout 60/40 décalé (image dominante), copy sobre (pas de cliché). Reveals au scroll. Commit.

### Task 3.4: HighlightsSection — bande éditoriale sans cards

**Files:** Modify `src/components/home/HighlightsSection.tsx`
- [ ] Remplacer les 4 cards par une bande éditoriale (alternance texte/visuel ou liste rythmée), icônes discrètes. Garder l'alimentation CMS (`highlights[]`). Commit.

### Task 3.5: PhotoGallery — masonry + lightbox prev/next

**Files:** Modify `src/components/cottage/PhotoGallery.tsx`
- [ ] Vrai masonry (CSS columns ou grid auto-rows) ratios mixtes ; lightbox avec navigation prev/next + clavier (←/→/Esc) + focus trap ; fallback grille si < 3 photos. Commit.

### Task 3.6: CTASection sur fond photo + plateformes

**Files:** Modify `src/components/home/CTASection.tsx`
- [ ] Fond photo + overlay (fin du vert plat) ; boutons Airbnb / Booking / Abritel (logos SVG plateformes) depuis `PricingConfig.platformLinks` + email. Commit.

### Task 3.7: TestimonialsSection fond sand + CottageHeroSection

**Files:** Modify `src/components/home/TestimonialsSection.tsx` ; Create `src/components/cottage/CottageHeroSection.tsx` ; Modify `le-gite/page.tsx`.
- [ ] Testimonials sur fond `sand`. Nouveau hero court pour `/le-gite` (bandeau photo + titre + eyebrow). Commit.

### Task 3.8: Footer — SVG sociaux

**Files:** Modify `src/components/layout/Footer.tsx` ; possible `src/components/shared/SocialIcons.tsx`.
- [ ] Remplacer « P »/« YT »/« TT » par vrais SVG (Pinterest/YouTube/TikTok), conditionnés à la présence du lien dans `SiteSettings`. Commit.

---

## Phase 4 — Page `/les-alentours` + section cavaliers

### Task 4.1: Modèle Payload pour `/les-alentours`

**Files:**
- Modify: `src/collections/Pages.ts` (ajouter le slug `les-alentours` + champs conditionnels : intro, section cavaliers richText, FAQ alentours)
- Modify: `src/collections/LocalRecommendations.ts` (s'assurer d'une catégorie `equestrian` / sports équestres)

**Interfaces:**
- Produces: champs Pages pour `les-alentours` (`alentoursIntro`, `equestrianTitle`, `equestrianText` richText, `equestrianVenues[]`), catégorie équestre dans LocalRecommendations.

- [ ] **Step 1:** Ajouter le bloc conditionnel `slug === "les-alentours"`.
- [ ] **Step 2:** Ajouter la catégorie équestre à `LocalRecommendations`.
- [ ] **Step 3:** `pnpm dev` (push schéma). Commit.

### Task 4.2: Route + composants `/les-alentours`

**Files:**
- Create: `src/app/(frontend)/[locale]/les-alentours/page.tsx`
- Create: `src/components/surroundings/SurroundingsHero.tsx`, `CategoryGrid.tsx`, `EquestrianSection.tsx`, `SurroundingsMap.tsx`
- Modify: `src/i18n/routing.ts` (pathname traduit `/les-alentours` ↔ `/surroundings`)
- Modify: `src/i18n/messages/fr.json` + `en.json` (namespace `surroundings` + `equestrian`)
- Modify: `src/globals/Header.ts` / `Footer.ts` (entrée nav)

**Interfaces:**
- Consumes: `getPage('les-alentours')`, `getLocalRecommendations()` depuis `src/lib/queries.ts`.
- Produces: page rendant catégories (châteaux/nature/restaurants/activités) + section équestre proéminente.

- [ ] **Step 1:** Créer la route + `generateMetadata` (via `seo.ts`) + h1 géolocalisé.
- [ ] **Step 2:** `CategoryGrid` à partir de `LocalRecommendations` (tuiles photos mixtes, façon masonry léger). Distances + liens.
- [ ] **Step 3:** `EquestrianSection` : copy sobre sur la proximité Grand Parquet/FFE/concours, distances, conseils cavaliers (parking, horaires de concours), FAQ équestre. Placeholder calibré si pas de photo équestre.
- [ ] **Step 4:** Carte des alentours (Leaflet dynamique `ssr:false`) avec marqueurs recommandations.
- [ ] **Step 5:** Ajouter l'entrée nav (header + footer) + clés i18n FR/EN symétriques + pathname.
- [ ] **Step 6:** `pnpm dev`, vérifier `/les-alentours` et `/en/surroundings`. Build vert. Commit.

---

## Phase 5 — SEO / GEO godlike

### Task 5.1: jsonld.ts — sameAs, WebSite, TouristAttraction, FAQ étendue

**Files:**
- Modify: `src/lib/jsonld.ts`
- Modify: `src/globals/SiteSettings.ts` (champs `sameAs` : URLs Airbnb/Booking/Abritel/Google Business)

**Interfaces:**
- Produces: `generateWebSiteJsonLd()`, `generateTouristAttractionJsonLd(rec)`, `sameAs` dans `generateLodgingBusinessJsonLd`, FAQ utilisables sur le-gite/tarifs/alentours.

- [ ] **Step 1:** Ajouter `sameAs[]` (depuis SiteSettings) sur `LodgingBusiness`. GPS à 5 décimales. `checkinTime`/`checkoutTime` ISO 8601. `contentReferenceTime` sur les `Review`. `amenityFeature` avec absences `value:false` pour les équipements non disponibles.
- [ ] **Step 2:** `generateWebSiteJsonLd()` (type `WebSite`, `inLanguage`, `@id`).
- [ ] **Step 3:** `generateTouristAttractionJsonLd()` pour les `LocalRecommendations` + une entrée dédiée Grand Parquet de Lamotte-Beuvron.
- [ ] **Step 4:** Câbler FAQ JSON-LD sur `/le-gite`, `/tarifs-reservation`, `/les-alentours` (questions dont une équestre). Injecter `WebSite` au layout.
- [ ] **Step 5:** Valider chaque page au Google Rich Results Test (0 erreur). Commit.

### Task 5.2: Metadata — googleBot, keywords, OG par page

**Files:**
- Modify: `src/lib/seo.ts`, `src/app/(frontend)/[locale]/layout.tsx`
- Create: `src/app/(frontend)/[locale]/le-gite/opengraph-image.tsx`, `.../tarifs-reservation/opengraph-image.tsx`, `.../les-alentours/opengraph-image.tsx`, `.../contact/opengraph-image.tsx`
- Possible: `src/lib/og.tsx` (template paramétrable réutilisable)

**Interfaces:**
- Produces: directives `robots.googleBot` (`max-image-preview:large`, `max-snippet:-1`, `max-video-preview:-1`), `keywords` (dont équestres), OG images par page avec photo réelle + titre.

- [ ] **Step 1:** Étendre `generatePageMetadata`/layout avec `robots.googleBot` + `keywords` (inclure « hébergement cavaliers Sologne », « gîte proche Grand Parquet »).
- [ ] **Step 2:** Template OG paramétrable (`src/lib/og.tsx`) + une `opengraph-image.tsx` par page.
- [ ] **Step 3:** Vérifier OG via débogueurs (rendu local). Build vert. Commit.

### Task 5.3: sitemap images, robots IA, llms.txt, security headers

**Files:**
- Modify: `src/app/sitemap.ts` (ajouter `images[]` par page + entrée `/les-alentours`)
- Modify: `src/app/robots.ts` (`host` + `GPTBot`/`ClaudeBot`/`PerplexityBot`/`Google-Extended` autorisés)
- Create: `public/llms.txt`, `public/llms-full.txt`
- Modify: `next.config.ts` (security headers : HSTS, CSP raisonnable, X-Frame-Options, Referrer-Policy)

**Interfaces:**
- Produces: sitemap enrichi, robots IA-friendly, llms.txt, headers.

- [ ] **Step 1:** Ajouter `images[]` + l'URL `/les-alentours` (+ `alternates.languages`) au sitemap.
- [ ] **Step 2:** robots : `host` + règles crawlers IA.
- [ ] **Step 3:** `llms.txt` (index) + `llms-full.txt` (identité, capacité, axe cavaliers, tarifs indicatifs, avis verbatim, FAQ).
- [ ] **Step 4:** Security headers dans `next.config` (vérifier que la CSP n'empêche pas tuiles carte/blob/og).
- [ ] **Step 5:** Build vert ; `curl` local des routes `sitemap.xml`/`robots.txt`/`llms.txt`. Commit.

---

## Phase 6 — QA & vérification finale

### Task 6.1: Vérification globale

**Files:** Modify `docs/REFONTE.md` (statut à jour).

- [ ] **Step 1:** `node_modules/.bin/biome check` + `node_modules/.bin/tsc --noEmit` + `pnpm build` — tous verts.
- [ ] **Step 2:** Google Rich Results Test sur les 5 pages (FR + EN) — 0 erreur JSON-LD.
- [ ] **Step 3:** Lighthouse (mode prod) sur home + le-gite + les-alentours : viser INP < 200ms, LCP ≤ 2,5s, CLS ≤ 0,1, SEO 100. Noter les scores.
- [ ] **Step 4:** Revue visuelle (screenshots desktop + mobile) des 5 pages — cohérence design hybride, pas de placeholder cassé, CTA réservation visibles.
- [ ] **Step 5:** Mettre à jour `docs/REFONTE.md` (fait / reporté / bloquants client restants : NAP réel, liens plateformes, photos extérieur/équestre, secrets prod). Commit.

---

## Self-review (couverture spec)

- Positionnement sobre + axe cavaliers → Global Constraints + Task 4.2 (EquestrianSection) + 5.1 (TouristAttraction Grand Parquet) + 5.2 (keywords).
- 5 pages → Phase 4 (nouvelle page) + sections existantes refondues (Phase 3).
- Design hybride / palette / patterns Elyse → Phase 1 + Phase 3.
- Photo-first (blur-up, ≥8 photos, sitemap images) → 1.4, 2.1, 5.3.
- SEO/GEO P0/P1/P2 → Phase 5 (sameAs, WebSite, FAQ, TouristAttraction, googleBot, keywords, OG, sitemap images, llms.txt, robots IA, headers).
- Réservation CTA → 3.1, 3.6, 5 (PricingConfig).
- Deps SOTA prudent → Phase 0.
- i18n FR/EN → contrainte globale + 4.2.
- Core Web Vitals → 6.1.
- Bloquants client → tracés en 6.1 + spec §12.
