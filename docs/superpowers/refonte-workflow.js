export const meta = {
  name: "refonte-vitrine-sologne",
  description:
    "Execute la refonte vitrine du gite (plan 2026-06-20) phase par phase : implementation sequentielle + revue adverse parallele + correction.",
  whenToUse:
    "Pour derouler le plan docs/superpowers/plans/2026-06-20-refonte-vitrine-sologne.md. Passer args.phases (ex: [0,1]) pour cibler des phases.",
  phases: [
    {
      title: "Implement",
      detail: "Une tache du plan = un subagent, edition + tsc/biome + commit",
    },
    {
      title: "Review",
      detail:
        "Revue adverse parallele (types, conventions, objectif, SEO/design) en lecture seule",
    },
    { title: "Fix", detail: "Correction des findings bloquants" },
  ],
};

const PLAN = "docs/superpowers/plans/2026-06-20-refonte-vitrine-sologne.md";
const SPEC =
  "docs/superpowers/specs/2026-06-20-refonte-vitrine-sologne-design.md";

const CONSTRAINTS = [
  "Build vert: node_modules/.bin/tsc --noEmit ET node_modules/.bin/biome check doivent passer (corrige tout).",
  "Positionnement: 'un gite en Sologne', JAMAIS 'gite de charme' ni cliche luxe/marketing. Ton sobre, factuel, FR accents complets.",
  "Axe cavaliers: proximite seule (pas d'accueil chevaux sur place), proche Grand Parquet de Lamotte-Beuvron (FFE).",
  "Design hybride: titres sans-serif bold (Inter display heavy), accents Playfair italic, corps Lora. Vert #4a7c59 signature + earth + neutres chauds (creme/taupe/pierre/terracotta). Jamais de blanc pur.",
  "Code: props composant = interface (jamais type sauf union/z.infer); pas de barrel index.ts; pas de <div> wrapper inutile (Fragment si possible); pas de commentaires superflus; void navigate() dans callbacks mutation; pas de DDD.",
  "i18n FR/EN: conserver /en/*, ne pas supprimer src/i18n/proxy.ts. Toute cle ajoutee doit exister dans fr.json ET en.json (symetrie) + pathnames dans routing.ts.",
  "Reservation: CTA Airbnb/Booking/Abritel branches sur PricingConfig.platformLinks, aucune URL en dur.",
  "pnpm v11: si ERR_PNPM_IGNORED_BUILDS, utiliser binaires directs node_modules/.bin/*. Schema DB: pas de migrations/, pousser via 'next dev' lance en arriere-plan le temps du push puis arrete, AVANT build.",
  "BASE DE PROD, RESTART PROPRE: on repart de zero, le contenu prod existant n'a aucune valeur. OK de reset/clear les collections et de re-seeder un contenu propre, correct et on-brand. Le seed doit etre RE-JOUABLE sans planter (clear collections -> create; updateGlobal idempotent; admin en find-or-create). Aucun doublon a l'issue.",
  "Resend & Turnstile HORS SCOPE: pas d'envoi d'email, pas de captcha. Le formulaire contact se contente de stocker dans ContactMessages (degrade proprement sans secret). La reservation passe par les CTA Booking/Airbnb.",
  "CTA reservation Booking/Airbnb: tres accessibles et proeminents (header, hero, section dediee, page tarifs) MAIS integres et sobres, sans degrader le design.",
  "Capacite a LIRE depuis SiteSettings.propertyDetails (prod), NE PAS hardcoder. Valeurs connues: 6 personnes, 3 chambres, 2 sdb, 120 m2. Distances alentours depuis LocalRecommendations (en temps de trajet, ex '30 min').",
].join("\n- ");

