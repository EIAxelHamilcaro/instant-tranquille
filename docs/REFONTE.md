# Refonte vitrine — L'Instant Tranquille

Gîte en Sologne (Romorantin-Lanthenay). Objectif : vitrine simple, attractive, CMS
gérable par une non-technicienne, référencement local fort.

## Constat de départ (audit 42 agents)

Le repo **n'était pas surchargé**. C'est un Next.js 16 + Payload CMS 3 propre, SEO déjà
avancé (JSON-LD LodgingBusiness/VacationRental/FAQPage/BreadcrumbList, sitemap, robots,
OG, hreflang, plugin-seo). La branche `feature/cms-overhaul` (simplification) est **déjà
fusionnée dans `main`**. La refonte est donc chirurgicale : combler les gaps SEO local,
corriger des bugs de thème, simplifier l'UX d'édition, polir le design — pas réécrire.

## Fait (branche `refonte/vitrine-seo`, build vert)

**SEO local (priorité #1)**
- `jsonld.ts` : `@id` stable (consolidation d'entité Google), `addressLocality`+`postalCode`
  sur LodgingBusiness ET VacationRental, `amenityFeature`+avis/note sur VacationRental,
  `petsAllowed`/`priceRange` câblés (home), nouveau `generatePricingJsonLd`
  (Offer/PriceSpecification par saison) + `computePriceRange`.
- Pages câblées : home (NAP complet + prix + animaux + avis), `/le-gite` (équipements + avis),
  `/tarifs-reservation` (Offer + `h1` géolocalisé), `/contact` (LodgingBusiness NAP + `h1`).
- `SiteSettings` : champs `Ville` + `Code postal` + `Animaux acceptés` (essentiels au SEO local).
- `<head>` : preconnect/dns-prefetch tuiles carte, `geo.placename`.

**Bug de thème actif corrigé**
- `globals.css` : tokens manquants `--primary`/`--secondary`/`--popover` (Button/Badge les
  utilisaient sans qu'ils soient définis → rendu cassé). Neutralisation du dark-mode OS
  (`@custom-variant dark`) : Tailwind v4 activait les `dark:` des composants shadcn en
  `prefers-color-scheme: dark` → thème incohérent.

**Cohérence visuelle (anti « template »)**
- `NearbyAttractions` : badges hors-palette (amber/rose/emerald/violet) → earth/primary.
- `SeasonCalendar` : couleurs saisons + cellules grises → palette de marque.

**Perf / CWV**
- `PayloadImage` : attribut `sizes` sur le chemin non-fill (évite de sur-télécharger sur mobile).

**Nettoyage** : 5 SVG résidus `create-next-app` supprimés.

> Note : `proxy.ts` est le middleware next-intl de Next 16 (à conserver). Le spec
> `2026-03-15-cms-overhaul-design.md` est gardé comme trace.

## Reste à faire — polish design (passe suivante, prête)

Direction retenue par le jury : **éditorial photo-first**, greffes champêtre raffiné.
À implémenter (la plupart bénéficient des vraies photos, cf. blocage) :
- `SectionHeading` variants (default/left/minimal) + sous-titre → casser la cadence répétée.
- Hero : overlay dégradé. `IntroSection` : layout décalé. `HighlightsSection` : bande
  éditoriale sans cards. `TestimonialsSection` : fond sand. `CTASection` : fond photo.
- `PhotoGallery` : masonry + lightbox prev/next (garde si < 3 photos).
- Nouveau `CottageHeroSection` (hero court `/le-gite`).
- `Footer` : icônes SVG Pinterest/YouTube/TikTok (au lieu de « P »/« YT »/« TT »).

## Simplification CMS (passe suivante)

- `Pages.ts` : scinder la collection conditionnelle-par-slug en pages dédiées (gros gain
  UX non-tech) — **nécessite migration de données** (décision + script).
- Champ `icon` texte libre → select borné (libellés FR) dans `Amenities`/`Pages`.
- `OnboardingGuides` : afficher l'URL complète du livret + bouton Copier (composant admin).
- `Footer` : `RowLabel` sur les arrays imbriqués.

## Bloquants — nécessitent une action côté client / décisions

1. **Photos** (bloquant métier) : peu de photos variées. Liste de prises de vue à fournir :
   extérieur jour, extérieur soir, salon, cuisine, chambres, salle de bain, jardin/terrasse,
   étang. Min. 8 photos pour que la galerie et la direction photo-first fonctionnent.
2. **Secrets / prod** : `RESEND_API_KEY` (notifications de contact — actuellement aucun
   email n'est envoyé, message uniquement en console), `TURNSTILE_*` (anti-spam formulaire),
   `DATABASE_URL`/`PAYLOAD_SECRET`/`BLOB_READ_WRITE_TOKEN` en prod, `NEXT_PUBLIC_SITE_URL`
   = vrai domaine (sinon OG/metadataBase pointent localhost).
3. **NAP réel** : adresse exacte, ville, code postal, téléphone à saisir dans le CMS, en
   cohérence avec la fiche Google Business Profile.
4. **Décision locale FR/EN** : garder le bilingue (double saisie) ou désactiver `en`
   (CMS divisé par 2, mais URLs `/en/*` → 404). Site et clientèle 100 % FR local.
5. **Livret d'accueil** : fonctionnalité complète déjà codée (`/livret-accueil/[token]`,
   noindex). Inclure en v1 ou masquer ? Hors périmètre vitrine stricte.

## Schéma DB (workflow push)

Le projet pousse le schéma à l'init Payload en dev (pas de dossier `migrations/`). Après
tout ajout de champ : lancer `next dev` une fois (ou un script d'init) pour synchroniser
les colonnes, sinon le build prod casse. Migrations formelles recommandées pour la prod.
