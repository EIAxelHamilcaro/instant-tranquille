# Guide de référence commenté

Guide : « Que faire à Romorantin-Lanthenay en 2 jours : le programme ».
Fichier complet : `scripts/seed/content/guides/que-faire-a-romorantin-lanthenay.ts`. Sources : `sources/que-faire-a-romorantin-lanthenay.md`. Captures : `captures/romorantin-fr-1440.png`, `captures/romorantin-fr-390.png`.

Chaque extrait est suivi de la raison pour laquelle il est écrit ainsi. La charte (`CHARTE.md`) donne la règle, ce document montre son application.

## Titre et chapeau

> **Que faire à Romorantin-Lanthenay en 2 jours : le programme**
>
> En 2 jours à Romorantin-Lanthenay : le samedi, marché de la Halle, vieille ville, Musée de Sologne et musée Matra, tout à pied. Le dimanche, Mennetou-sur-Cher, Selles-sur-Cher et le château du Moulin, à moins de 30 min.

- Le titre reprend la requête (« que faire à Romorantin ») et annonce ce que la page tient vraiment : un programme.
- Le chapeau est la réponse entière. Un lecteur qui s'arrête là sait quoi faire. Il nomme les jours, les lieux et un chiffre (30 min).
- Aucun adjectif. Pas de « découvrez », pas de « au cœur de la Sologne ».

## L'essentiel en bref

> **À éviter** : Le mardi hors juillet et août (les 2 musées sont fermés) et le mois de janvier (Musée de Sologne fermé).
>
> **Budget visites** : 14 € par adulte le jour 1 (2 musées), 20 € le jour 2 (2 châteaux). Tarifs 2026, repas non compris.

- Six lignes, chacune répond à une question pratique. La ligne « À éviter » est celle qui évite une journée ratée : elle est obligatoire dès qu'un lieu a un jour de fermeture.
- Le budget est un total calculé, avec son année. Le calcul figure dans le fichier de sources.

## Introduction

> Deux jours suffisent pour voir Romorantin-Lanthenay et ses environs proches, à condition de bien choisir ses jours. […] Le samedi parce que c'est jour de marché, le dimanche parce que le château du Moulin n'ouvre que certains week-ends.
>
> Depuis le gîte L'Instant Tranquille, au 23 rue de Loreux, la Halle est à 1 km à pied, une dizaine de minutes.

- La première phrase répond. La deuxième justifie l'ordre des jours : un bon itinéraire explique pourquoi dans cet ordre.
- Le gîte apparaît comme point de départ, pas comme argument de vente. La distance (1 km) vient d'OSRM piéton, qui donne 14 min ; Erick et Karine disent 5 à 10 min. Depuis le 7 octobre 2026, la formule est partout « 1 km à pied, une dizaine de minutes ».

## Programme heure par heure

> **14 h 00, Musée de Sologne.** Trois anciens moulins sur la Sauldre. 6 € en visite libre, 4 € en tarif réduit, gratuit avant 6 ans, 16 € pour 2 adultes et 2 enfants. Prévoyez 1 h 30. Ouvert de 14 h à 18 h d'avril à début novembre, 17 h 30 en hiver.

- Une étape = une heure, un lieu, puis dans cet ordre : ce que c'est, le prix, la durée, l'horaire, le piège.
- Les heures s'enchaînent réellement : durée de visite plus temps de trajet. L'étape suivante (Matra, 16 h) tient compte des 5 min à pied et de la dernière entrée à 17 h 30.
- Les trajets sont des étapes à part entière le jour en voiture (« 30 min (26 km) »), pour que le lecteur voie le temps passé sur la route.
- Le bloc alimente aussi le balisage `TouristTrip` : un titre d'étape doit rester un nom de lieu ou d'action clair.

## Sous-titres en questions

> ### Léonard de Vinci à Romorantin : que reste-t-il ?
>
> Rien de construit, mais une histoire que l'on ne raconte nulle part ailleurs. En 1517, Léonard de Vinci dessine pour François Ier les plans d'un palais […]

