# Refonte Sologne : état au 7 octobre 2026

Branche `refactor/redesign-sologne`. Rien n'est commité : la prod vient de l'arbre de travail.

## État : ce qui est en production

- Site : https://www.instant-tranquille.com (l'apex redirige en 308 vers `www`), projet Vercel
  `instant-tranquille`, équipe `ei-axel-hamilcaro`, plan Hobby, région `fra1`.
- Base : Neon `instant_tranquille_v2`. L'ancienne `neondb` est conservée en lecture seule.
- Design repris de zéro : thème clair, palette Sologne, film en hero, rose des temps de route,
  écran d'entrée (le héron), tableaux animés des sections sombres, cerf du guide du brame,
  visionneuse de photos, habillage des guides.
- CMS : une global par page, collections `Places` (116 lieux, temps OSRM) et `Guides` (23 guides,
  FR et EN), plateformes et notes dans `SiteSettings`. Livret d'accueil supprimé.
- SEO et GEO : un nœud JSON-LD complet du gîte (`#gite`), canonical, hreflang, sitemap,
  `llms.txt`, `ai-catalog.json`, robots IA autorisés, IndexNow, FAQ dans le HTML.
- Contact : formulaire Turnstile, messages lisibles dans l'admin.
- Cloudflare (zone `instant-tranquille.com`) : DNS seul, DNSSEC actif, DMARC `p=quarantine`,
  Email Routing `contact@instant-tranquille.com` vers l'adresse de Karine. L'adresse d'Erick est
  créée mais pas vérifiée (deux destinataires demanderont un Email Worker).
- Vérifié : responsive sur 20 pages x 23 formats de 320 à 2560 px (Playwright headless et iframes
  de même origine, car Hyprland ne redimensionne pas la fenêtre), passe lean UI, Lighthouse sur
  les 70 URL.

## Décisions et pourquoi

- **Polices Bricolage Grotesque et Newsreader conservées** malgré leur poids : identité du site.
- **Pas de proxy Cloudflare devant Vercel** tant que les compteurs ne remontent pas.
- **Aucune photo à la licence douteuse** : Galerie Capazza et Fondation du doute restent sans photo.
- **Pas de scroll-snap sur tactile** : retiré, ne pas le remettre.
- **Livret d'accueil supprimé** (décision du client).
- **Images en AVIF seul, qualité 75, largeurs 384, 640, 828, 1200, 1920, 2400** : les quotas
  Hobby (écritures de cache de l'optimiseur, comptées au poids, Fast Origin Transfer, Blob Data
  Transfer) sont surveillés. Ne rien ajouter sans raison. `s-maxage` 1 an sur `/api/media/file`,
  données en cache 1 jour, calendriers iCal 2 h.
- **Pas de version d'image par query string** : ouvre l'optimiseur à des variantes infinies.
- **Manifeste vidéo** : `src/lib/videos.ts` ne lit plus le disque à l'exécution.
- **Schéma sans migrations** : Payload pousse le schéma seulement sur une base locale
  (`push: isLocalDatabase`). La prod ne reçoit jamais de push automatique.
- **Un seul nœud JSON-LD du gîte** (`#gite`) sur `/` et `/le-gite`, `@id` ailleurs : pas de doublon
  d'entité. Note globale calculée par la même fonction que le JSON-LD.
- **Rewrite `afterFiles`** : tout premier segment inconnu part vers la 404 localisée. Tout nouveau
  segment racine s'ajoute à `ROUTED_SEGMENTS` dans `next.config.ts`.
- **Titres à 60 caractères au plus** (posés en `absolute`), descriptions de 120 à 155.
- **Cookie de langue next-intl désactivé** ; `X-Robots-Tag: noindex` sur `*.vercel.app`.

## Procédures

### Mettre à jour le contenu de prod

1. `.env.local` vers la base locale `lit_v2` pour les essais (`grep -c "127.0.0.1:5546" .env.local`
   rend 1), tester le seed en local.
2. Sur la base v2 de prod : `SEED_ALLOW_REMOTE=1 pnpm seed`, puis
   `SEED_ALLOW_REMOTE=1 pnpm exec tsx scripts/seed/apply-corrections.ts` (le seed ne remplit les globals de
   pages que si le champ est vide, `apply-corrections.ts` impose les textes).