const PHASES = {
  0: {
    title: "Dependances SOTA prudent",
    tasks: [
      {
        id: "0.1",
        label: "montee deps minors",
        db: false,
        desc: "Monter Next 16.2.x, React 19.2.x, payload + @payloadcms/* (meme version entre eux, vise 3.85.x), next-intl 4.13.x, Tailwind 4.3.x, embla 8.6.x, react-turnstile. Migrer src/lib/queries.ts de unstable_cache vers 'use cache' si tsc le signale (sinon conserver). Verifier revalidate.ts coherent.",
      },
      {
        id: "0.2",
        label: "zod4/radix conditionnel",
        db: false,
        desc: "Tenter zod@^4 puis tsc. Si rupture limitee (z.email() etc.) corriger; sinon revenir a zod@^3 et tracer le report dans docs/REFONTE.md. Idem package radix-ui unifie: migrer seulement si propre, sinon reporter.",
      },
    ],
  },
  1: {
    title: "Design system fondations",
    tasks: [
      {
        id: "1.1",
        label: "palette neutres chauds",
        db: false,
        desc: "src/styles/globals.css: ajouter echelle stone/taupe chaude (50-900) + accent terracotta harmonise aux photos, exposer en @theme inline SANS casser primary/earth/sand ni les tokens --primary/--secondary/--popover. Verifier aucune section existante ne casse.",
      },
      {
        id: "1.2",
        label: "typo hybride",
        db: false,
        desc: "src/lib/fonts.ts + globals.css: Inter graisses lourdes (700/800/900) display:swap + variable --font-display; mapper h1/eyebrows sur display sans-serif (tracking serre), Playfair italic pour sous-titres/citations, Lora corps. NE PAS ajouter de 4e famille (perf).",
      },
      {
        id: "1.3",
        label: "SectionHeading 3 variants",
        db: false,
        desc: "src/components/shared/SectionHeading.tsx: props variant 'default'|'left'|'minimal' + eyebrow (Playfair italic) + subtitle, retro-compatible (centered marche encore). Verifier usages existants.",
      },
      {
        id: "1.4",
        label: "PayloadImage blur-up",
        db: true,
        desc: "src/collections/Media.ts: champ blurDataURL (admin hidden) peuple par hook sharp (resize ~10px -> base64). src/components/shared/PayloadImage.tsx: passer placeholder='blur' + blurDataURL quand dispo, garder sizes. Pousser le schema (next dev en bg) puis verifier.",
      },
    ],
  },
  2: {
    title: "Photos dans Payload",
    tasks: [
      {
        id: "2.1",
        label: "seed photos Media",
        db: true,
        desc: "Refondre scripts/seed.ts pour un contenu PROPRE et on-brand (prod repart de zero). (1) RE-JOUABLE: clear collections pages/amenities/testimonials/local-recommendations/media puis create; updateGlobal idempotent; admin en find-or-create (ne pas planter si existe). (2) COPY SOBRE: retirer tout 'gite de charme'/'havre de paix'/'parenthese nature' -> ton factuel. (3) Capacite 6 pers/3 ch/2 sdb/120 m2. (4) Seeder les 19 .webp de public/images/ comme Media (alt+caption FR/EN + category) et cabler home (heroImage/introImage) + le-gite (gallery/previewImages) dessus. Lancer le seed sur la prod, verifier dans l'admin (Media+tailles+blurDataURL, pages, zero doublon).",
      },
    ],
  },
  3: {
    title: "Refonte sections (patterns Elyse)",
    tasks: [
      {
        id: "3.1",
        label: "HeroSection plein-bleed",
        db: false,
        desc: "src/components/home/HeroSection.tsx: 100vh full-bleed sans border-radius, overlay degrade parametrable, titre display + sous-titre Playfair italic, CTA primaire Reserver (lien plateforme) + secondaire. Image priority + blur-up. Calibrer sur salon-cheminee ou jardin (pas d'exterieur dispo).",
      },
      {
        id: "3.2",
        label: "StatsBand",
        db: false,
        desc: "Creer src/components/home/StatsBand.tsx + l'inserer dans page.tsx home: bande stats epuree LISANT SiteSettings.propertyDetails (NE PAS hardcoder; actuellement 6 pers/3 ch/2 sdb/120 m2) + 2-3 distances cles depuis LocalRecommendations (ex '30 min Chambord') ou i18n. Ajouter cles fr/en.",
      },
      {
        id: "3.3",
        label: "IntroSection asymetrique",
        db: false,
        desc: "src/components/home/IntroSection.tsx: layout 60/40 decale (image dominante), copy sobre, reveals au scroll (useReveal).",
      },
      {
        id: "3.4",
        label: "Highlights bande editoriale",
        db: false,
        desc: "src/components/home/HighlightsSection.tsx: remplacer les 4 cards par une bande editoriale rythmee (alternance texte/visuel), icones discretes, garder alimentation CMS highlights[].",
      },
      {
        id: "3.5",
        label: "PhotoGallery masonry+lightbox",
        db: false,
        desc: "src/components/cottage/PhotoGallery.tsx: vrai masonry (columns/grid auto-rows) ratios mixtes; lightbox prev/next + clavier (fleches/Esc) + focus trap; fallback grille si <3 photos.",
      },
      {
        id: "3.6",
        label: "CTASection fond photo",
        db: false,
        desc: "src/components/home/CTASection.tsx: fond photo + overlay (fin du vert plat), boutons Airbnb/Booking/Abritel (SVG logos plateformes) depuis PricingConfig.platformLinks + email.",
      },
      {
        id: "3.7",
        label: "Testimonials sand + CottageHero",
        db: false,
        desc: "src/components/home/TestimonialsSection.tsx: fond sand. Creer src/components/cottage/CottageHeroSection.tsx (hero court bandeau photo + titre + eyebrow) et l'inserer dans le-gite/page.tsx.",
      },
      {
        id: "3.8",
        label: "Footer SVG sociaux",
        db: false,
        desc: "src/components/layout/Footer.tsx: remplacer P/YT/TT par vrais SVG (Pinterest/YouTube/TikTok), conditionnes a la presence du lien dans SiteSettings.",
      },
    ],
  },
  4: {
    title: "Page /les-alentours + section cavaliers",
    tasks: [
      {
        id: "4.1",
        label: "modele Payload alentours",
        db: true,
        desc: "src/collections/Pages.ts: bloc conditionnel slug 'les-alentours' (alentoursIntro, equestrianTitle, equestrianText richText, equestrianVenues[]). src/collections/LocalRecommendations.ts: categorie equestre. Pousser le schema.",
      },
      {
        id: "4.2",
        label: "route + composants alentours",
        db: true,
        desc: "Creer src/app/(frontend)/[locale]/les-alentours/page.tsx (generateMetadata via seo.ts + h1 geolocalise) + src/components/surroundings/{SurroundingsHero,CategoryGrid,EquestrianSection,SurroundingsMap}.tsx. EquestrianSection: copy sobre proximite Grand Parquet/FFE/concours + FAQ equestre. Carte Leaflet ssr:false. Ajouter entree nav header+footer, cles i18n fr/en symetriques (namespace surroundings+equestrian), pathname /les-alentours <-> /surroundings dans routing.ts. Verifier /les-alentours et /en/surroundings.",
      },
    ],
  },
  5: {
    title: "SEO/GEO godlike",
    tasks: [
      {
        id: "5.1",
        label: "jsonld sameAs/WebSite/TouristAttraction/FAQ",
        db: false,
        desc: "src/lib/jsonld.ts + SiteSettings (champs sameAs): sameAs[] sur LodgingBusiness, GPS 5 decimales, checkin/out ISO 8601, contentReferenceTime sur Review, amenityFeature avec absences value:false. generateWebSiteJsonLd(). generateTouristAttractionJsonLd() pour LocalRecommendations + entree Grand Parquet. Cabler FAQ JSON-LD sur le-gite/tarifs/alentours (dont 1 question equestre). Injecter WebSite au layout. Valider mentalement la structure Rich Results.",
      },
      {
        id: "5.2",
        label: "metadata googleBot/keywords/OG",
        db: false,
        desc: "src/lib/seo.ts + layout.tsx: robots.googleBot (max-image-preview:large, max-snippet:-1, max-video-preview:-1), keywords (dont 'hebergement cavaliers Sologne','gite proche Grand Parquet'). Creer src/lib/og.tsx (template OG parametrable) + opengraph-image.tsx par page (le-gite, tarifs-reservation, les-alentours, contact) avec photo + titre.",
      },
      {
        id: "5.3",
        label: "sitemap images / robots IA / llms.txt / headers",
        db: false,
        desc: "src/app/sitemap.ts: images[] par page + entree /les-alentours (+ alternates.languages). src/app/robots.ts: host + autoriser GPTBot/ClaudeBot/PerplexityBot/Google-Extended. Creer public/llms.txt (index) + public/llms-full.txt (identite, capacite, axe cavaliers, tarifs indicatifs, avis verbatim, FAQ). next.config.ts: security headers (HSTS, CSP compatible tuiles carte/blob/og, X-Frame-Options, Referrer-Policy).",
      },
    ],
  },
  6: {
    title: "QA & verification finale",
    tasks: [
      {
        id: "6.1",
        label: "verification globale",
        db: true,
        desc: "node_modules/.bin/biome check + tsc --noEmit + pnpm build tous verts (pousser schema d'abord si besoin). Verifier rendu sitemap.xml/robots.txt/llms.txt. Revue visuelle rapide (decrire) des 5 pages. Mettre a jour docs/REFONTE.md (fait/reporte/bloquants client restants: NAP reel, liens plateformes, photos exterieur/equestre, secrets RESEND/TURNSTILE).",
      },
    ],
  },
  7: {
    title: "Injection contenu reel (Airbnb/Booking)",
    tasks: [
      {
        id: "7.1",
        label: "contenu reel + vrais liens",
        db: true,
        desc: `Injecter le CONTENU REEL (extrait des annonces Airbnb/Booking de ce gite) dans scripts/seed.ts (re-jouable) puis re-seeder la prod. Verifier aussi le cablage jsonld/PricingConfig. Objectif: passer le site de placeholder a 100% vraies infos.

NAP REEL (corriger): nom "L'Instant Tranquille"; adresse "23 Rue de Loreux"; ville "Romorantin-Lanthenay"; code postal "41200" (l'ancien 41000 est FAUX); region "Centre-Val de Loire"; pays "France". GPS approximatifs a 5 decimales (a confirmer par le client, le flag): lat 47.35530, lng 1.74720, zoom 13.

CAPACITE: maxGuests 6, bedrooms 3, bathrooms 1, surface 115, petsAllowed true. Couchages: ch1 1 lit double 160, ch2 1 lit double 160, ch3 2 lits simples 90.

LIENS REELS -> PricingConfig.bookingLinks: airbnb "https://www.airbnb.fr/rooms/1605140748799580144", booking "https://www.booking.com/hotel/fr/linstant-tranquille.fr.html", email "contact@linstant-tranquille.fr". jsonld: generateLodgingBusinessJsonLd doit exposer sameAs = [airbnb, booking, + socialLinks facebook/instagram s'ils existent]. Si pas de champ dedie, construire sameAs depuis bookingLinks + socialLinks.

HORAIRES: checkIn "A partir de 17h00" (ISO checkinTime 17:00), checkOut "Avant 10h00" (ISO checkoutTime 10:00). Arrivee autonome (boite a cle securisee).

DESCRIPTION SOBRE (reutiliser, zero cliche): "Une maison familiale paisible a Romorantin-Lanthenay, au coeur de la Sologne. 3 chambres (6 couchages), terrasse avec barbecue, cuisine equipee, baby-foot et jeux de societe, jardin clos. Wifi gratuit, parking prive. Ideal en famille (meme avec ados) ou entre amis." PURGER tout "gite de charme" / "havre de paix" / "parenthese nature" restant (seed, globals, i18n).

AMENITIES (remplacer la liste seed par le reel, icon Lucide adapte, enabled true): Wifi gratuit, Television, Cuisine equipee, Lave-vaisselle, Cafetiere Dolce Gusto, Cheminee, Baby-foot, Jeux de societe, Terrasse avec barbecue, Jardin prive cloture, Parking prive gratuit, Seche-cheveux, Linge & serviettes fournis, Animaux acceptes, Non-fumeurs. ABSENCES a exposer en amenityFeature value:false (jsonld): detecteur de monoxyde de carbone, acces PMR.

TESTIMONIALS (REMPLACER les faux 'Sophie & Marc/havre de paix' par ces VRAIS avis; status approved; featured les 4 premiers; ratings 5):
- Julien (airbnb, 2026-04): "Nous avons passe un excellent week-end de Paques dans cette maison. Erick est un hote accueillant, sympathique et tres disponible. La maison est decoree avec gout et tres fonctionnelle. Linge et literie de qualite. Cuisine tres bien equipee. Nous reviendrons avec grand plaisir !"
- Laura (airbnb, 2026-05): "Tres bon sejour, accueil chaleureux des l'arrivee. Logement impeccable et tres propre. Literie confortable. Le baby-foot et les jeux de societe sont un vrai plus, tres convivial. Pour un logement de 3 chambres, le rapport qualite-prix est tres bon. Nous recommandons sans hesiter !"
- Hasan (airbnb, 2026-04): "Logement bien refait, propre et fonctionnel. Sejour tres bien passe. Communication et accueil tres sympathiques. Je recommande vivement."
- Stephanie (airbnb, 2026-04): "Merci pour la qualite de l'accueil. Une tres belle maison agreable, decoree avec soin et chaleur. C'est avec plaisir que nous reviendrons."
- Nicolas (airbnb, 2026-04): "Logement parfait, tres bien amenage et decore avec gout. Ideal pour une famille avec ados. Hote tres reactif."
- Arbi (airbnb, 2026-04): "Sejour tres satisfaisant, conforme a la description, propre et bien equipe. Nous recommandons sans hesitation."
- Philippe (airbnb, 2026-04): "Logement tres agreable, tres bien amenage avec beaucoup de gout, tres fonctionnel. Merci pour l'accueil et la bienveillance. Nous reviendrons."
- Anilia (booking, 2026): "J'ai adore la maison, tres bien situee. Je tiens surtout a souligner la disponibilite, la gentillesse et la qualite de l'hote."
- Stephane (booking, 2026): "Une charmante maison decoree avec gout, avec tout le confort necessaire pour y sejourner."

LOCAL RECOMMENDATIONS (distances reelles): Chateau de Cheverny (~30 min, 29 km), Chateau de Chambord (~35 min), Zoo de Beauval (~30 min), centre-ville Romorantin a 5-10 min a pied (boulangerie, restaurants, bars; marche mercredi et samedi matin). GARDER l'entree/categorie equestre (Grand Parquet de Lamotte-Beuvron) comme POSITIONNEMENT SEO. NE PAS inventer d'avis equestre (aucun avis reel ne mentionne les chevaux).

PROCEDURE: editer seed.ts + jsonld/config si besoin; re-seed la prod (script seed du package.json); node_modules/.bin/tsc --noEmit + biome check verts; verifier dans l'admin (NAP 41200, capacite 6/3/1/115, 9 testimonials, liens). Commit (git add par nom).`,
      },
      {
        id: "7.2",
        label: "hero mosaique 3 photos",
        db: true,
        desc: `Refaire le HERO de la landing en MOSAIQUE editoriale de 3 photos (choix client) au lieu d'une seule image. Photos: public/images/chambre-1-vue-ensemble-papier-peint-foret.webp (portrait, la plus spectaculaire), public/images/salon-cheminee-canapes-tv.webp (paysage), public/images/cuisine-equipee-verte-poutres.webp (paysage).

SCHEMA: ajouter au bloc conditionnel slug 'home' de src/collections/Pages.ts un champ heroImages = array de relations vers media (min 1, max 3), additif. Pousser le schema (next dev en bg). Seeder ces 3 Media dans heroImages via scripts/seed.ts.

COMPOSANT src/components/home/HeroSection.tsx: mosaique asymetrique responsive (desktop: grande image portrait 'chambre-foret' a gauche + salon et cuisine empilees a droite, grille 12 colonnes; mobile: empilement vertical propre). Titre display + eyebrow Playfair italic + CTA primaire 'Reserver' (lien plateforme PricingConfig) + secondaire, dans un panneau texte adjacent OU en bandeau sobre avec overlay leger (contraste AA garanti). LCP: priority + blur-up sur l'image principale. Fallback image unique si <3 heroImages. Respect palette/typo + prefers-reduced-motion.

Apres: node_modules/.bin/tsc --noEmit + biome check verts, re-seed, verifier le rendu (decrire). Commit (git add par nom).`,
      },
    ],
  },
};

