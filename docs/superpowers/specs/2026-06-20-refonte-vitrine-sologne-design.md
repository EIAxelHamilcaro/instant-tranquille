# Spec — Refonte vitrine L'Instant Tranquille (Sologne)

> Date : 2026-06-20 · Statut : validé en brainstorming, en attente de revue utilisateur
> Branche cible : nouvelle branche de feature (ex. `refonte/design-seo-2026`)

## 1. Contexte & objectif

Site vitrine d'un gîte à Romorantin-Lanthenay (Sologne, Loir-et-Cher), géré dans Payload CMS
par une non-technicienne. Objectifs, par ordre de priorité :

1. **Dépendances à jour, SOTA 2026, build vert.**
2. **SEO/GEO « godlike »** : ranking local fort + citabilité par les moteurs génératifs
   (ChatGPT, Perplexity, Google AI Overviews, Claude).
3. **Design professionnel photo-first**, inspiré de la rigueur de mise en page d'Elyse Residence
   (whitespace, plein-bleed, asymétrie) **mais au service d'un gîte réel**, pas d'une résidence de luxe.

L'infrastructure est déjà solide (4 pages, JSON-LD LodgingBusiness/VacationRental/FAQ/Offer,
i18n FR/EN complet, PayloadImage + Vercel Blob, sitemap/robots/manifest/OG). La refonte
**capitalise** dessus, elle ne repart pas de zéro.

## 2. Positionnement éditorial (cadrage client)

- **Ce n'est PAS un « gîte de charme ».** C'est **un gîte en Sologne**, point. Ton **sobre,
  honnête, factuel**. Bannir le copy promotionnel pompeux (« havre de paix », surenchère luxe,
  superlatifs creux).
- **Axe commercial & SEO majeur — les cavaliers.** Le gîte est très loué par des cavaliers et
  pratiquants de sports équestres. La Sologne est une terre équestre : **Grand Parquet de
  Lamotte-Beuvron** (site de la Fédération Française d'Équitation, accueille le **Generali Open
  de France**), à ~15-20 km. **Proximité seule** : pas d'accueil de chevaux sur place — on
  positionne le gîte comme **base idéale pour cavaliers** en concours/loisir.
- Direction visuelle : **hybride typographique** — gros titres sans-serif bold (impact),
  Playfair italic en accents éditoriaux, **vert `#4a7c59` en signature** sur une palette de
  **neutres chauds** (crème/taupe/pierre). Ni « gîte de charme » fleuri, ni « luxe minimal » froid.
- **Bilingue FR/EN conservé** (traduction i18n déjà complète).

## 3. Architecture du site — 5 pages

| Route | Rôle | Intention SEO/GEO principale |
|---|---|---|
| `/` | Vitrine : hero plein-bleed, bande stats, intro asymétrique, highlights éditoriaux (sans cards), aperçu galerie, avis, CTA réservation | marque, « gîte Sologne » |
| `/le-gite` | Le produit : hero court, description, **galerie masonry (≥ 8 photos)**, équipements, capacité/specs, FAQ gîte | « location gîte Romorantin », équipements |
| `/les-alentours` **(NOUVELLE)** | La Sologne : châteaux (Chambord, Cheverny, Blois), étangs/nature, restaurants, activités, carte — **+ section forte « Cavaliers & sports équestres »** (Grand Parquet, FFE, concours, distances) + FAQ alentours | « que faire en Sologne », « gîte proche châteaux Loire », **« hébergement cavaliers Sologne »**, **« gîte proche Grand Parquet »** |
| `/tarifs-reservation` | Tarifs saisons, calendrier, conditions, FAQ tarifs, **CTA Airbnb/Booking/Abritel proéminents** | « prix gîte Sologne », réservation |
| `/contact` | Formulaire (Turnstile + Resend), carte, accès, NAP | « contact gîte Romorantin » |

- `/livret-accueil/[token]` : conservé, **noindex**, hors périmètre vitrine.
- **Hors scope v1** : blog/journal (excellent pour GEO mais charge CMS trop lourde pour la
  gérante — noté en v2 optionnel).

## 4. Design system (hybride typographique)

- **Titres** : sans-serif bold dramatique, tracking serré. Défaut = **Inter en display heavy**
  (pas de 4ᵉ police → préserve INP/LCP). Option évaluée en phase design : grotesk plus
  caractériel si le rendu Inter manque de personnalité.
