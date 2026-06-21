# Refonte vitrine — L'Instant Tranquille

Gîte en Sologne (Romorantin-Lanthenay). Objectif : vitrine simple, attractive, CMS
gérable par une non-technicienne, référencement local fort.

## Constat de départ (audit 42 agents)

Le repo **n'était pas surchargé**. C'est un Next.js 16 + Payload CMS 3 propre, SEO déjà
avancé (JSON-LD LodgingBusiness/VacationRental/FAQPage/BreadcrumbList, sitemap, robots,
OG, hreflang, plugin-seo). La branche `feature/cms-overhaul` (simplification) est **déjà
fusionnée dans `main`**. La refonte est donc chirurgicale : combler les gaps SEO local,
corriger des bugs de thème, simplifier l'UX d'édition, polir le design — pas réécrire.

## Fait — Phase QA finale (2026-06-20, build vert)

### Outils de vérification

- `node_modules/.bin/tsc --noEmit` : **vert, 0 erreur**
- `node_modules/.bin/biome check .` : **vert, 0 erreur** (159 fichiers vérifiés)
- `node_modules/.bin/next build` : **vert** — 20 pages statiques générées (FR + EN pour
  les 5 routes publiques), middleware proxy, admin Payload, routes API.

### Revue sitemap.xml / robots.txt / llms.txt

- **sitemap.xml** : 10 entrées (5 pages × 2 locales FR+EN), chaque URL avec `images[]`
  (total 14 images déclarées), `alternates.languages` fr/en, `lastModified` depuis CMS ou
  fallback. Entrée `/les-alentours` + `/en/surroundings` présente.
- **robots.txt** : wildcard `*` + règles dédiées `GPTBot`, `ClaudeBot`, `PerplexityBot`,
  `Google-Extended` (tous `allow: /`, disallow admin/api/livret). `host:` défini. `sitemap:`
  pointé. Crawler IA-friendly conforme spec.
- **llms.txt** : index minimal (5 pages, lien vers llms-full.txt). Conforme spec llms.txt.
- **llms-full.txt** : identité, capacité (6 pers/3 ch/2 sdb/120 m²), distances (Chambord
  ~12 km, Grand Parquet ~17 km), axe cavaliers, tarifs indicatifs, avis verbatim, FAQ
  complète (animaux, chevaux, parking, Wi-Fi, réservation).

### Revue visuelle des 5 pages

**Page d'accueil (`/`)**
- Hero 100vh plein-bleed : image Payload (blur-up si blurDataURL disponible), overlay
  dégradé paramétrable (`overlayFrom`/`overlayTo`), titre display extrabold, sous-titre
  Playfair italic, CTA « Réserver » → lien plateforme (airbnb → booking → abritel → email
  → /tarifs-reservation), CTA secondaire « Découvrir le gîte », chevron animé bas.
- StatsBand : 6 stats sur fond sand (invités, chambres, salles de bain, surface, ~12 km
  Chambord, ~17 km Grand Parquet) — données depuis SiteSettings.
- IntroSection : layout décalé 60/40, reveal au scroll.
- HighlightsSection : bande éditoriale (depuis CMS highlights[]).
- TestimonialsSection + TestimonialForm.
- CTASection : fond photo réelle (terrasse-salon-jardin.webp), overlay vert, boutons
  Airbnb/Booking/Abritel SVG branchés sur PricingConfig.platformLinks.
- JSON-LD : LodgingBusiness (sameAs, NAP, amenityFeature, reviews, priceRange, checkin/out)
  + FAQPage.

**Page gîte (`/le-gite`)**
- CottageHeroSection (hero court + eyebrow).
- Fil d'Ariane.
- DescriptionSection (capacité depuis SiteSettings, description CMS, images preview).
- PhotoGallery masonry + lightbox prev/next (clavier ←/→/Esc, focus trap).
- AmenitiesList (tabs par catégorie).
- NearbyAttractions (badges palette de marque).
- AreaMap (Leaflet dynamique, ssr:false).
- JSON-LD : VacationRental (équipements, avis, géo) + FAQPage cottage + BreadcrumbList.

**Page alentours (`/les-alentours`)**
- SurroundingsHero.
- Fil d'Ariane + h1 géolocalisé sr-only.
- CategoryGrid (recommandations par catégorie depuis LocalRecommendations).
- EquestrianSection : Grand Parquet (placeholder calibré — photo équestre manquante),
  venues CMS, FAQ équestre 4 Q/R (proximité, chevaux sur place, parking, concours).
- SurroundingsMap (Leaflet, marqueurs recommandations + gîte).
- JSON-LD : BreadcrumbList + FAQPage alentours + TouristAttraction Grand Parquet
  (generateGrandParquetJsonLd) + TouristAttraction par recommandation.

**Page tarifs (`/tarifs-reservation`)**
- h1 géolocalisé sr-only.
- Fil d'Ariane.
- PricingTable (saisons, frais supplémentaires, devise).
- SeasonCalendar (palette de marque — corrigé).
- BookingLinks (CTA plateformes depuis PricingConfig).
- PoliciesSection.
- JSON-LD : BreadcrumbList + Offer/PriceSpecification (generatePricingJsonLd) + FAQPage tarifs.

**Page contact (`/contact`)**
- h1 géolocalisé sr-only.
- Fil d'Ariane.
- ContactForm (stocke dans ContactMessages, dégrade sans Resend/Turnstile).
- MapSection (Leaflet).
- AccessInstructions (depuis SiteSettings.accessRoutes).
- JSON-LD : BreadcrumbList + LodgingBusiness (NAP complet).

### Design system