const LENSES = [
  {
    key: "types-build",
    focus:
      "Types & build: tsc --noEmit et biome check passent-ils vraiment ? Trous de type, any caches, imports casses, regressions.",
  },
  {
    key: "conventions",
    focus:
      "Conventions CLAUDE.md: interface vs type, pas de barrel, pas de <div> wrapper inutile, pas de commentaires superflus, palette respectee (pas d'amber/rose brut), FR accents complets, pas de 'gite de charme'/cliche luxe.",
  },
  {
    key: "objectif",
    focus:
      "Objectif de la phase vs plan/spec: les deliverables de la phase sont-ils reellement faits et conformes a l'intention (design hybride sobre, axe cavaliers, photo-first) ?",
  },
  {
    key: "seo-a11y",
    focus:
      "SEO/GEO & accessibilite: JSON-LD valide, metadata/hreflang corrects, alt/aria/focus, i18n fr/en symetrique, Core Web Vitals (JS client minimal, dimensions images, blur-up).",
  },
];

const TASK_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string" },
    filesChanged: { type: "array", items: { type: "string" } },
    tscPass: { type: "boolean" },
    biomePass: { type: "boolean" },
    committed: { type: "boolean" },
    commitMsg: { type: "string" },
    notes: { type: "string" },
  },
  required: [
    "id",
    "filesChanged",
    "tscPass",
    "biomePass",
    "committed",
    "notes",
  ],
};