3. Déployer ensuite : le build lit le contenu. Un seed lancé hors de Vercel ne revalide pas le
   cache du site.
4. Après le déploiement : `node scripts/indexnow.mjs`.

### Déployer

1. `node_modules/.bin/tsc --noEmit && node_modules/.bin/biome check`, puis `bun test src`.
2. Après tout ajout ou retrait dans `public/videos` : `pnpm generate:videos`.
3. `vercel deploy --prod --yes --force` depuis l'arbre de travail. Build = `next build`, ni
   migration ni seed.
4. `.vercelignore` doit rester complet (`.env*`, `.claude`, `media`, `data`, `scripts/seed/assets`) :
   il remplace `.gitignore` pour le CLI.
5. `node scripts/indexnow.mjs`.

### Retour arrière

1. `vercel rollback` vers le déploiement précédent.
2. Remettre `DATABASE_URL` sur `/neondb` (base conservée en lecture seule). Elle est gérée par
   l'intégration Neon : une resynchronisation peut la remettre sur `neondb`, vérifier après coup.
3. Ne pas pousser sur `main` entre-temps : `main` est en retard et redéploierait l'ancien code sur
   la nouvelle base.

### Photos

- Recadrer une photo dans l'admin garde son nom de fichier : l'ancienne image reste en cache.
  Redéposer la photo comme nouveau fichier.
- Au-delà de 4,5 Mo, l'upload est refusé sur Vercel (voir `clientUploads` plus bas).

## Reste à faire

### Priorité haute

- **Commit et PR vers `main`** : la prod tourne sur du code non versionné, `main` est en retard.
- **Aucun envoi d'email** : pas d'adapter email Payload. Les messages de contact ne se voient que
  dans l'admin, « mot de passe oublié » n'envoie rien. Choix du service à faire par Axel.
- **Mentions légales et politique de confidentialité absentes**, alors que le formulaire de contact
  collecte nom, email et téléphone. À rédiger avec les informations des hôtes (identité de
  l'éditeur, contact, hébergeur, durée de conservation des messages), jamais inventées, puis à
  lier depuis le pied de page et sous le formulaire.
- **Plan Vercel à régulariser** (Hobby en prod, quotas surveillés).
- **Réponses des hôtes** : 62 questions en attente pour Erick et Karine
  (`docs/guides/QUESTIONS-PROPRIETAIRES.md`). Une FAQ pratique du gîte en dépend.

### Priorité moyenne

- **Son de l'écran d'entrée** : il ne démarre pas quand l'autoplay est bloqué (le premier geste
  lance l'envol avant le son).
- **Upload de plus de 4,5 Mo** : activer `clientUploads` sur le plugin Blob.
- **Adresse d'Erick** : la vérifier, puis prévoir un Email Worker pour deux destinataires.
- **Fiche Google Business** : absente.
- **Guides qui se chevauchent** sur « dormir à Lamotte-Beuvron » : fusions prévues par la charte
  (`docs/guides/CHARTE.md`).
- **Temps de route** : quelques minutes d'écart entre le guide « venir » et les temps OSRM de
  `src/lib/places.ts`.

### Priorité basse

- **7 lieux sans photo** : 5 faute d'image libre (`site-de-baltan`, `ecurie-de-la-coliniere`, `sables-de-nancay`, `maison-de-reuilly`, `golf-de-la-carte`), 2 volontairement (Galerie Capazza, Fondation du doute).
- **Slugs des guides anglais** encore en français.
- **Vidéo** : le film est monté à partir des photos, de vrais plans filmés le remplaceraient.
- **Cloudflare** : envisager le proxy si les compteurs Vercel remontent.

## Validations à faire sur vrai téléphone

Jamais testé sur appareil réel, ni sur Safari et Firefox :

- Écran d'entrée (animation, son, une fois par session).
- Film : lecture, modale, volume, sous-titres.
- Parallaxe des sections sombres.
- Défilement vers les ancres sur iOS.
- Turnstile au focus du formulaire de contact.
- Responsive, téléphone couché compris.
