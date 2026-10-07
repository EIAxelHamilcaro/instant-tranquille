# Charte des guides de séjour, L'Instant Tranquille

Version du 7 octobre 2026. À lire en entier avant d'écrire un guide. Exemple commenté : `GUIDE-DE-REFERENCE.md` (même dossier). Quatre guides suivent déjà cette charte, à ouvrir comme modèles : `scripts/seed/content/guides/que-faire-a-romorantin-lanthenay.ts` (itinéraire court), `chateaux-de-la-loire-depuis-romorantin.ts` (itinéraire large), `que-faire-en-sologne-quand-il-pleut.ts` (sélection thématique), `brame-du-cerf-en-sologne.ts` (saisonnier).

Dans ce document, `SG` désigne ce dossier (`scratchpad/guides/`) et le repo est `/home/axel/DEV/clients/linstant-tranquille`.

## 1. Diagnostic des anciens guides (pourquoi on réécrit)

1. Des itinéraires sans heures, sans durée de visite, sans ordre justifié : impossible à suivre tel quel.
2. Aucun prix, sauf celui du gîte, répété dans les 28 guides (« 130 € la nuit »).
3. Aucune adresse pour manger, aucun parking, aucune règle de réservation.
4. « Voir le site officiel » à la place de l'information.
5. Un h2 « Pourquoi loger à Romorantin » dans 20 guides : de la publicité, pas un guide.
6. Des aveux de non-vérification dans le texte, et des promesses de titre non tenues (« 18 idées »).
7. Un ton de brochure, des superlatifs, une fausse proximité (« notre adresse préférée »).
8. Des guides qui se répètent et se concurrencent sur la même requête (bateaux, Lamotte-Beuvron, châteaux).
9. Des temps de route qui varient d'un guide à l'autre, et une durée à pied vers le centre qui changeait d'un guide à l'autre. Depuis le 7 octobre 2026, la formule unique est « 1 km à pied, une dizaine de minutes » (1 km mesuré par OSRM, 5 à 10 min selon les hôtes).
10. Un anglais traduit mot à mot, qui n'explique rien à un visiteur étranger.

À garder des anciens guides : les temps de route OSRM et les sujets brame, étangs, vélo, venir, chien, croisière à Chenonceau.

## 2. Les 5 principes