const REVIEW_SCHEMA = {
  type: "object",
  properties: {
    blocking: { type: "boolean" },
    summary: { type: "string" },
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          severity: { type: "string", enum: ["blocking", "warning", "nit"] },
          file: { type: "string" },
          issue: { type: "string" },
          fix: { type: "string" },
        },
        required: ["severity", "issue", "fix"],
      },
    },
  },
  required: ["blocking", "summary", "findings"],
};

function taskPrompt(t, pid, ph) {
  const dbNote = t.db
    ? "\nSCHEMA PAYLOAD: cette tache change le schema. Lance `node_modules/.bin/next dev` en arriere-plan, attends le push du schema dans les logs, puis arrete-le, AVANT toute verification/seed/build."
    : "";
  return `Tu es un developpeur senior sur le projet L'Instant Tranquille (Next.js 16 + Payload CMS + next-intl + Tailwind v4 + shadcn).

D'ABORD lis integralement le plan ${PLAN} (surtout la section "Global Constraints" et la Task ${t.id}) et le spec ${SPEC} pour le contexte.

TACHE ${t.id} (phase ${pid} — ${ph.title}) : ${t.desc}

CONTRAINTES NON NEGOCIABLES:
- ${CONSTRAINTS}
${dbNote}

PROCEDURE:
1. Implemente UNIQUEMENT les fichiers de cette tache (ne deborde pas sur d'autres taches).
2. Verifie: node_modules/.bin/tsc --noEmit puis node_modules/.bin/biome check . — corrige toute erreur (biome peut auto-fix avec --write).
3. Commit: git add <fichiers par NOM> (jamais -A ni .) puis message conventionnel court en FR (HEREDOC pour le formatting).

Retourne le resume structure (id, filesChanged, tscPass, biomePass, committed, commitMsg, notes incluant tout report/bloquant).`;
}

