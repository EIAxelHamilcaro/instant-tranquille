# L'Instant Tranquille — CMS Overhaul Design

**Date**: 2026-03-15
**Objectif**: Transformer le site en un vrai CMS où 100% du contenu est éditable depuis PayloadCMS, avec une interface admin ultra accessible et idiote-proof.

---

## 0. Séquence de déploiement (CRITIQUE)

La migration i18n → CMS est une opération en 4 phases. Ne jamais supprimer une clé i18n avant que la donnée CMS soit peuplée.

```
Phase 1 — Schema CMS (pas de breaking change)
  ├─ Ajouter tous les nouveaux champs aux collections/globals
  ├─ Restructurer en tabs/collapsibles
  ├─ Appliquer les bugfixes (CORS, access control, etc.)
  └─ Déployer → l'admin voit les nouveaux champs vides

Phase 2 — Peuplement CMS
  ├─ L'admin remplit tous les nouveaux champs (FR + EN)
  ├─ Copier le contenu des fichiers i18n vers le CMS
  └─ Vérifier en live preview que tout s'affiche

Phase 3 — Frontend bascule (feature flag ou double-source)
  ├─ Les composants lisent d'abord le CMS, fallback sur i18n si vide
  ├─ Tester en prod que tout fonctionne
  └─ Déployer

Phase 4 — Nettoyage
  ├─ Retirer les fallbacks i18n des composants
  ├─ Supprimer les clés éditoriales de fr.json/en.json
  └─ Déployer
```

**Note sur les tabs Payload** : Les `tabs` sont un wrapper d'affichage uniquement — ils ne changent pas la structure des données en base. Réorganiser les champs en tabs ne nécessite aucune migration de données.

---

## 1. Architecture Admin — Tabs + Collapsibles

### Principe
Chaque collection/global avec 5+ champs utilise des **tabs** pour les grandes catégories, et des **collapsibles** à l'intérieur pour les sous-groupes. L'admin voit un écran propre, jamais un formulaire interminable.

**Important** : Les tabs Payload wrappent TOUS les champs d'une collection. Les champs existants sont réorganisés à l'intérieur des tabs, pas placés à côté.

### Pages (collection)

```
Tab "Contenu"
  ├─ Collapsible "Hero" (heroImage, heroTitle, heroSubtitle)
  ├─ Collapsible "Introduction" (introTitle, introText, introImage) [NOUVEAUX: introTitle, introText]
  ├─ Collapsible "Highlights" (array: titre, description, icône, lien) [NOUVEAU, condition: slug === "home"]
  ├─ Collapsible "Description" (descriptionTitle, descriptionText) [NOUVEAU, condition: slug === "le-gite"]
  └─ Collapsible "Contenu principal" (content richText)

Tab "Médias"
  ├─ Collapsible "Galerie" (gallery array)
  └─ Collapsible "Images aperçu" (previewImages array, max 3) [NOUVEAU, condition: slug === "le-gite"]

Tab "SEO"
  └─ Géré par @payloadcms/plugin-seo (compteurs, preview Google)

Sidebar: slug (auto-généré depuis title), publishedAt (auto-set à la publication), status
```

### OnboardingGuides (collection)

```
Tab "Informations"
  ├─ title, accessToken (protégé en écriture après création via beforeChange hook), isActive
  ├─ Collapsible "Dates de validité" (validFrom, validUntil)
  └─ Collapsible "Informations voyageur" (guestName, guestEmail — NOUVEAUX CHAMPS)

Tab "Arrivée & Départ"
  ├─ Collapsible "Arrivée" (accessCode, instructions richText, parkingInfo)
  ├─ Collapsible "Check-in / Check-out" (checkInInstructions, checkOutInstructions)
  └─ Collapsible "WiFi" (networkName, password)

Tab "Logement"
  ├─ Collapsible "Règlement" (houseRules richText)
  └─ Collapsible "Équipements" (equipmentGuide array)

Tab "Contacts & Recommandations"
  ├─ Collapsible "Contacts d'urgence" (emergencyContacts array)
  └─ Collapsible "Recommandations locales" (localRecommendations relationship)
```