- Le h3 est une question que les gens posent. La première phrase y répond, honnêtement (« rien de construit »), avant le détail.
- Les dates (1517, 1519) et le remblai de 400 m viennent de la page d'histoire de la ville, citée dans les sources. Rien n'est ajouté de mémoire.

## Tableau des jours d'ouverture

> | Château du Moulin | 1er et 3e week-ends d'avril, mai, juin et septembre. Tous les jours du 11 juillet au 16 août. | 14 h à 18 h |

- Le tableau sert quand il y a une comparaison sur 2 ou 3 critères. Trois colonnes, pour rester lisible sur un téléphone.
- Le texte qui suit dit quoi faire quand c'est fermé (« D'octobre à mars, remplacez-le par… ») : une contrainte s'accompagne toujours d'une solution.

## Où manger

> Cinq adresses du centre, toutes vérifiées en octobre 2026. Les jours de fermeture comptent plus que la carte : le dimanche et le lundi, le choix se réduit beaucoup.

- Adresse complète et jour de fermeture pour chaque table, parce que c'est ce qui manque le dimanche soir.
- Aucun avis sur la cuisine : nous n'y avons pas mangé. Le style vient du restaurant lui-même ou du Guide Michelin, cité.
- Pas de prix de menu : aucun n'était publié sur une page datée.
- Le texte rappelle la cuisine équipée du gîte au moment où c'est utile (le marché du samedi règle le dîner). C'est la seule mention de la maison dans cette section.

## Pluie, enfants, chiens, poussettes

> **Chiens**, ils ne sont admis ni au musée Matra ni au château de Selles-sur-Cher. Au château du Moulin, ils sont acceptés en laisse, à l'extérieur seulement.

- Une puce par public, une règle par lieu, lue sur le site du lieu. « Non précisé » vaut mieux qu'une supposition.
- La section pluie renvoie au guide dédié au lieu de le recopier : un sujet, un guide.

## Fin de guide

> Pour prolonger le séjour, Cheverny est à 31 min et Chambord à 43 min : notre itinéraire des châteaux de la Loire en 3 jours part de la même adresse. Le gîte est une maison entière de 115 m² pour 6 personnes, avec jardin clos et 1 place de parking, d'où l'on rejoint la Halle à pied en une dizaine de minutes.

- Le lien interne a une raison (prolonger). Le gîte est décrit par des faits exacts, en une phrase, sans prix ni appel à réserver.

## FAQ

> **Les musées de Romorantin sont-ils ouverts le mardi ?** Non, sauf en été. Le Musée de Sologne ferme le mardi sauf en juillet et août. […]

- Chaque réponse se comprend seule, commence par oui ou non quand la question s'y prête, et contient le chiffre ou le jour.
- Les questions complètent le corps (durée totale, marché, mardi, sans voiture, Léonard). Elles ne répètent pas les h2.

## Version anglaise

> One thing to know if you are new to France: lunch is served from 12 noon to about 2 pm, and kitchens rarely take orders after that.
>
> […] a swimming cap is compulsory, as in most French public pools.

- Mêmes faits, mêmes chiffres, mais l'anglais ajoute ce qu'un visiteur étranger ignore : heures des repas, pause de midi des sites, bonnet de bain, zone B des vacances scolaires, ce qu'est une sous-préfecture.
- Unités : euros avant le chiffre, heures en am et pm, miles entre parenthèses pour les longues distances.
- Anglais britannique : cottage, pushchair, lead, car park, timber-framed.

## Ce qui a été retiré faute de preuve

- Les règles de stationnement en ville et les heures exactes du marché : non publiées, à demander à Erick et Karine.
- Le Lion d'Or 1774 : retiré le 7 octobre 2026, les hôtes ne le recommandent pas. Selles-sur-Cher n'est plus une visite du programme : on s'y arrête pour le fromage, le château reste en option.
- La durée de visite du Musée de Sologne (1 h 30) est notre estimation, le musée n'en publie pas.
- « Aucune route à péage », « la plupart des panneaux sont en français seulement » : écrits dans un premier jet, supprimés car non vérifiés.