function reviewPrompt(lens, pid, ph, changed) {
  return `REVUE ADVERSE EN LECTURE SEULE (ne modifie AUCUN fichier, ne commit pas) du projet L'Instant Tranquille.

Contexte: phase ${pid} (${ph.title}) du plan ${PLAN} vient d'etre implementee. Fichiers touches: ${changed.join(", ") || "(voir git log)"}.

Inspecte le travail: \`git log --oneline -n 12\`, \`git diff HEAD~${ph.tasks.length}..HEAD\` (ajuste si besoin), et lis les fichiers concernes.

LENTILLE DE REVUE — ${lens.key}: ${lens.focus}

Sois exigeant et concret. Pour chaque probleme: severity (blocking = casse le build/objectif/contrainte; warning; nit), file, issue, fix propose. Ne signale que du reel (pas de bikeshedding). Retourne {blocking, summary, findings}.`;
}

function fixPrompt(pid, ph, blocking) {
  const list = blocking
    .map((f, i) => `${i + 1}. [${f.file || "?"}] ${f.issue} -> ${f.fix}`)
    .join("\n");
  return `Tu corriges les findings BLOQUANTS de la revue de la phase ${pid} (${ph.title}) du projet L'Instant Tranquille. Respecte les Global Constraints du plan ${PLAN}.

FINDINGS BLOQUANTS:
${list}

Corrige-les, verifie node_modules/.bin/tsc --noEmit + node_modules/.bin/biome check ., puis commit (git add par nom + message FR). Retourne un resume des corrections.`;
}