**accessToken readonly après création** : Hook `beforeChange` :
```ts
if (operation === 'update' && originalDoc?.accessToken) {
  data.accessToken = originalDoc.accessToken;
}
```

### LocalRecommendations (collection)

```
Tab "Informations"
  ├─ name, category, description (reste textarea — pas richText)
  └─ Collapsible "Contact" (address, phone, website)

Tab "Localisation"
  ├─ distanceFromGite
  └─ Collapsible "Coordonnées GPS" (lat, lng)

Tab "Média"
  └─ photo

Sidebar: featured, order
```

**Note** : `description` reste `textarea` (pas `richText`). Le composant `NearbyAttractions` n'a pas besoin de `RichTextRenderer` — le rendu texte brut est correct pour des descriptions courtes de recommandations.

### SiteSettings (global)

```
Tab "Général"
  ├─ siteName, tagline, siteDescription, logo
  └─ Collapsible "Détails du bien" (maxGuests, bedrooms, bathrooms, surface)

Tab "Contact & Accès"
  ├─ Collapsible "Contact" (email, phone, address)
  ├─ Collapsible "Coordonnées GPS" (lat, lng, zoom, markerLabel)
  └─ Collapsible "Itinéraires d'accès" (accessRoutes array — CHAMPS LOCALIZED)

Tab "Réseaux sociaux"
  └─ facebook, instagram (+ ajout pinterest, youtube, tiktok)

Tab "FAQ"
  └─ faqs array (question, answer — answer passe en richText)

Tab "SEO par défaut"
  └─ Géré par @payloadcms/plugin-seo au niveau global, ou groupe manuel avec compteurs si le plugin ne supporte pas les globals
```

### PricingConfig (global)

```
Tab "Tarifs"
  ├─ currency
  └─ seasons array (inchangé mais dateRange description clarifiée)

Tab "Frais supplémentaires"
  └─ additionalFees array (+ required sur amount, min: 0)

Tab "Réservation"
  └─ Collapsible "Liens de réservation" (airbnb, booking, email + ajout abritel)

Tab "Conditions"
  └─ Collapsible "Politiques" (cancellation, deposit, checkIn, checkOut, additional)
```

---

## 2. Nouveaux champs CMS — Contenu actuellement hardcodé

### Collection Pages — Nouveaux champs pour la homepage

| Champ | Type | Localized | Description |
|-------|------|-----------|-------------|
| `introTitle` | text | oui | Titre de la section introduction |
| `introText` | richText | oui | Texte d'introduction (remplace i18n `home.introText`) |
| `highlights` | array | — | Cards highlights (condition: `slug === "home"`) |
| `highlights[].icon` | text | non | Nom d'icône Lucide (kebab-case) |
| `highlights[].title` | text | oui | Titre du highlight |
| `highlights[].description` | textarea | oui | Description |
| `highlights[].linkUrl` | text | oui | URL du lien |
| `highlights[].linkLabel` | text | oui | Libellé du lien |

### Collection Pages — Nouveaux champs pour la page gîte

| Champ | Type | Localized | Description |
|-------|------|-----------|-------------|
| `descriptionTitle` | text | oui | Titre section description (condition: `slug === "le-gite"`) |
| `descriptionText` | richText | oui | Texte de description du gîte |
| `previewImages` | array (max 3) | — | 3 photos pour la sidebar (condition: `slug === "le-gite"`) |
| `previewImages[].image` | upload | non | Photo |
| `previewImages[].label` | text | oui | Label de la photo (ex: "Salon", "Chambre") |

### OnboardingGuides — Nouveaux champs

| Champ | Type | Description |
|-------|------|-------------|
| `guestName` | text | Nom du voyageur |
| `guestEmail` | email | Email du voyageur (pour envoi du lien) |

### SiteSettings — Champs modifiés

| Champ | Modification |
|-------|-------------|
| `accessRoutes[].from` | Passe en `localized: true` |
| `accessRoutes[].description` | Passe en `localized: true` |
| `accessRoutes[].duration` | Passe en `localized: true` |
| `faqs[].answer` | Passe de `textarea` à `richText` |
| `socialLinks` | Ajout `pinterest`, `youtube`, `tiktok` |
| `contact.phone` | Ajout `validate: validatePhone` |

