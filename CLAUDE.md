# CLAUDE.md, L'Instant Tranquille

Site vitrine d'un gîte en Sologne (Romorantin-Lanthenay, Loir-et-Cher), en production sur
https://www.instant-tranquille.com. Objectif : vitrine marquante, CMS gérable par une
non-technicienne, **référencement local (SEO et GEO) fort**, réservation renvoyée vers **Airbnb et
Booking**.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Payload CMS 3** (`@payloadcms/db-postgres` vers Neon, `storage-vercel-blob` si `BLOB_READ_WRITE_TOKEN` sinon disque `media/`, `plugin-seo`, richtext `lexical`, live preview)
- **next-intl 4** (FR par défaut sans préfixe d'URL, `/en/*` pour l'anglais, pathnames traduits)
- **Tailwind CSS v4** + **shadcn/ui** + **radix-ui**, **Biome**, **TypeScript** strict, **Zod 4**
- Carte : **Leaflet** / react-leaflet. Anti-spam : **Turnstile**. Défilement : **Lenis**.

## Commandes

```bash
pnpm dev                 # dev (Payload pousse le schéma DB seulement sur une base locale)
pnpm build               # build prod
pnpm lint                # biome check
pnpm seed                # peuple la base (scripts/seed/index.ts), idempotent
pnpm generate:types      # régénère src/payload-types.ts après un changement de schéma
pnpm generate:importmap  # après ajout d'un composant admin
pnpm generate:icons      # favicon, icônes et manifest à partir du héron
pnpm generate:videos     # manifeste src/lib/video-manifest.json, après tout changement de public/videos
pnpm generate:share-scenes [origine]   # tableaux des images de partage (src/assets/share-scenes), capturés sur le site local ; après tout changement des tableaux ou de l'écran d'entrée
bun test src             # tests (jsonld, vidéos, iCal, temps de route), les *.test.ts sont exclus de tsc
node_modules/.bin/tsc --noEmit && node_modules/.bin/biome check   # « fini » = les deux verts
node scripts/indexnow.mjs   # soumet le sitemap à IndexNow ; lancé par la CI après chaque déploiement de production (.github/workflows/indexnow.yml), à la main seulement après un gros changement de contenu dans le CMS
node scripts/scroll-bench.mjs <origine> [chemins]   # fluidité du défilement, page par page (Chromium de Playwright, CPU 4x, cache froid), avant toute mise en prod qui touche aux animations
```

> **Base de données : `.env` pointe sur la base Neon de PRODUCTION.** Ne jamais lancer `pnpm dev`, `pnpm seed` ni `scripts/seed/apply-corrections.ts` sans un `.env.local` qui surcharge `DATABASE_URL` vers une base locale. Le seed et `apply-corrections` refusent une base non locale sauf `SEED_ALLOW_REMOTE=1`. Base locale : conteneur Docker `lit-local-pg`, `127.0.0.1:5546`, base `lit_v2` ; `pnpm dev` une fois (push du schéma) puis `pnpm seed`. `BLOB_READ_WRITE_TOKEN=` vide en local (médias sur disque). Avant toute commande qui charge Payload : `grep -c "127.0.0.1:5546" .env.local` doit rendre 1.

> **Schéma DB (workflow push)** : pas de dossier `migrations/`. Après tout ajout ou retrait de champ : `pnpm dev` une fois (base locale) puis `pnpm generate:types`, AVANT `pnpm build`. Avec le stockage Blob, la base de prod a une colonne `media._objectkey` absente du schéma local sans `BLOB_READ_WRITE_TOKEN`. Un changement de schéma en prod demande une bascule préparée, voir `docs/REFONTE.md`.

> **pnpm** : les dépendances à build natif sont approuvées via `allowBuilds` dans `pnpm-workspace.yaml` (`sharp`, `esbuild`, `@swc/core`, `@parcel/watcher`, `unrs-resolver`).

## Production et déploiement

