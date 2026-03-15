# L'Instant Tranquille — CMS Overhaul Design

**Date**: 2026-03-15
**Objectif**: Transformer le site en un vrai CMS où 100% du contenu est éditable depuis PayloadCMS, avec une interface admin ultra accessible et idiote-proof.

---

## 1. Architecture Admin — Tabs + Collapsibles

### Principe
Chaque collection/global avec 5+ champs utilise des **tabs** pour les grandes catégories, et des **collapsibles** à l'intérieur pour les sous-groupes. L'admin voit un écran propre, jamais un formulaire interminable.

### Pages (collection)

```
Tab "Contenu"
  ├─ Collapsible "Hero" (heroImage, heroTitle, heroSubtitle)
  ├─ Collapsible "Introduction" (introTitle, introText, introImage)
  ├─ Collapsible "Highlights" (array: titre, description, icône, lien) [condition: slug === "home"]
  └─ Collapsible "Contenu principal" (content richText)

Tab "Médias"
  └─ Collapsible "Galerie" (gallery array)

Tab "SEO"
  └─ (metaTitle avec compteur 60 chars, metaDescription avec compteur 160 chars, ogImage)

Sidebar: slug (auto-généré), publishedAt (auto-set), status
```

### OnboardingGuides (collection)

```
Tab "Informations"
  ├─ title, accessToken (readonly après création), isActive
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

### LocalRecommendations (collection)

```
Tab "Informations"
  ├─ name, category, description
  └─ Collapsible "Contact" (address, phone, website)

Tab "Localisation"
  ├─ distanceFromGite
  └─ Collapsible "Coordonnées GPS" (lat, lng)

Tab "Média"
  └─ photo

Sidebar: featured, order
```

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
  └─ metaTitle, metaDescription, ogImage (avec compteurs)
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
**Fix**: Installer `@payloadcms/email-nodemailer` ou `@payloadcms/email-resend` et configurer l'adapter. Brancher `emailNotify.ts` dans `ContactMessages.ts`.

### 3.4 `null€` dans PricingTable
**Fichier**: `PricingTable.tsx`
**Fix**: Guard `season.nightlyRate != null ? season.nightlyRate : "—"` pour tous les champs numériques.

### 3.5 Testimonials — stayDate required mismatch
**Fichier**: `actions.ts`
**Fix**: Rendre `stayDate` required dans le schéma Zod ET dans le formulaire frontend.

### 3.6 Testimonials — pending/rejected lisibles publiquement
**Fichier**: `Testimonials.ts`
**Fix**: Modifier `read` access :
```ts
read: ({ req: { user } }) => user ? true : { status: { equals: "approved" } }
```

### 3.7 Contact form — pas de CAPTCHA
**Fichier**: Contact form components + action
**Fix**: Ajouter Cloudflare Turnstile (même pattern que le formulaire de témoignage).

### 3.8 accessToken trop court
**Fichier**: `OnboardingGuides.ts`
**Fix**: Passer de 4 chars base36 à 16 chars avec `crypto.randomUUID()` ou `crypto.randomBytes(12).toString('hex')`.

### 3.9 validFrom/validUntil non vérifiés
**Fichier**: Booklet page + access control
**Fix**: Ajouter la vérification des dates dans `isActiveGuideOrAdmin` et dans la query du booklet.

---

## 4. UX Admin — Améliorations

### 4.1 Lexical Editor simplifié
Retirer : Subscript, Superscript, InlineCode, Checklist, Relationship, Upload inline.
Garder : Bold, Italic, Underline, Strikethrough, Heading (H2-H4), Paragraph, Link, OrderedList, UnorderedList, Blockquote, HorizontalRule, Align.

### 4.2 SEO Plugin
Installer `@payloadcms/plugin-seo` pour :
- Auto-génération de metaTitle/metaDescription
- Compteur de caractères avec feedback visuel
- Preview Google SERP
- Remplacer les groupes SEO manuels sur Pages et SiteSettings

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

### Composants à modifier

| Composant | Actuellement | Après |
|-----------|-------------|-------|
| `HeroSection` | i18n `home.heroTitle/Subtitle/Cta` | Props depuis `homePage.heroTitle/heroSubtitle` + CTA depuis PricingConfig bookingLinks |
| `IntroSection` | i18n `home.introTitle/introText` | Props depuis `homePage.introTitle/introText` |
| `HighlightsSection` | 4 cards hardcodées | Props depuis `homePage.highlights[]` array |
| `DescriptionSection` | i18n `cottage.descriptionTitle/Text` + placeholders images | Props depuis `gitePage.descriptionTitle/descriptionText/previewImages[]` |
| `CheckInOutInstructions` | Fallbacks français hardcodés | Props CMS only, pas de fallback — si vide, section cachée |
| `EmergencyContacts` | "112" hardcodé | Props CMS + i18n pour le label "Urgences" uniquement |
| `LocalRecommendationsGrid` | Catégories en français hardcodé | i18n keys déjà existantes mais inutilisées → les brancher |
| `BookletPageClient` | "Carte des environs" hardcodé | `t("map")` comme la version serveur |
| `AccessInstructions` | Fallbacks français hardcodés | CMS accessRoutes uniquement, section cachée si vide |
| `Footer` | "Contact" heading hardcodé | i18n key `footer.contact` |
| `Layout` | skipText en ternaire | `t("common.skipToContent")` |
| `NearbyAttractions` | Drop richText descriptions | Rendre avec `RichTextRenderer` |
| `HouseRulesSection` | Carte vide si pas de contenu | `if (!content) return null` au niveau composant |

### Nettoyage i18n
- Supprimer les clés de contenu éditorial des fichiers fr.json/en.json (heroTitle, introText, descriptionTitle, etc.)
- Garder uniquement les labels UI, messages d'erreur, boutons
- Les clés i18n existantes mais inutilisées (categoryRestaurants, checkInFallback, etc.) seront enfin branchées

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

- `MobileNav` : key unique (index au lieu de `item.url`)
- Footer grid : `md:grid-cols-{n}` dynamique basé sur le nombre réel de colonnes
- Breadcrumbs JSON-LD : utiliser les traductions au lieu du français hardcodé
- `PayloadImage` : retirer `fetchPriority` prop invalide
- `ctaButton.label` : rendre required dans Header global
- `ContactMessages.bookingInfo` dates : `pickerAppearance: "dayOnly"`
- `additionalFees[].amount` : ajout `required: true`, `min: 0`
- `emergencyContacts[].phone` : ajout `validate: validatePhone`
- `Amenities.category` : ajout "bedroom", "bathroom", "tech"
- `getAmenities` : filtrer `enabled` dans la query Payload au lieu de JS

---

## 8. Ce qui n'est PAS dans le scope

- Refonte visuelle / redesign (on garde le design actuel)
- Nouvelle fonctionnalité de réservation en ligne
- Multi-utilisateurs / rôles admin
- Newsletter / mailing list
- Plugin redirects (pas nécessaire pour l'instant)
- Calendrier de disponibilité
- Map interactive dans le booklet (garde le placeholder pour l'instant)