### Impact sur queries.ts et types

Les types `CmsPage` dans `queries.ts` doivent être étendus avec les nouveaux champs. Les pages (`page.tsx` pour home et le-gite) doivent passer les nouvelles props aux composants. Les composants client (`DescriptionSection`, etc.) recevront du richText sous forme de JSON Lexical sérialisable — utiliser `RichTextRenderer` (client-compatible car basé sur `@payloadcms/richtext-lexical/react`).

---

## 3. Corrections de bugs critiques

### 3.1 CORS/CSRF — Code mort
**Fichier**: `payload.config.ts`
**Bug**: `allowedOrigins` est construit mais jamais passé à `buildConfig`.
**Fix**: Ajouter `cors: allowedOrigins, csrf: allowedOrigins` dans `buildConfig({...})`.

### 3.2 serverURL manquant
**Fichier**: `payload.config.ts`
**Fix**: Ajouter `serverURL: process.env.NEXT_PUBLIC_SITE_URL || ""`.

### 3.3 Email adapter manquant
**Fichier**: `payload.config.ts`
**Bug**: `emailNotify.ts` est déjà correctement branché dans `ContactMessages.ts` (import + `afterChange: [notifyOnContactMessage]`). Le problème est que PayloadCMS n'a pas d'email adapter configuré, donc `req.payload.sendEmail()` est un no-op silencieux.
**Fix**: Installer un email adapter (ex: `@payloadcms/email-resend` ou `@payloadcms/email-nodemailer`) et le configurer dans `payload.config.ts` :
```ts
email: resendAdapter({ apiKey: process.env.RESEND_API_KEY, defaultFromAddress: '...', defaultFromName: '...' })
```

### 3.4 `null€` dans PricingTable
**Fichier**: `PricingTable.tsx`
**Fix**: Guard `season.nightlyRate != null ? season.nightlyRate : "—"` pour tous les champs numériques, y compris `season.weeklyRate`, `season.minimumStay`, et `fee.amount` dans la section additionalFees.

### 3.5 Testimonials — stayDate required mismatch
**Bug**: `stayDate` est `required: true` dans la collection Testimonials, mais `z.string().optional()` dans le schéma Zod de `actions.ts`, et pas required dans le formulaire frontend.
**Fix**: Aligner les trois : rendre `stayDate` required dans le schéma Zod (`z.string().min(1)`) ET ajouter l'attribut `required` dans le composant `TestimonialForm`.

### 3.6 Testimonials — pending/rejected lisibles publiquement
**Fichier**: `Testimonials.ts`
**Fix**: Remplacer `read: isPublic` par :
```ts
read: ({ req: { user } }) => user ? true : { status: { equals: "approved" } }
```
Note : supprimer l'import `isPublic` de ce fichier s'il n'est plus utilisé ailleurs dans la même collection.

### 3.7 Contact form — pas de CAPTCHA
**Fichier**: Contact form components + `contact/actions.ts`
**Fix**: Ajouter Cloudflare Turnstile (même pattern que le formulaire de témoignage dans `actions.ts`).

### 3.8 accessToken trop court
**Fichier**: `OnboardingGuides.ts`
**Fix**: Remplacer `Math.random().toString(36).substring(2, 6)` par `crypto.randomBytes(12).toString('hex')` (24 chars hex). Les tokens existants en base restent valides — pas de migration nécessaire, seuls les nouveaux tokens seront plus longs.

### 3.9 validFrom/validUntil non vérifiés
**Fichier**: `src/lib/access.ts` + `livret-accueil/[accessToken]/page.tsx`

**Fix access control** — modifier `isActiveGuideOrAdmin` :
```ts
export const isActiveGuideOrAdmin: Access = ({ req: { user } }) => {
  if (user) return true;
  const now = new Date().toISOString();
  return {
    and: [
      { isActive: { equals: true } },
      { or: [{ validFrom: { exists: false } }, { validFrom: { less_than_equal: now } }] },
      { or: [{ validUntil: { exists: false } }, { validUntil: { greater_than_equal: now } }] },
    ],
  };
};
```

**Fix booklet query** — dans la page, ajouter les mêmes filtres de date dans la clause `where` de `payload.find()`.