- Projet Vercel `instant-tranquille` (équipe `ei-axel-hamilcaro`, Hobby, région `fra1`). L'apex redirige en 308 vers `www`. Cloudflare en « DNS seul », pas de proxy devant Vercel.
- Déploiement : la prod suit `main`, qui ne reçoit que des PR depuis `develop`. **Toute mise en prod passe par une PR `develop` vers `main`** : jamais de push direct sur `main`, jamais de `vercel --prod` à la main. Le contenu se met à jour avant le déploiement (voir `docs/REFONTE.md`).
- Prod sur la base Neon `instant_tranquille_v2`. L'ancienne `neondb` reste en lecture seule pour un retour arrière (`vercel rollback` puis `DATABASE_URL` sur `/neondb`). `DATABASE_URL` vient de l'intégration Neon : une resynchronisation peut la remettre sur `neondb`.
- Build Vercel = `next build`, ni migration ni seed. Contenu de prod : seed puis `apply-corrections` sur la base v2 (avec `SEED_ALLOW_REMOTE=1`), PUIS déploiement (le build lit le contenu ; un seed hors Vercel ne revalide pas le cache du site). Le seed ne remplit un global de page que si le champ est vide, d'où `apply-corrections.ts`.
- `.vercelignore` exclut `.env*`, `.claude`, `media`, `data`, `scripts/seed/assets` et remplace `.gitignore` pour le CLI : le garder complet.
- Quotas Hobby surveillés : écritures de cache de l'optimiseur d'images (au poids), Fast Origin Transfer, Blob Data Transfer. D'où : images en AVIF seul, qualité 75, largeurs 384, 640, 828, 1200, 1920, 2400 (`next.config.ts`, ne rien ajouter sans raison), `s-maxage` 1 an sur `/api/media/file`, données en cache 1 jour. Ne pas versionner les URL d'images par query string (variantes infinies pour l'optimiseur).
- Recadrer une photo dans l'admin garde son nom de fichier : l'ancienne image reste en cache. Redéposer la photo comme nouveau fichier.
- Photo de plus de 4,5 Mo refusée sur Vercel (pas de `clientUploads` sur le plugin Blob).
- `TURNSTILE_SECRET_KEY` obligatoire en production : sans elle, le formulaire refuse l'envoi.

## Architecture

- `src/payload.config.ts` : collections `Places` (lieux et temps de route), `Guides` (articles SEO), `OfficialSites`, `Amenities`, `Testimonials`, `ContactMessages`, `Media`, `Users`. Globals : une par page (`src/globals/pages/` : `HomePage`, `CottagePage`, `SurroundingsPage`, `GuidesPage`, `RatesPage`, `ContactPage`, fabriquées par `pageGlobal`), plus `SiteSettings` (faits de la maison, NAP, hôtes, plateformes, calendriers iCal, FAQ, écran d'entrée) et `PricingConfig`. Tout texte éditorial vit dans le CMS, localisé FR et EN ; les messages next-intl (`src/i18n/messages/{fr,en}/<namespace>.json`, fusionnés par `request.ts`) ne gardent que la microcopie d'interface.
- **Emails** : `contact@instant-tranquille.com` est la seule adresse affichée. Le Worker Cloudflare `infra/email-worker` notifie les hôtes à chaque message du formulaire (`contact/actions.ts`, via `after()`) et transfère les emails écrits à `contact@` ; destinataires dans son secret `CONTACT_NOTIFY_TO`. Adapter email Payload dans `src/lib/email/` (« mot de passe oublié », non testé). DMARC en `p=reject` et MTA-STS en `enforce` (`infra/mta-sts-worker`) : tout nouvel expéditeur au nom du domaine doit signer en DKIM aligné.
- **Admin** : composants dans `src/components/payload/`, style dans `src/styles/admin.css` (jamais dans `globals.css`), libellés français dans `src/lib/admin-translations.ts`. Après ajout d'un composant : `pnpm generate:importmap`. Pensé pour le téléphone des hôtes : barre d'onglets en bas (`TabBar`), listes en fiches (`ListCell`), aides au doigt (`Help`, fabriques dans `src/lib/admin-fields.ts`), résumé à l'accueil (`Dashboard.tsx`, chiffres dans `src/lib/admin-stats.ts`, chaque donnée une seule fois). Il reprend les tableaux du site (`Tableaux.tsx`) et la rose : `admin.css` importe les feuilles `sections/` nécessaires sous `.lit-tableau`, sans charger `globals.css`. Installable en application (`/admin/manifest.webmanifest`, icônes `public/icons/admin-*`, `src/lib/admin-app.ts`), sans service worker ni cache hors ligne. Session de 14 jours (`Users.ts`).
- **Automatisations** : `src/lib/routing/` (adresse d'un lieu, puis Nominatim et OSRM, mêmes arrondis que le seed ; le seed passe `context: { skipRouting: true }`), `src/lib/availability/` (calendriers iCal Airbnb et Booking, lus côté serveur, cache 2 h).
- `src/app/(frontend)/[locale]/` : `/`, `/le-gite`, `/les-alentours`, `/guides`, `/guides/[slug]`, `/tarifs-reservation`, `/contact`, `[...rest]` (404 localisée). Livret d'accueil supprimé (décision du client). Hors locale : `og/`, `llms.txt`, `llms-full.txt`, `sitemap.ts`, `robots.ts`, `manifest.ts`, `api/preview`.
- `src/components/` : `home/` (film du hero), `cottage/`, `surroundings/` (`DriveTimeRose`, cœur de la rose sans Tailwind ni shadcn, partagé avec l'admin, et `FilterableRose`, son enveloppe à filtres pour le site ; styles dans `sections/rose.css` ; carte, `Guide*.tsx`), `rates/`, `contact/`, `layout/`, `shared/` (`BookingButtons`, `Reviews`, `Faq`, `Photo`, `JsonLd`, `PhotoViewer`...), `ui/` (shadcn, ne pas modifier), `payload/`.
- `src/lib/` : `queries.ts` (accès Payload + `unstable_cache`, tags = slug), `seo.ts`, `jsonld.ts`, `places.ts` (géométrie de la rose), `platforms.ts`, `llms.ts`, `videos.ts`, `access.ts`, `revalidate.ts`.
- **`proxy.ts` = middleware next-intl de Next 16**, ne pas supprimer. Il réécrit toute URL sans point vers `/fr/...` : une route racine sans extension tombe en 404, d'où `/og/<locale>/<clé>.jpg` et `/apple-touch-icon.png`.
- **Routes racines** : un rewrite `afterFiles` de `next.config.ts` envoie tout premier segment inconnu vers la 404 localisée. Tout nouveau segment racine s'ajoute à `ROUTED_SEGMENTS`.
- **Raccourcis de réservation** : `/airbnb`, `/booking`, `/google` et `/gites-de-france` redirigent en 307 vers le lien de la plateforme saisi dans `SiteSettings` (`src/lib/platform-redirect.ts`, une route par raccourci dans `src/app/`), ou vers `/tarifs-reservation` si la plateforme n'est pas renseignée. Un nouveau raccourci s'ajoute aussi à `PLATFORM_SHORTCUTS` de `proxy.ts` et à `ROUTED_SEGMENTS`.
- `scripts/seed/` : un fichier par domaine, contenu dans `content/` (116 lieux, photos créditées dans `place-photos.ts`, 23 guides FR et EN dans `content/guides/`, textes des pages). Médias identifiés par leur `alt` français. Le seed est la source de vérité du contenu et met à jour les guides par slug.
- `public/videos/` : `hero*` (boucle muette), `film.mp4` (46 s, master 2560x1440), `film-1080.mp4`, `film-mobile.mp4` (verticale, sous-titrée), `film.vtt`, `film.en.vtt`, posters. `src/lib/videos.ts` lit le manifeste généré (`pnpm generate:videos`), pas le disque ; `videos.test.ts` compare le manifeste au disque. `FilmDialog` choisit la source à l'ouverture. Source du film : `../linstant-tranquille-film/` (HyperFrames ; les exports verticaux et sans voix, non servis par le site, sont dans son dossier `exports-site/`). Volume de départ à 30 % (comme l'écran d'entrée).
- **Écran d'entrée** : `src/components/layout/Opening*.tsx`, `src/styles/sections/ouverture.css` (étang à l'aube, le héron atterrit, pêche et s'envole vers l'emblème, 4,35 s, non bloquant, une fois par session). Rejouer : `?ouverture` ou le héron du pied de page. Rig du héron dans `shared/Logo.tsx`, séquences dans `mouvement.css` et `heron-repertoire.css`.
- **Guides** : onglet « En bref et sources » (`practical`, `checkedAt`, `sources`), blocs « Programme heure par heure » et tableaux. Règles dans `docs/guides/CHARTE.md`, modèle commenté dans `docs/guides/GUIDE-DE-REFERENCE.md`, questions pour les hôtes dans `docs/guides/QUESTIONS-PROPRIETAIRES.md`. Faits vérifiés et sourcés le jour même, temps de route OSRM uniquement, aucune fausse première personne.

## Design

- Thème **clair par défaut** (`.frontend-app`), sections sombres ponctuelles (`.section-sombre`). Palette Sologne dans `src/styles/globals.css` : brume, bouleau, étang, nuit, lumière, bruyère, fougère, roseau. Typo : Bricolage Grotesque et Newsreader, gardées malgré leur poids (identité du site, décision du client).
- **Tout le style vit dans le CSS global** (classes sémantiques en français : `.page`, `.section`, `.affiche`, `.chapeau`, `.liste-lieux`, `.defile`, `.tenture`...), Tailwind seulement pour le placement. Styles par page ou motif dans `src/styles/sections/`, importés par `globals.css`.
- Signature : la **rose des temps de route** (gîte au centre, lieux à leur vrai cap, anneaux de 15 min). Temps OSRM, jamais d'estimations. Sélection au point le plus proche du pointeur (`placeNear` dans `DriveTimeRose.tsx`) : ne pas remettre de survol par point.
- Motifs : tableaux des sections sombres avec parallaxe (`shared/Tableaux.tsx`, `Scenery.tsx`, `sombre.css`), cerf animé (`shared/Stag.tsx`, `cerf.css`, guide du brame), motifs des sections claires (`shared/Sketch.tsx`, `clair.css`), visionneuse de photos (`shared/PhotoViewer.tsx`, `visionneuse.css`), habillage des guides (`surroundings/Guide*.tsx`, `guides.css`). La classe des planches de guide est `.planche-guide` (`.planche` appartient à la page du gîte).
- **Pas de scroll-snap sur tactile** (retiré, ne pas le remettre).
- **Défilement** : toutes les sections de `#contenu` sont en `content-visibility: auto` ; `layout/SectionSizes.tsx` pose `data-mesure` deux frames au chargement et au changement de largeur pour mémoriser leurs vraies hauteurs. L'aimantation Lenis ignore les `.section-serree`. Pas d'animation pilotée par le défilement dans une carte de lieu (110 cartes sur `/les-alentours`) : toute nouvelle animation se mesure avec `scripts/scroll-bench.mjs`.
- Airbnb et Booking sont mis en avant partout via `BookingButtons` (données dans `SiteSettings`).
- Toute nouvelle page reprend les classes et composants existants (skill `frontend-design`). Le contenu reste rattaché au gîte : c'est sa vitrine, pas un site d'office de tourisme.
- Aucune photo à la licence douteuse : Galerie Capazza et Fondation du doute restent sans photo.
- **Responsive** : audité de 320 à 2560 px, téléphone couché compris. Jetons : `--gouttiere` (safe-area incluse), `--hauteur-barre` (barre de réservation mobile). La rose passe en mode compact par container query (58rem). Sous Hyprland la fenêtre ne se redimensionne pas : tester dans des iframes de même origine ou en headless (`--mute-audio`).

## SEO

- JSON-LD (`src/lib/jsonld.ts`) : un seul nœud complet du gîte (`#gite`, `VacationRental` + `LodgingBusiness`) sur `/` et `/le-gite`, références `@id` ailleurs ; `FAQPage`, `BreadcrumbList`, `Offer`, lieux (`TouristAttraction`), guides (`Article`). La note globale utilise la même fonction que l'affichage des avis.
- `pageMetadata` (`src/lib/seo.ts`) : canonical, hreflang, Open Graph, titre posé en `absolute` (pas de suffixe automatique). Titres de 60 caractères au plus, descriptions de 120 à 155.
- `robots.ts` autorise les robots IA ; `/llms.txt`, `/llms-full.txt`, `public/.well-known/ai-catalog.json`. Clé IndexNow : `public/<clé>.txt`, soumission par `scripts/indexnow.mjs`, déclenchée par la CI à chaque déploiement de production réussi (événement `deployment_status` de Vercel).
- Réponses de FAQ montées dans le HTML (`forceMount` dans `shared/Faq.tsx`).
- Cookie de langue next-intl désactivé. `X-Robots-Tag: noindex` sur `*.vercel.app`.
- Images de partage : `src/app/og/[locale]/[...key]/route.ts` sert `/og/fr/home.jpg`, `/og/en/guides/<slug>.jpg`... (1200x630, gabarit dans `src/lib/share-image/` : photo à gauche avec la carte de titre, à droite un tableau du site, écran d'entrée, étang ou forêt, capturé par `pnpm generate:share-scenes`, avec les chiffres clés de la page posés dessus ; textes dans `messages/*/share.json` ; incrémenter `SHARE_TEMPLATE_VERSION` à chaque changement de gabarit pour renouveler les caches). Icônes : `pnpm generate:icons`.
- Un seul `h1` par page. Chaque guide répond à une requête précise et cite ses temps de route.
- Faits à ne pas déformer : 115 m², 6 personnes, 3 chambres, 1 salle de bain. Le site FFE de Lamotte-Beuvron s'appelle le **Parc équestre fédéral** (le « Grand Parquet » est à Fontainebleau).

## Conventions

- **Contenu FR**, accents complets. Jamais de tiret cadratin ni demi-cadratin. Aucun commentaire dans le code hors directives d'outil.
- Props de composant = `interface` ; `type` réservé aux unions et `z.infer`. Pas de barrel. Contrôle cliquable = `Button` shadcn. Markup minimal.
- **Pas de DDD ici** : le métier de ce repo est éditorial.

## Pièges

- **Cache du front** : `unstable_cache` (1 jour) survit au redémarrage (`.next/dev/cache/fetch-cache`) et un seed ne l'invalide pas. Pour voir un contenu modifié, l'enregistrer par l'admin ou l'API REST de Payload (les hooks `afterChange` revalident).
- **Pas de retouche SQL du contenu** : elle contourne la revalidation et le seed la réécrase.
- **Push de schéma** : drizzle pose une question et gèle le serveur de dev quand une colonne à supprimer contient des données.
- **Profondeur des requêtes** : `getGuideBySlug` est en `depth: 2`, sinon les lieux d'un guide n'ont plus leur photo. La profondeur fait partie de la clé de cache.
- **Écran d'entrée** : il ne se lance pas dans une iframe (`self !== top`). Pour le tester en iframe, poser `data-ouverture` sur `<html>`. Son bloqué par l'autoplay : le premier geste lance l'envol avant le son (connu).
- **Calendriers iCal** : champs privés de `SiteSettings`, vides tant que les hôtes n'ont pas fourni leurs liens ; la section des disponibilités est alors absente du site.
- **Tests terrain** jamais faits sur vrai téléphone, Safari ni Firefox (voir `docs/REFONTE.md`).

## Variables d'environnement

`DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL` (vrai domaine en prod),
`BLOB_READ_WRITE_TOKEN`, `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (posées sur
Vercel, Production et Preview). Optionnelles : `PREVIEW_SECRET`, `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD`, `SEED_ALLOW_REMOTE`. Emails : `EMAIL_WORKER_URL` et `EMAIL_WORKER_SECRET`
(Vercel, Production et Preview).

## État et feuille de route

Voir **`docs/REFONTE.md`** (état de la prod, procédures, reste à faire).


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