const requested = Array.isArray(args && args.phases)
  ? args.phases
  : args && typeof args.phase === "number"
    ? [args.phase]
    : [0, 1, 2, 3, 4, 5, 6];

const results = [];
for (const pid of requested) {
  const ph = PHASES[pid];
  if (!ph) {
    log(`Phase ${pid} inconnue, ignoree`);
    continue;
  }

  phase("Implement");
  log(`Phase ${pid} — ${ph.title} : ${ph.tasks.length} tache(s) en sequentiel`);
  const taskResults = [];
  const changedFiles = [];
  for (const t of ph.tasks) {
    const r = await agent(taskPrompt(t, pid, ph), {
      label: `P${pid}:${t.id} ${t.label}`,
      phase: "Implement",
      schema: TASK_SCHEMA,
      effort: "high",
    });
    taskResults.push(r);
    if (r && Array.isArray(r.filesChanged))
      changedFiles.push(...r.filesChanged);
    log(
      `  ${t.id} ${t.label} -> ${r ? (r.committed ? "commit" : "PAS de commit") : "ECHEC"}${r && (!r.tscPass || !r.biomePass) ? " (verif KO)" : ""}`,
    );
  }

  phase("Review");
  const reviews = (
    await parallel(
      LENSES.map(
        (lens) => () =>
          agent(reviewPrompt(lens, pid, ph, changedFiles), {
            label: `review:P${pid}:${lens.key}`,
            phase: "Review",
            schema: REVIEW_SCHEMA,
            effort: "high",
          }),
      ),
    )
  ).filter(Boolean);
  const allFindings = reviews.flatMap((r) => r.findings || []);
  const blocking = allFindings.filter((f) => f.severity === "blocking");
  log(
    `Phase ${pid} revue: ${blocking.length} bloquant(s), ${allFindings.filter((f) => f.severity === "warning").length} warning(s)`,
  );

  if (blocking.length) {
    phase("Fix");
    const fix = await agent(fixPrompt(pid, ph, blocking), {
      label: `fix:P${pid}`,
      phase: "Fix",
      effort: "high",
    });
    results.push({
      phase: pid,
      title: ph.title,
      tasks: taskResults,
      blocking,
      fixed: !!fix,
      fixSummary: fix,
    });
  } else {
    results.push({
      phase: pid,
      title: ph.title,
      tasks: taskResults,
      blocking: [],
      fixed: true,
    });
  }
}

return results