1. **Utilisable sans autre onglet.** Heures, durées, prix, adresses, jours de fermeture, parking, réservation sont dans le guide.
2. **Tout fait est sourcé le jour où on l'écrit.** Site officiel d'abord, office de tourisme ensuite, jamais la mémoire. Invérifiable = supprimé, ou dit comme tel (« nous n'avons pas pu vérifier »).
3. **Voix honnête.** Deuxième personne. Pas de faux vécu, pas de « nous avons adoré ». Une estimation de l'auteur est annoncée comme estimation.
4. **Le gîte est le point de départ, pas le sujet.** Une mention utile dans l'introduction (temps depuis la maison), un lien vers `/le-gite` et `/tarifs-reservation` en fin de guide, rien d'autre. Jamais le prix de la nuit. La première mention du gîte dans le chapeau, dans « L'essentiel en bref » et dans le corps le nomme : « le gîte L'Instant Tranquille, à Romorantin-Lanthenay » (« L'Instant Tranquille cottage in Romorantin-Lanthenay »), une fois par bloc, pour que la phrase reste compréhensible citée seule.
5. **Un guide = une requête = une réponse dès le premier paragraphe.** Pas deux guides sur la même requête.

## 3. Gabarit

Ordre des blocs sur la page (le gabarit du site s'en charge) : titre, chapeau (`excerpt`), « L'essentiel en bref » (`practical`), corps (`body`), lieux du guide, FAQ, « Sources et sites officiels », guides liés.

### Champs communs (obligatoires partout)

| Champ | Règle | Limite |
| --- | --- | --- |
| `title` | La requête, puis la promesse tenue. Pas de nombre que le texte ne tient pas. | 90 car. |
| `excerpt` | La réponse complète en 2 ou 3 phrases, avec au moins 2 chiffres. Sert de chapeau et de carte. | 240 car. |
| `metaTitle`, `metaDescription` | Par langue. Titre 60 car. au plus, description 120 à 155 car. : une vraie phrase avec la requête, le chiffre clé, l'année et Romorantin. Aucun doublon entre pages. | |
| `practical` | 4 à 6 lignes : Durée, Meilleurs jours ou Quand, À éviter, Budget, À réserver, Sur la route (ou Péage, Avec des enfants). | libellé 40, valeur 180 |
| `checkedAt` | Date de la vérification réelle, `"2026-10-06"`. Ne jamais la rafraîchir sans avoir tout revérifié. | |
| `sources` | 8 à 16 pages précises (pas des pages d'accueil), nom FR et EN. | nom 90 |
| `places` | Les lieux réellement décrits, 5 à 14, clés de `scripts/seed/content/places.ts`. | |
| `body` | Premier paragraphe = la réponse. h2 et h3 sous forme de vraies questions quand c'est naturel. Un seul h1 (le titre, déjà rendu). | |
| `faq` | 5 questions que les gens posent vraiment, réponses autonomes de 2 à 4 phrases avec chiffres. Pas de redite mot pour mot du corps. | question 140, réponse 600 |

### Sections du corps par type de guide

| Section | Itinéraire | Sélection thématique | Guide pratique | Saisonnier, événement |
| --- | --- | --- | --- | --- |
| Introduction : réponse, pour qui, combien de temps | oblig. | oblig. | oblig. | oblig. |
| Tableau comparatif (lieux par temps de route, prix, ouverture) | si plus de 2 jours | oblig. | option | option |
| Programme heure par heure (bloc `programme`) | oblig., un par jour | 1 journée type | non | oblig. (le jour J) |
| Dates, horaires, jours de fermeture datés | oblig. | oblig. | oblig. | oblig., avec « quand réserver » |
| Où manger : adresses réelles, rue, jours de fermeture | oblig. | option | option | option |
| Budget : tableau des tarifs, total par adulte | oblig. | dans le tableau | option | oblig. |
| Parking, péage, accès | oblig. | par lieu | oblig. | oblig. |
| Plan B pluie | oblig. (ou lien vers le guide pluie) | sans objet | option | oblig. |
| Enfants, chiens, poussettes, accessibilité | oblig. | oblig. | selon sujet | oblig. |
| Quand venir, quand éviter | oblig. | oblig. | oblig. | c'est le sujet |
| Règles, pièges, ce qui déçoit | option | 1 section honnête (ex. Beauval sous la pluie) | oblig. | oblig. |
| Liens internes de fin, gîte, tarifs | oblig. | oblig. | oblig. | oblig. |

Longueur visée : 1 200 à 2 000 mots par langue. 2 à 5 tableaux au plus, 3 ou 4 colonnes (4 au maximum, pour rester lisible à 320 px).

## 4. Ton et style

- Phrases courtes, verbe au présent ou à l'impératif (« Garez-vous au P0 »). Une information par phrase.
- Chiffres en chiffres, avec unité et espace : `43 min`, `40 km`, `21 €`, `9 h 30`, `1 h 30`, `115 m²`. En anglais : `€21`, `9.30 am`, `1 hr 30`, `12 noon`, km suivis des miles pour les distances de plus de 50 km.
- Accents complets. Jamais de tiret cadratin ni demi-cadratin, y compris en anglais : virgule, deux-points ou parenthèses. Pas d'emoji.
- Mots interdits : incontournable, magnifique, charme, pépite, écrin, niché, véritable, authentique, idéal, parfait, à couper le souffle, havre de paix. Remplacer par le fait (« meublé, habité par la même famille depuis 6 siècles »).
- Pas de première personne du singulier, pas de souvenir inventé. « Nous » seulement pour le site (« notre guide », « notre estimation »).
- Dater ce qui bouge : « tarif 2026 », « jusqu'au 1er novembre 2026 », « vérifié en octobre 2026 ».
- Dire ce qui ne va pas : fermé le mardi, complet des mois avant, payant, loin, décevant sous la pluie.
- Faits du gîte à ne pas déformer : 115 m², 6 personnes, 3 chambres, 1 salle de bain, 23 rue de Loreux, jardin clos, 1 place de parking (et des places dans la rue), ni prise ni borne pour voiture électrique, la Halle à 1 km à pied, une dizaine de minutes. Le site FFE de Lamotte-Beuvron s'appelle le Parc équestre fédéral.
- Liens : le nom du lieu porte le lien vers son site officiel, à sa première mention utile. 3 à 6 liens internes par guide, dans des phrases qui en donnent la raison.

### Anglais

Anglais britannique, réécrit pour un visiteur étranger, mêmes faits, mêmes chiffres. Ajouter ce qu'un Français sait déjà : le déjeuner se sert de 12 h à 14 h, les sites ferment à midi en hiver, bonnet de bain obligatoire en piscine, péage, tarif de Chambord différent hors Espace économique européen (31 €), zones de vacances scolaires, pas de droit de passage en forêt privée. Vocabulaire : cottage (le gîte), pushchair, car park, lead, book ahead, ground floor, autumn. Noms propres français gardés, expliqués une fois (« the Halle, the covered market hall »). Liens internes en `/en/guides/<slug>`, `/en/the-cottage`, `/en/rates-booking`, `/en/surroundings`. Liens externes vers la version anglaise du site officiel seulement si elle existe et répond 200.

## 5. Vérification et sources

1. **Avant d'écrire**, créer `SG/sources/<slug>.md` : un tableau `Affirmation | Valable pour | URL | Extrait lu | Consulté le`, puis deux sections « Non vérifié / contradictoire » et « Trouvailles utiles ».
2. **Lire la page, pas un résumé.** `SG/research/find.sh "<URL>" "<regex>" [max]` renvoie le texte brut qui matche (ex. `find.sh https://www.chenonceau.com/infos-pratiques/tarifs/ "dulte.\{0,100\}"`). Un résumé d'outil de recherche ou de WebFetch ne compte pas comme vérification pour un prix, un horaire ou une date : relire avec `find.sh`. Les sites en JavaScript (Chaumont, bloischambord.com en français) ne se lisent pas ainsi : essayer la version anglaise, sinon le noter dans « Non vérifié en direct ».
3. **Ordre des sources** : site officiel du lieu, puis office de tourisme ou mairie, puis organisme public (ONF, OFB, Météo-France). Michelin pour l'existence et le style d'un restaurant, le site du restaurant pour ses jours d'ouverture. Wikipédia seulement pour un fait historique, signalé « source secondaire ». Jamais un blog, jamais la mémoire.
4. **Invérifiable = supprimé.** Si l'information manque au lecteur (péage A85, durée de visite), l'écrire : « Nous n'avons pas pu vérifier le tarif 2026 ». Une durée estimée s'écrit « notre estimation ».
5. **Temps de route : OSRM uniquement, jamais d'estimation.**
   - Gîte vers un lieu existant : `driveMin` et `driveKm` de `scripts/seed/content/places.ts`.
   - Entre deux étapes ou lieu nouveau : `node SG/tools/routes.mjs "label|lat,lng|lat,lng"` (voiture) ou `"label|lat,lng|lat,lng|foot"` (à pied). Arrondi `Math.round`. Coordonnées du gîte : `47.360803,1.7533421`.
   - Autoroute sur le trajet : `node SG/tools/refs.mjs "label|lat,lng|lat,lng"` liste les km d'autoroute. Ne jamais écrire « sans péage » sans ce contrôle.
   - Géocodage : `node SG/tools/routes.mjs --geocode "adresse"` (Nominatim, 1 requête par seconde, User-Agent identifiant déjà réglé).
   - Vérifier les additions (total km, total minutes, budget) à la main, les noter dans le fichier de sources.
6. **Restaurants** : nom, numéro et rue, style en 3 mots, jours de fermeture. Pas de prix de menu sans page officielle datée. 2 à 5 adresses par guide.
7. **Liens** : en fin de rédaction, tester tous les liens sortants (code HTTP 200 après redirection) et tous les liens internes sur `localhost:3210`. Voir la procédure en 7.
8. **Questions pour Erick et Karine** : tout ce que seul un habitant sait (où se garer, quelle boulangerie, quel étal) ne s'invente pas. Les réponses reçues sont dans `QUESTIONS-PROPRIETAIRES.md` : les reprendre sobrement, sans en déduire autre chose. Sans réponse, le site n'écrit rien et renvoie vers les hôtes : « posez la question à Erick et Karine par la messagerie d'Airbnb ou de Booking, ou par le formulaire de contact ». Décision du client : ne pas relancer les hôtes.

## 6. Ajouter un lieu

N'ajouter un lieu que si le guide le décrit vraiment et qu'aucun des 116 existants ne convient. Vérifier d'abord : `grep -n 'key: "' scripts/seed/content/places.ts`.

1. Coordonnées : celles de l'entrée ou du parking visiteurs, via `routes.mjs --geocode`, recoupées avec le site officiel.
2. `driveMin`, `driveKm` : `routes.mjs` depuis le gîte.
3. Entrée dans `scripts/seed/content/places.ts` : `key`, `name`, `nameEn` si différent, `category`, `commune`, `lat`, `lng`, `driveKm`, `driveMin`, `website` (testé 200), `summary` et `summaryEn` d'une phrase factuelle.
4. Photo obligatoire, sous licence libre (Wikimedia Commons : CC0, CC BY, CC BY-SA, domaine public), jamais générée. Fichier `scripts/seed/assets/places/<key>.webp` en 2400 x 1600. Entrée dans `PLACE_PHOTOS` (`scripts/seed/content/place-photos.ts`) : `file`, `altFr`, `altEn`, `author`, `license`, `sourceUrl`, `focalX`, `focalY`. Copier la forme d'une entrée voisine champ par champ.
5. Après le seed, la ligne `Photos ready: N` doit égaler `Places ready: N`.

## 7. Procédure technique

### Sécurité, à relire à chaque session

- `.env` pointe sur la base de **production**. Ne jamais y toucher, ne jamais définir `SEED_ALLOW_REMOTE`. Avant toute commande qui charge Payload : `grep -c "127.0.0.1:5546" .env.local` doit répondre `1`.
- Le serveur de dev tourne sur `http://localhost:3210` et sert à d'autres : ne pas le relancer, ne pas le tuer, pas de `next build`, ne pas supprimer le cache.
- Ne rien commiter. `trash`, jamais `rm -rf`. Navigateur headless avec `--mute-audio` (déjà dans `shot.mjs`).

### Écrire le contenu

Un fichier par guide : `scripts/seed/content/guides/<slug>.ts`, exporté dans `scripts/seed/content/guides.ts`. Forme : `SeedGuide` (`scripts/seed/guides.ts`). Le corps est une liste de blocs (`scripts/seed/rich-text.ts`) :

```ts
"Un paragraphe simple.",
["Un paragraphe avec ", { text: "un lien", href: "https://..." }, " et ", { text: "du gras", bold: true }, "."],
{ h2: "Une question ?" },
{ h3: "Une sous-question ?" },
{ list: [[{ text: "Libellé", bold: true }, ", suite de la puce."], "Puce simple."] },
{ table: { head: ["Lieu", "Adulte", "Enfant"], rows: [["Musée", "6 €", "4 €"]] } },
{ programme: [{ time: "9 h 00", title: "Marché de la Halle", details: "1 km à pied depuis le gîte, une dizaine de minutes." }] },
```

Limites validées par Payload : `time` 20, titre d'étape 90, `details` 420, 2 étapes au minimum par programme. Une cellule de tableau accepte du texte ou des segments avec lien. Contrôle des limites et des tirets : `node_modules/.bin/tsx SG/tools/lint-guide.mts <slug> [<slug>...]` doit répondre `OK`.

### Publier en local et voir le résultat

```bash
cd /home/axel/DEV/clients/linstant-tranquille
node_modules/.bin/biome check --write scripts/seed/content/guides/
grep -c "127.0.0.1:5546" .env.local      # doit afficher 1
pnpm seed                                 # idempotent, met à jour les guides existants par slug
node SG/tools/revalidate.mjs              # enregistre un guide et un lieu via l'API REST : vide le cache du front
```

Pièges :

- Le front met les requêtes en cache 1 h. Un seed seul ne l'invalide pas : sans `revalidate.mjs`, la page montre l'ancien contenu.
- Le seed met à jour texte, lieux, `practical`, `checkedAt`, `sources`. Il ne remplace pas l'image d'un guide existant.
- Un nouveau guide demande une image `scripts/seed/assets/guides/<slug>.webp` (2400 x 1600, licence libre) et son entrée de crédit dans `scripts/seed/content/place-photos.ts`.
- Le hook de terminal compresse les sorties : `rtk run "<cmd>"` pour la sortie brute, `command ls` au lieu de `ls`.
- Guide retiré : supprimer le fichier, son import dans `content/guides.ts`, son entrée dans `GUIDE_PHOTOS` et son image, puis ajouter le slug à `RETIRED_GUIDES` (`content/guides.ts`, slug retiré vers slug cible). Le seed et `apply-corrections.ts` suppriment alors le guide d'une base déjà remplie (`scripts/seed/retire.ts`), et la table sert aux redirections 301.
- Changement de slug : les guides n'existent pas encore en production (`/guides` y répond 404), donc aucune redirection à prévoir tant que la refonte n'est pas en ligne. Après la mise en ligne, tout changement de slug demande une redirection 301 dans `next.config.ts`.
- Ne pas toucher aux fichiers transverses (header, footer, hero, rose, film). Le gabarit des guides vit dans `src/app/(frontend)/[locale]/guides/[slug]/page.tsx`, `src/components/surroundings/GuideBody.tsx`, `guide-content.ts`, `src/styles/sections/guides.css`.

### Captures et relecture à l'écran

```bash
node SG/tools/shot.mjs SG/captures 1440 "<nom>-fr=http://localhost:3210/guides/<slug>" "<nom>-en=http://localhost:3210/en/guides/<slug>"
node SG/tools/shot.mjs SG/captures 390  "<nom>-fr=..." "<nom>-en=..."
```

Le script signale `OVERFLOW` si la page déborde en largeur. Les pages longues sont découpées en `-suite2`, `-suite3`. Relire les captures : tableaux lisibles, programmes alignés, pas de cellule vide.

### Tester les liens

Extraire les `https://` du fichier, les passer à `curl -s -o /dev/null -L --max-time 25 -A "<user-agent de navigateur>" -w "%{http_code}"`. Tout doit répondre 200. Même contrôle pour les `href: "/..."` sur `http://localhost:3210`.

### Contrôles finaux

```bash
node_modules/.bin/tsc --noEmit && node_modules/.bin/biome check && bun test src
```

## 8. Check-list de fin de guide

- [ ] Le premier paragraphe répond à la requête du titre, avec des chiffres.
- [ ] Chaque prix, horaire, date et adresse figure dans `SG/sources/<slug>.md` avec URL, extrait et date.
- [ ] Les prix et horaires ont été relus en texte brut (`find.sh`), pas via un résumé.
- [ ] Tous les temps de route viennent de `places.ts` ou de `routes.mjs`. Les totaux sont recalculés.
- [ ] Aucune phrase à la première personne, aucun mot de la liste interdite, aucun tiret cadratin ou demi-cadratin, aucun emoji.
- [ ] Les jours de fermeture, la réservation, le parking, le budget, le plan B pluie, enfants et chiens sont traités ou volontairement écartés.
- [ ] `practical` (4 à 6 lignes), `checkedAt`, `sources` (8 à 16), `faq` (5) remplis dans les deux langues.
- [ ] L'anglais explique ce qu'un étranger ignore et garde exactement les mêmes faits.
- [ ] Liens vers `/le-gite` et `/tarifs-reservation` en fin de guide, 3 à 6 liens internes en tout, aucun prix du gîte.
- [ ] `lint-guide.mts` répond `OK`. Seed passé, cache revalidé, pages FR et EN à 200.
- [ ] Captures 1440 et 390 px relues, sans `OVERFLOW`.
- [ ] Liens sortants et internes tous à 200.
- [ ] `Photos ready` égale `Places ready`.
- [ ] `tsc`, `biome check`, `bun test src` verts.
- [ ] Questions pour Erick et Karine ajoutées au fichier de sources.

## 9. Carte des sujets

État au 7 octobre 2026 : 23 guides, tous réécrits selon la charte. Décision du client : pas deux guides sur la même requête, et chaque guide part du gîte L'Instant Tranquille. Statut : **fait** = en ligne dans le seed, **à créer** = nouveau fichier.

| Slug | Type | Requête visée | Angle | Lieux principaux | Statut |
| --- | --- | --- | --- | --- | --- |
| `que-faire-a-romorantin-lanthenay` | Itinéraire | que faire à Romorantin | 2 jours heure par heure, jour 1 à pied, jour 2 à 30 min au plus | marché, musées, Mennetou, château du Moulin, fromage de Selles | fait |
| `venir-a-romorantin-lanthenay` | Pratique | venir à Romorantin : train, voiture | gares, péages, temps depuis Paris, stationnement, recharge électrique | gare, A85, A71 | fait |
| `week-end-en-sologne` | Itinéraire | week-end en Sologne | 2 jours nature et villages, sans les grands châteaux | étangs, villages, Lamotte-Beuvron | fait |
| `chateaux-de-la-loire-depuis-romorantin` | Itinéraire | châteaux de la Loire en 3 jours | 7 châteaux en 3 boucles, budget, péage, et quoi ajouter si l'on reste plus longtemps | Chambord, Cheverny, Chenonceau, Amboise, Blois, Chaumont, Valençay | fait, a absorbé `incontournables-centre-val-de-loire-depuis-romorantin` |
| `gite-proche-chateau-de-chambord` | Pratique | visiter Chambord : tarifs, parking, durée | la journée à Chambord seule | Chambord, Bracieux, Villesavin | fait |
| `amboise-et-clos-luce-depuis-romorantin` | Itinéraire | Amboise en une journée | château royal, Clos Lucé, ville, marché | Amboise, Clos Lucé | fait |
| `chateaux-de-la-loire-en-montgolfiere` | Sélection | vol en montgolfière châteaux de la Loire | compagnies, sites d'envol, prix, saison | Chenonceau, Amboise, Cheverny | fait |
| `gite-proche-zooparc-de-beauval` | Pratique | Beauval : 1 ou 2 jours, billets, horaires | organiser la journée, éviter les files, où manger | Beauval, Saint-Aignan | fait |
| `sologne-en-famille-avec-enfants` | Sélection | Sologne avec des enfants | par âge et par temps de route, prix famille | Beauval, Center Parcs, Clos Lucé, piscine | fait |
| `que-faire-en-sologne-quand-il-pleut` | Sélection | que faire en Sologne quand il pleut | sorties à l'abri classées par temps de route | musées de Romorantin, Cheverny, Blois | fait |
| `bourges-en-une-journee-depuis-romorantin` | Itinéraire | Bourges en une journée | cathédrale, palais Jacques-Cœur, marais | Bourges | fait |
| `tours-en-une-journee-depuis-romorantin` | Itinéraire | Tours en une journée | vieux Tours, cathédrale, halles | Tours, Villandry | fait |
| `etangs-et-forets-de-sologne` | Sélection | balades étangs de Sologne | sentiers réellement publics, distances, saisons | étangs, Ciran, sentiers balisés | fait |
| `brame-du-cerf-en-sologne` | Saisonnier | brame du cerf Sologne, Chambord | où, quand, gratuit ou guidé, règles | Chambord, Maison du Cerf, Ciran | fait |
| `villages-de-sologne-a-voir` | Sélection | villages de Sologne à voir | quoi y voir en 1 h, par temps de route | Mennetou, Souvigny, La Ferté-Imbault | fait |
| `sologne-a-velo` | Pratique | Sologne à vélo | boucles balisées, loueurs, distances | canal de Berry, Chambord | fait |
| `gite-sologne-avec-chien` | Pratique | Sologne avec son chien | où les chiens sont admis, lieu par lieu | châteaux, forêts | fait |
| `golf-en-sologne` | Sélection | golfs en Sologne | parcours, green-fees datés, temps de route | golfs | fait |
| `tourisme-equestre-en-sologne` | Pratique, événement | gîte près du Parc équestre fédéral de Lamotte-Beuvron | cavaliers, où loger son cheval, Generali Open de France, Game Fair, accès, calendrier | Parc équestre fédéral, Lamotte-Beuvron | fait, a absorbé `hebergement-cavaliers-lamotte-beuvron`, `generali-open-de-france-ou-dormir` et `game-fair-lamotte-beuvron-hebergement` |
| `balade-en-bateau-sur-la-loire-depuis-la-sologne` | Sélection | balade en bateau sur la Loire, coucher de soleil | 5 embarcadères, durées, prix, sorties du soir et apéritif à bord | Chaumont, Blois, Saint-Dyé | fait, a absorbé `coucher-de-soleil-et-apero-sur-la-loire-en-bateau` |
| `croisiere-sous-le-chateau-de-chenonceau` | Pratique | croisière sur le Cher à Chenonceau | compagnies, horaires, réserver | Chisseaux, Chenonceau | fait |
| `route-des-vins-cheverny-touraine-depuis-la-sologne` | Sélection | caves Cheverny, Touraine, Vouvray, Montlouis | caves ouvertes, horaires, journée Vouvray et Montlouis | Cheverny, Vouvray, Montlouis | fait, a absorbé `vouvray-et-montlouis-caves-a-visiter-depuis-romorantin` |
| `vignobles-du-berry-quincy-reuilly-menetou-salon` | Sélection | vins du Berry | 3 appellations, caves, temps de route | Quincy, Reuilly, Menetou-Salon | fait |
| `noel-au-pays-des-chateaux` | Saisonnier | Noël aux châteaux de la Loire | dates et horaires d'hiver, 3 jours | Chambord, Cheverny, Blois, Chenonceau, Valençay | à créer |
| `journees-gastronomiques-de-sologne` | Événement | Journées Gastronomiques de Sologne | dates, lieu, billets, programme | Fabrique Normant | à créer |
| `ou-manger-a-romorantin` | Pratique | où manger à Romorantin, marchés | tables, pâtissier, marchés, jours d'ouverture (réponses des hôtes du 7 octobre 2026 dans `QUESTIONS-PROPRIETAIRES.md`) | centre-ville | à créer |
| `sologne-sans-voiture` | Pratique | séjour à Romorantin sans voiture | train, car Rémi, vélo, ce qui reste faisable | gare, centre | à créer |

### Guides retirés le 7 octobre 2026

Table reprise dans `RETIRED_GUIDES` (`scripts/seed/content/guides.ts`). Un slug retiré ne se réutilise pas.

| Slug retiré | Guide cible |
| --- | --- |
| `hebergement-cavaliers-lamotte-beuvron` | `tourisme-equestre-en-sologne` |
| `generali-open-de-france-ou-dormir` | `tourisme-equestre-en-sologne` |
| `game-fair-lamotte-beuvron-hebergement` | `tourisme-equestre-en-sologne` |
| `coucher-de-soleil-et-apero-sur-la-loire-en-bateau` | `balade-en-bateau-sur-la-loire-depuis-la-sologne` |
| `vouvray-et-montlouis-caves-a-visiter-depuis-romorantin` | `route-des-vins-cheverny-touraine-depuis-la-sologne` |
| `incontournables-centre-val-de-loire-depuis-romorantin` | `chateaux-de-la-loire-depuis-romorantin` |

Un guide supprimé ou renommé doit aussi disparaître des liens internes des autres guides (`grep -rn "/guides/<ancien-slug>" scripts/seed/content`).