- **Typographie hybride** : Inter display heavy (titres), Playfair Display italic (accents,
  eyebrows, sous-titres), Lora (corps). Variable `--font-display` définie.
- **Palette** : `primary` vert `#4a7c59` + `earth` brun `#b8864f` + `sand` + neutres chauds.
  Tokens `--primary`/`--secondary`/`--popover` définis (bug shadcn corrigé). Dark-mode OS
  neutralisé (`@custom-variant dark`).
- **SectionHeading** : 3 variants (default/left/minimal) + `eyebrow` Playfair italic +
  `subtitle`.
- **Footer** : vrais SVG Pinterest / YouTube / TikTok (conditionnés à la présence du lien).
- **Security headers** : HSTS, X-Frame-Options SAMEORIGIN, X-Content-Type-Options, CSP
  (Turnstile, Vercel Blob, OSM), Referrer-Policy, Permissions-Policy.

### SEO / GEO (plan godlike)

- **P0 — implémenté** : `sameAs` sur LodgingBusiness (depuis SiteSettings), `googleBot`
  (`max-image-preview:large`, `max-snippet:-1`, `max-video-preview:-1`), FAQ JSON-LD sur
  toutes les pages (cottage/tarifs/alentours/home), `WebSite` JSON-LD au layout,
  `TouristAttraction` Grand Parquet + recommandations, keywords équestres dans seo.ts.
- **P1 — implémenté** : OG image par page (`opengraph-image.tsx` ×4 + layout), keywords
  meta (FR + EN), `images[]` dans sitemap, `amenityFeature` absences explicites
  (`value:false` pour chevaux/piscine/jacuzzi/ascenseur), GPS 5 décimales, `checkinTime`/
  `checkoutTime` ISO 8601, `contentReferenceTime` sur avis.
- **P2 — implémenté** : `llms.txt` + `llms-full.txt`, robots IA-friendly, `host:` robots,
  security headers CSP.

## Phase 0 & 0.2 — Dépendances SOTA (2026-06-20)

**Zod 4** (`^4.3.6`) : déjà installé et compatible. Aucune rupture.

**radix-ui unifié** (`^1.4.3`) : déjà migré. 9 composants shadcn depuis `"radix-ui"`.

`tsc --noEmit` : vert. `biome check` : vert. Build : vert.

## Reporté — passe suivante

### Polish design éditorial (attend vraies photos pour être optimal)

- `IntroSection` : layout décalé 60/40 (actuellement fonctionnel mais non asymétrique
  photo-first — à affiner quand photos extérieur disponibles).
- `HighlightsSection` : bande éditoriale sans cards (en place, à enrichir avec photos).
- `PhotoGallery` : masonry + lightbox implémentés ; galerie vide sans photos uploadées dans
  le CMS → à re-seed une fois les photos fournies.
- Placeholder équestre dans EquestrianSection → remplacer par photo réelle (bloquant client).

### Simplification CMS

- `Pages.ts` : scinder la collection conditionnelle-par-slug en pages dédiées — nécessite
  migration de données (décision + script).
- Champ `icon` texte libre → select borné (libellés FR) dans Amenities/Pages.
- `OnboardingGuides` : afficher l'URL complète du livret + bouton Copier.
- `Footer` : `RowLabel` sur les arrays imbriqués.

## Bloquants — actions requises côté client

1. **Photos extérieur et équestres** (bloquant photo-first) : pas d'extérieur/façade, pas
   de paysage Sologne, pas de photo équestre. EquestrianSection affiche un placeholder
   calibré. La galerie `/le-gite` est vide sans upload CMS. Liste à fournir : extérieur
   jour/soir, jardin/terrasse supplémentaires, paysage Sologne, éventuellement Grand Parquet
   (depuis leur site officiel, avec autorisation).

2. **NAP réel** (critique pour JSON-LD et SEO local) : adresse exacte, ville (`41200`),
   code postal, téléphone, coordonnées GPS 5 décimales — à saisir dans SiteSettings du CMS.
   Sans ces données, le JSON-LD `LodgingBusiness` n'a pas de `geo`, `streetAddress` ni
   `telephone` → pénalité Knowledge Graph.

3. **Liens plateformes** (CTA silencieux) : URLs Airbnb / Booking / Abritel / Google
   Business — à saisir dans SiteSettings (`sameAs`) et PricingConfig (`platformLinks`). Sans
   eux, les boutons CTA (hero, CTASection, BookingLinks) ne s'affichent pas ou pointent
   vers `/tarifs-reservation`.

4. **Secrets prod** :
   - `NEXT_PUBLIC_SITE_URL` = vrai domaine (sinon OG/metadataBase pointent localhost)
   - `RESEND_API_KEY` (sans : messages de contact en console uniquement, pas d'email)
   - `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (sans : pas de captcha)
   - `DATABASE_URL` / `PAYLOAD_SECRET` / `BLOB_READ_WRITE_TOKEN` (prod Neon + Vercel Blob)

5. **Décision bilingue FR/EN** : conserver le bilingue (double saisie CMS, URLs `/en/*`)
   ou désactiver `en` ? Clientèle 100 % FR local. Si désactivé : retirer les routes `/en/*`
   du sitemap, routing.ts et proxy.ts (travail technique, 1-2h).

6. **Livret d'accueil** (`/livret-accueil/[token]`, noindex) : fonctionnalité complète
   codée. Inclure en v1 ou masquer ? Hors périmètre vitrine stricte.

## Schéma DB (workflow push)

Pas de dossier `migrations/`. Payload synchronise le schéma à l'init en dev. Après tout
ajout de champ : lancer `next dev` une fois AVANT `pnpm build`. Migrations formelles
recommandées pour la prod.
