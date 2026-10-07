# Refonte Sologne : état au 7 octobre 2026

Travail sur `develop`, la prod suit `main` (PR #1 fusionnée le 7 octobre 2026).

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
- Cloudflare (zone `instant-tranquille.com`) : DNS seul, DNSSEC actif, SPF, DKIM, DMARC
  `p=reject; sp=reject` avec rapports (DMARC Management), MTA-STS en mode `enforce`, 7 jours
  (`infra/mta-sts-worker`). Alignement prouvé le 7 octobre 2026 sur un envoi du binding
  `send_email` reçu dans Gmail : `dkim=pass` au nom du domaine, `spf=pass`, `dmarc=pass`. Pas de CAA : la liste des autorités de Vercel et de Cloudflare n'est
  pas certaine, un CAA incomplet bloquerait un renouvellement de certificat.
- Emails : `contact@instant-tranquille.com` est la seule adresse affichée. Le Worker
  `instant-tranquille-email` (`infra/email-worker`) est le répartiteur unique : il notifie les
  hôtes à chaque message du formulaire et transfère les emails écrits à `contact@`. Les
  destinataires sont dans son secret `CONTACT_NOTIFY_TO`. Le plan gratuit n'envoie qu'aux adresses
  vérifiées dans Email Routing : celles de Karine et d'Erick le sont, toutes deux dans le secret.
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
  segment racine s'ajoute à `ROUTED_SEGMENTS` dans `src/lib/root-routes.ts`.
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
3. Ne rien fusionner dans `main` entre-temps : cela redéploierait le nouveau code sur l'ancienne
   base.

### Photos

- Recadrer une photo dans l'admin garde son nom de fichier : l'ancienne image reste en cache.
  Redéposer la photo comme nouveau fichier.
- Au-delà de 4,5 Mo, l'upload est refusé sur Vercel (voir `clientUploads` plus bas).

### Mettre en prod les fonctions Payload (branche `feat/payload-fonctions`)

Corbeille, anciennes adresses, publication programmée, réglages du formulaire, export en tableur.
Le schéma change : 7 tables, 18 colonnes et 14 types `enum` en plus, rien de retiré ni de modifié.
Le site en ligne ignore ces ajouts, le script peut donc passer avant le déploiement.

1. Neon : créer une branche de `instant_tranquille_v2` (sauvegarde et répétition). Y rejouer
   `psql "<url de la branche>" -v ON_ERROR_STOP=1 -f scripts/schema/fonctions-payload.sql`.
   Le script est une seule transaction : une erreur n'applique rien.
2. Même commande sur la base de prod. Le script part du schéma de `develop` : si d'autres
   changements de schéma attendent sur `develop`, les passer d'abord.
3. Vercel, Production : poser `CRON_SECRET` (32 caractères aléatoires au moins). Sans elle, la
   route des publications programmées refuse tout appel et rien ne paraît.
4. PR `develop` vers `main`. Après le déploiement, Vercel doit lister une tâche planifiée
   `/api/payload-jobs/run` à 3 h UTC.
5. Aussitôt après : recréer les 6 redirections des guides fusionnés, qui ne sont plus dans
   `next.config.ts`. Soit à la main dans « Réglages », « Anciennes adresses » (liste dans
   `RETIRED_GUIDES`, `scripts/seed/content/guides`), soit par
   `SEED_ALLOW_REMOTE=1 pnpm exec tsx scripts/seed/apply-corrections.ts`, qui réimpose aussi les
   textes des pages : à éviter si les hôtes les ont retouchés.
6. Vérifier : `curl -I https://www.instant-tranquille.com/guides/hebergement-cavaliers-lamotte-beuvron`
   rend 308, `/api/payload-jobs/run` rend 401 sans le secret, `/api/mcp` rend 404.

Retour arrière : `vercel rollback`. Les tables et colonnes ajoutées peuvent rester, l'ancien code
ne les lit pas. Les 6 redirections reviennent avec l'ancien `next.config.ts`.

### Mettre en prod les prix de base (fait le 7 octobre 2026)

En ligne : script SQL appliqué, prix et textes écrits, pages contrôlées. Reste à faire : supprimer les
objets morts listés plus bas une fois la bascule validée, et demander aux hôtes si le prix change
selon la saison (la question est vidée en attendant). La marche suivie, pour mémoire :

Le site n'affiche plus de totaux recopiés des plateformes mais le prix de base par nuit fixé par
les hôtes (100, 110 et 120 € pour 2, 4 et 6 voyageurs). Il ne calcule aucun total de séjour : les
frais de service, la taxe de séjour et la remise à la semaine restent l'affaire d'Airbnb et de
Booking. Le schéma gagne 2 tables et 2 types `enum`, rien n'est retiré ni modifié.

1. `psql "<url de prod>" -v ON_ERROR_STOP=1 -f scripts/schema/prix-de-base.sql` (une transaction).
   Le site en ligne ignore ces tables : le script peut passer avant le déploiement.
2. PR `develop` vers `main`. Tant que les prix ne sont pas saisis, le nouveau code n'affiche aucun
   prix (ni faux prix, ni erreur) et le résumé de l'admin le signale.
3. Aussitôt après, dans l'admin : « Tarifs et conditions », onglet « Prix de base », saisir les
   3 lignes et vider « Le prix change-t-il selon la saison ? » ; puis les textes de l'accueil et
   de la page des tarifs, en français et en anglais (valeurs dans `scripts/seed/content/pages.ts`).
   Ou `SEED_ALLOW_REMOTE=1 pnpm exec tsx scripts/seed/apply-corrections.ts`, qui écrit les prix
   et ces textes mais ne revalide pas le cache du site : réenregistrer ensuite les 3 écrans dans
   l'admin.
4. Vérifier `/tarifs-reservation`, `/`, `/le-gite` et `/llms-full.txt`.

Objets morts après la bascule, que le code ne lit plus : tables `pricing_config_quotes` et
`_pricing_config_v_version_quotes`, colonnes `pricing_config.quoted_on` et
`_pricing_config_v.version_quoted_on`, types `enum_pricing_config_quotes_guests`,
`enum_pricing_config_quotes_nights`, `enum__pricing_config_v_version_quotes_guests` et
`enum__pricing_config_v_version_quotes_nights`. Ils gardent les anciens relevés et permettent le
retour arrière (`vercel rollback`) ; à supprimer à la main une fois la bascule validée.

Base locale : `pnpm dev` pose une question (créer ou renommer un type) et se fige, parce que
drizzle voit des objets à retirer. Avant de le lancer, rejouer `scripts/schema/prix-de-base.sql`
sur la base locale puis y supprimer à la main les objets morts listés ci-dessus.

### Brancher un assistant (MCP)

Coupé par défaut. À n'ouvrir que le temps d'un usage voulu : l'assistant écrit dans le contenu de
production, et une modification paraît aussitôt (sauf guide enregistré en brouillon).

1. Une fois : `psql "<url de prod>" -v ON_ERROR_STOP=1 -f scripts/schema/assistant.sql` (1 table,
   1 colonne), après le script précédent.
2. Vercel, Production : `MCP_ENABLED=1`, puis redéployer.
3. Dans l'admin, ouvrir `/admin/collections/payload-mcp-api-keys`, créer une clé, cocher ce que
   l'assistant peut lire et modifier, copier la clé. Elle agit au nom du compte qui l'a créée.
4. Claude Code : `claude mcp add --transport http instant-tranquille
   https://www.instant-tranquille.com/api/mcp --header "Authorization: Bearer <clé>"`.
   Claude Desktop : passer par `npx mcp-remote <url> --header "Authorization: Bearer <clé>"`.
   claude.ai et l'application mobile : connecteur personnalisé, à condition qu'il accepte un
   en-tête d'autorisation (non essayé).
5. Couper : supprimer la clé (effet immédiat), ou vider `MCP_ENABLED` et redéployer.

Portée : lieux, guides, avis, équipements, sites officiels, pages, réglages et tarifs en lecture
et écriture, photothèque en lecture seule. Jamais les comptes, les messages des voyageurs ni les
liens des calendriers. Ni suppression, ni corbeille, ni modification de plusieurs fiches à la fois.

## Reste à faire

### Priorité haute

- **Email entrant** : le transfert d'un vrai email écrit à `contact@` n'a jamais été testé (le
  formulaire, lui, l'est : notification marquée « delivered »).
- **Mentions légales** : en ligne, mais sans nom de famille ni statut des hôtes (SIRET éventuel) ni
  durée de conservation chiffrée, et non relues par un juriste.
- **Plan Vercel à régulariser** (Hobby en prod, quotas surveillés).
- **Fiche Google Business** : absente, c'est le principal manque pour le référencement local.

### Priorité moyenne

- **Rapports DMARC** : à lire vers le 21 octobre 2026 (Cloudflare, Email, DMARC Management).
  Tout nouvel expéditeur au nom du domaine doit signer en DKIM aligné, sinon `p=reject` le fait
  refuser. Retour arrière : remettre `p=quarantine` dans le TXT `_dmarc`.
- **MTA-STS** : toute modification de la politique (`src/index.ts` du Worker, `wrangler deploy`)
  demande un nouvel `id` dans le TXT `_mta-sts`. Retour arrière : `mode: testing`.
- **Réputation** : Google Postmaster Tools et listes noires (Spamhaus, MXToolbox) jamais consultés.
- **Son de l'écran d'entrée** : il ne démarre pas quand l'autoplay est bloqué (le premier geste
  lance l'envol avant le son).
- **Upload de plus de 4,5 Mo** : activer `clientUploads` sur le plugin Blob.
- **Fonctions Payload** (corbeille, anciennes adresses, publication programmée, formulaire,
  export, assistant) : essayées en local seulement, bascule de prod à faire (procédure plus haut).
- **Publication programmée** : au jour près, le matin (une tâche par jour sur le plan Hobby). Une
  heure précise demande un déclencheur externe (Worker Cloudflare ou GitHub Actions).
- **Assistant (MCP)** : jamais essayé sur Vercel (le plugin charge le compilateur TypeScript à
  l'exécution) ni depuis claude.ai. Pas de limite de débit sur `/api/mcp`. L'écran des clés reste
  en anglais, hors du menu des hôtes.
- **Recherche dans tout l'admin** : non faite. Le plugin `search` de Payload indexe pour le site
  public, il n'ajoute pas de recherche à l'admin ; chaque liste a déjà la sienne.
- **Autres recoupements de guides**, non fusionnés : week-end et villages, famille et jours de
  pluie, Chambord et Amboise avec l'itinéraire des châteaux.
- **Restaurant italien près de la Halle** : laissé sans nom (les annuaires hésitent entre deux).
- **Temps de route** : quelques minutes d'écart entre le guide « venir » et les temps OSRM de
  `src/lib/places.ts`.
- **Questions aux hôtes** : décision du client, ne pas relancer. Les voyageurs écrivent par la
  messagerie des plateformes ou le formulaire (`docs/guides/QUESTIONS-PROPRIETAIRES.md`).

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