---

## 4. UX Admin — Améliorations

### 4.1 Lexical Editor simplifié
Retirer : Subscript, Superscript, InlineCode, Checklist, Relationship, Upload inline.
Garder : Bold, Italic, Underline, Strikethrough, Heading (H2-H4), Paragraph, Link, OrderedList, UnorderedList, Blockquote, HorizontalRule, Align.

### 4.2 SEO Plugin
Installer `@payloadcms/plugin-seo` (vérifier compatibilité avec PayloadCMS 3.75 avant installation) pour :
- Auto-génération de metaTitle/metaDescription
- Compteur de caractères avec feedback visuel
- Preview Google SERP
- Appliquer sur la collection Pages. Pour les globals (SiteSettings.defaultSeo), garder le groupe manuel avec ajout de `maxLength` (60 pour title, 160 pour description) si le plugin ne supporte pas les globals.

### 4.3 Slug auto-généré
Hook `beforeValidate` sur Pages :
```ts
if (!data.slug && data.title) {
  data.slug = slugify(data.title, { lower: true, strict: true });
}
```

### 4.4 publishedAt auto-set
Hook `beforeChange` sur Pages :
```ts
if (data._status === 'published' && !originalDoc?.publishedAt) {
  data.publishedAt = new Date().toISOString();
}
```

### 4.5 Admin descriptions claires
Chaque champ aura une `admin.description` en français expliquant clairement ce qu'il faut saisir, avec des exemples concrets. L'admin ne doit jamais se demander "qu'est-ce que je mets ici ?".

### 4.6 defaultColumns optimisés
Configurer `defaultColumns` sur chaque collection pour que la liste admin montre les colonnes les plus utiles en premier (ex: ContactMessages → name, email, subject, createdAt, readStatus).

### 4.7 Upload constraints
Ajouter `mimeTypes` strict et `staticOptions.limits.fileSize: 5 * 1024 * 1024` (5 MB max) sur Media.

---

## 5. Frontend — Suppression du contenu hardcodé