- **Accents éditoriaux** : **Playfair Display italic** (sous-titres hero, eyebrows, citations avis).
- **Corps** : **Lora** (inchangé).
- **Palette** : `primary` vert `#4a7c59` en **signature** (plus en aplats omniprésents) + `earth`
  brun + enrichissement des **neutres chauds** (crème/taupe/pierre). Jamais de blanc pur
  (déjà `#fdfcf9`). Dark-mode OS reste neutralisé.
- **Patterns Elyse portés sur toutes les sections** :
  - Hero 100vh **plein-bleed** (pas de border-radius), message minimal + CTA réservation.
  - **Bande de stats** (8 pers · 3 ch · 12 km Chambord · 17 km Grand Parquet…).
  - Sections **asymétriques 60/40** (image dominante + texte).
  - **HighlightsSection** : bande éditoriale **sans cards** (fin de l'effet template).
  - **PhotoGallery** : vrai **masonry** + lightbox **prev/next** (fallback grille si < 3 photos).
  - **CTASection** : fond **photo** (fin du vert plat) → boutons plateformes.
  - **TestimonialsSection** : fond `sand`.
  - Nouveau `CottageHeroSection` (hero court pour `/le-gite`).
  - **Whitespace radical**, reveals subtils au scroll (hook `useReveal` existant), respect
    `prefers-reduced-motion`.
  - `SectionHeading` : 3 variants (default/left/minimal) + sous-titre.
  - `Footer` : remplacer « P »/« YT »/« TT » par vrais SVG sociaux.

## 5. Photo-first

- **Blur-up** : ajouter `placeholder="blur"` + `blurDataURL` dans `PayloadImage`
  (`src/components/shared/PayloadImage.tsx`) — absent aujourd'hui, clé pour LCP/perçu.
  Génération via hook Payload (sharp) ou `plaiceholder` à l'upload.
- **Art direction** hero : crops mobile vs desktop. Formats AVIF/WebP (déjà actifs via `next.config`).
- **≥ 8 photos** sur `/le-gite` (seuil rich results `VacationRental` Google).
- **Images déclarées dans le sitemap** (`<image:image>`).
- **Intégration directe** des photos fournies par le client (dépendance : emplacement/lot à fournir).

## 6. SEO / GEO — plan « godlike »

Patterns portés depuis le site perso de référence (`axelhamilcaro.com`) + recherche 2026.

**P0 — impact fort, effort faible**
- `sameAs` sur `LodgingBusiness` : Airbnb, Booking, Abritel, Google Business, (TripAdvisor) →
  consolidation d'entité Knowledge Graph + signal notoriété pour les LLMs.
- Directives `googleBot` : `max-image-preview: large`, `max-snippet: -1`, `max-video-preview: -1`.
- **FAQ JSON-LD** sur `/le-gite`, `/tarifs-reservation`, `/les-alentours` (aujourd'hui home only).
  Inclure des **questions équestres** (« gîte proche du Grand Parquet ? », « hébergement pour
  cavaliers en concours ? »).
- Schéma `WebSite` global (entité site distincte du business).
- `TouristAttraction` pour les recommandations locales **et le Grand Parquet / sites équestres**
  (levier GEO majeur de la nouvelle page).
- **Mots-clés équestres** intégrés au contenu et aux metadata : « hébergement cavaliers Sologne »,
  « gîte proche Grand Parquet Lamotte-Beuvron », « location séjour concours équestre Sologne ».

**P1**
- **OG image par page** (template paramétrable façon perso) avec photo réelle + titre spécifique.
- `keywords` dans les metadata (Bing + crawlers LLM).
- `images[]` dans les entrées du sitemap.
- `amenityFeature` avec **absences explicites** (`value: false`) pour les requêtes attribut-spécifiques.
- Coordonnées GPS à **5 décimales** ; `checkinTime`/`checkoutTime` ISO 8601 ; `contentReferenceTime`
  sur les avis (requis FR).

**P2**
- `public/llms.txt` + `public/llms-full.txt` (faible impact SEO mesuré en 2026 mais optionalité ;
  utile aux agents IDE). Identité, capacité, axe cavaliers, tarifs indicatifs, avis verbatim, FAQ.
- `robots.ts` : ajouter `host:` + autoriser explicitement `GPTBot`, `ClaudeBot`, `PerplexityBot`,
  `Google-Extended`.
- Security headers dans `next.config` (HSTS, CSP, X-Frame-Options, Referrer-Policy) — trust signal.

**Performance / Core Web Vitals 2026** (seuils confirmés) :
- **INP < 200 ms** (priorité n°1 sur stack React — minimiser le JS client, RSC par défaut,
  `'use client'` au plus près des feuilles).
- **LCP ≤ 2,5 s** (hero `priority` + blur-up + preconnect).
- **CLS ≤ 0,1** (dimensions explicites sur toutes les images).

## 7. Réservation — CTA Airbnb / Booking / Abritel partout

- Header : CTA « Réserver » persistant (existe).
- Hero : CTA primaire → réservation.
- **Section CTA dédiée sur fond photo** avec boutons Airbnb / Booking / Abritel (logos plateformes).
- `/tarifs-reservation` : bloc réservation proéminent.
- Tout branché sur `PricingConfig.platformLinks` (Payload) — aucune URL en dur.

## 8. Dépendances — SOTA prudent

- Montée des minors : Next.js 16.2.x, React 19.2.x, Payload 3.85.x (`payload` + `@payloadcms/*`
  groupés), next-intl 4.13.x, Tailwind 4.3.x, embla 8.6.x, react-turnstile 1.5.x.
- Migration sûre : `unstable_cache` → directive `'use cache'` (`src/lib/queries.ts`).
- **Zod 4** et **package `radix-ui` unifié** : seulement si la migration est propre/automatisable
  (codemod), sinon reportés. Pas de breaking forcé.
- **Critère bloquant** : `pnpm lint` + build TypeScript verts (contournement pnpm v11 documenté
  dans CLAUDE.md : binaires `node_modules/.bin/*` directs).
- Rappel workflow schéma DB : pas de `migrations/` — lancer `pnpm dev` (push schéma) après tout
  ajout/retrait de champ Payload, AVANT `pnpm build`.

## 9. i18n FR/EN

- Conserver `/en/*` (routing next-intl via `src/i18n/proxy.ts` — NE PAS supprimer).
- Ajouter les clés de la nouvelle page `/les-alentours` + section cavaliers dans
  `messages/{fr,en}.json` (symétrie stricte) + `pathnames` traduits dans `routing.ts`.

## 10. Non-objectifs (YAGNI)

- Pas de blog en v1.
- Pas de DDD (vitrine éditoriale — config typée + guards pragmatiques, conforme CLAUDE.md).
- Pas de page cavaliers dédiée (section sur `/les-alentours` suffit en v1).
- Pas de migration Zod 4 / radix unifié si elle n'est pas propre.
- Pas de positionnement luxe ni de vocabulaire « charme ».

## 11. Critères de succès (DoD)

- `pnpm lint` + build TypeScript + `pnpm build` **verts**.
- 5 pages livrées, design hybride cohérent, photos intégrées, ≥ 8 photos sur `/le-gite`.
- Section cavaliers + FAQ équestre + `TouristAttraction` Grand Parquet en place.
- Tous les items P0 SEO/GEO implémentés ; P1 implémentés ; P2 implémentés ou explicitement
  reportés et tracés.
- JSON-LD validé (Rich Results Test) sans erreur ; metadata + hreflang corrects sur les 5 pages.
- Core Web Vitals : pas de régression, cibles INP/LCP/CLS visées (mesure Lighthouse).
- Deps montées, build vert.

## 12. Risques & dépendances client (bloquants à lever)

1. **Photos** : lot à fournir/localiser (le client en a) — nécessaire pour viser ≥ 8 photos.
2. **NAP réel** : adresse exacte, téléphone, ville/CP, GPS 5 décimales dans SiteSettings (JSON-LD).
3. **Liens plateformes réels** : URLs Airbnb/Booking/Abritel + Google Business (pour `sameAs` et CTA).
4. **Contenu équestre** : sites/événements à citer, distances exactes (Grand Parquet ~17 km à confirmer),
   éventuelle écurie partenaire.
5. **Secrets prod** : `RESEND_API_KEY`, `TURNSTILE_*`, `DATABASE_URL`, `PAYLOAD_SECRET`,
   `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_SITE_URL`.

> Le design/SEO peut avancer avec des placeholders calibrés ; le contenu réel (NAP, photos, liens,
> équestre) est saisi par le client dans le CMS sans retoucher le code.