### Principe
Chaque composant qui affichait du texte depuis i18n ou en dur va maintenant recevoir les données du CMS via props. Les fichiers i18n ne gardent que les **labels UI** (boutons, labels de formulaire, messages d'erreur) — jamais du contenu éditorial.

**Stratégie de transition** (cf. Section 0) : pendant la Phase 3, chaque composant lit le CMS d'abord, et fallback sur l'i18n si le champ CMS est vide. Les fallbacks sont retirés en Phase 4.

### Composants à modifier

| Composant | Actuellement | Après |
|-----------|-------------|-------|
| `HeroSection` | i18n `home.heroTitle/Subtitle/Cta` | Props depuis `homePage.heroTitle/heroSubtitle` + CTA depuis PricingConfig bookingLinks |
| `IntroSection` | i18n `home.introTitle/introText` + image CMS | Props depuis `homePage.introTitle/introText/introImage` (page.tsx doit passer les nouvelles props) |
| `HighlightsSection` | 4 cards hardcodées | Props depuis `homePage.highlights[]` array |
| `DescriptionSection` | i18n `cottage.descriptionTitle/Text` + placeholders images | Props depuis `gitePage.descriptionTitle/descriptionText/previewImages[]` (richText via RichTextRenderer client) |
| `ArrivalInstructions` (booklet) | `instructions` richText rendu comme `<p>{data.instructions}</p>` | Rendre avec `RichTextRenderer` |
| `CheckInOutInstructions` | Fallbacks français hardcodés | Props CMS only, pas de fallback — si vide, section cachée |
| `EmergencyContacts` | "112" hardcodé | Props CMS + i18n pour le label "Urgences" uniquement |
| `LocalRecommendationsGrid` | 4 catégories hardcodées en français, manque `markets` et `services` | Brancher les 6 catégories via i18n keys existantes + ajouter keys manquantes pour `markets`/`services`. Fix `"Site web"` → `t("websiteLabel")`, `"Aucune recommandation"` → `t("noRecommendations")` |
| `BookletPageClient` | "Carte des environs" hardcodé | `t("map")` comme la version serveur |
| `AccessInstructions` | Fallbacks français hardcodés, clés i18n `accessDescParis/Tours/Orleans` non utilisées | CMS accessRoutes uniquement (maintenant localized), section cachée si vide |
| `Footer` | "Contact" heading hardcodé | i18n key `footer.contact` |
| `Layout` | skipText en ternaire | `t("common.skipToContent")` |
| `NearbyAttractions` | Check `typeof description === "string"` (correct car c'est un textarea) | Pas de changement — le rendu texte brut est correct |

### Nettoyage i18n (Phase 4 uniquement)
- Supprimer les clés de contenu éditorial des fichiers fr.json/en.json (heroTitle, introText, descriptionTitle, etc.)
- Garder uniquement les labels UI, messages d'erreur, boutons
- Les clés i18n existantes mais inutilisées (categoryRestaurants, checkInFallback, emergencyNumber, websiteLabel, noRecommendations, etc.) seront enfin branchées dans les composants
- Ajouter les clés manquantes : `booklet.categoryMarkets`, `booklet.categoryServices`

---

## 6. Accessibilité — Standards WCAG 2.1 AA

### Navigation
- Skip-to-content link correctement traduit via i18n
- `aria-current="page"` + **style visuel distinctif** sur le nav item actif (pas juste ARIA)
- Focus visible sur tous les éléments interactifs (outline 2px offset)
- Navigation clavier complète dans le header mobile (trap focus dans le menu ouvert)

### Formulaires
- Tous les champs avec `<label>` associé explicitement
- Messages d'erreur liés via `aria-describedby`
- `aria-invalid="true"` sur les champs en erreur
- `aria-live="polite"` sur les zones de feedback (succès/erreur)

### Images
- `ImagePlaceholder` → ajout `role="img"` + `aria-label`
- Toutes les images CMS ont `alt` required (déjà le cas sur Media)
- Icônes décoratives avec `aria-hidden="true"` (déjà fait en grande partie)

### Contenu dynamique
- Carrousel témoignages : `aria-roledescription="carousel"`, `aria-label` sur chaque slide
- Accordéons politiques : `aria-expanded`, `aria-controls` (déjà via shadcn Accordion)
- Lightbox galerie : trap focus, fermeture via Escape, `role="dialog"` + `aria-modal`

### Couleurs & Contraste
- Vérifier ratio 4.5:1 minimum sur tout le texte
- Ne pas transmettre d'information uniquement par la couleur (ajouter des icônes/labels)

### Boutons booking
- Si URL non configurée dans le CMS → **cacher le bouton** (pas de `href="#"`)
- `aria-label` descriptif sur les liens externes ("Réserver sur Airbnb - ouvre dans un nouvel onglet")

---

## 7. Corrections mineures incluses

- `MobileNav` : key unique (`${item.url}-${index}` au lieu de `item.url` seul)
- Footer grid : `md:grid-cols-{n}` dynamique basé sur le nombre réel de colonnes
- Breadcrumbs JSON-LD : utiliser les traductions au lieu du français hardcodé
- `PayloadImage` : retirer `fetchPriority` prop (dans `src/components/shared/PayloadImage.tsx`)
- `ctaButton.label` : rendre required dans Header global
- `ContactMessages.bookingInfo` dates : `pickerAppearance: "dayOnly"`
- `additionalFees[].amount` : ajout `required: true`, `min: 0`
- `emergencyContacts[].phone` : ajout `validate: validatePhone`
- `Amenities.category` : ajout "bedroom", "bathroom", "tech"
- `getAmenities` : filtrer `enabled` dans la query Payload (`where: { enabled: { not_equals: false } }`) au lieu de JS

---

## 8. Ce qui n'est PAS dans le scope

- Refonte visuelle / redesign (on garde le design actuel)
- Nouvelle fonctionnalité de réservation en ligne
- Multi-utilisateurs / rôles admin
- Newsletter / mailing list
- Plugin redirects (pas nécessaire pour l'instant)
- Calendrier de disponibilité
- Map interactive dans le booklet (garde le placeholder pour l'instant)
- Contact form : ajout de champs bookingInfo côté frontend (les champs CMS existent mais sont remplis manuellement par l'admin pour l'instant)
