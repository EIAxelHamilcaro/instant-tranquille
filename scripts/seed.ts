import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { loadEnvConfig } = nextEnv as unknown as {
  loadEnvConfig: (dir: string) => void;
};
loadEnvConfig(path.resolve(__dirname, ".."));
const IMAGES_DIR = path.resolve(__dirname, "../public/images");

// Mapping explicite des 19 .webp → métadonnées
const IMAGE_MAP = [
  {
    filename: "entree-commode-deco-briques.webp",
    altFr: "Entrée du gîte, commode décorée et mur de briques",
    altEn: "Gîte entrance, decorated dresser and brick wall",
    captionFr: "L'entrée — brique et décoration artisanale",
    captionEn: "Entrance — brick and handcrafted decor",
    category: "entree",
  },
  {
    filename: "entree-detail-lampe-vase-briques.webp",
    altFr: "Détail entrée : lampe et vase devant les briques",
    altEn: "Entrance detail: lamp and vase against brick wall",
    captionFr: "Détail entrée — ambiance chaleureuse",
    captionEn: "Entrance detail — warm atmosphere",
    category: "entree",
  },
  {
    filename: "entree-porte-manteau-papier-peint-herons.webp",
    altFr: "Entrée avec porte-manteau et papier peint hérons",
    altEn: "Entrance with coat rack and heron wallpaper",
    captionFr: "Entrée — papier peint hérons",
    captionEn: "Entrance — heron wallpaper",
    category: "entree",
  },
  {
    filename: "chambre-1-lit-double-vert-sauge.webp",
    altFr: "Chambre 1 — lit double, tons vert sauge",
    altEn: "Bedroom 1 — double bed, sage green tones",
    captionFr: "Chambre 1 — lit double vert sauge",
    captionEn: "Bedroom 1 — sage green double bed",
    category: "chambre",
  },
  {
    filename: "chambre-1-vue-ensemble-papier-peint-foret.webp",
    altFr: "Chambre 1 — vue d'ensemble, papier peint forêt",
    altEn: "Bedroom 1 — full view, forest wallpaper",
    captionFr: "Chambre 1 — vue d'ensemble",
    captionEn: "Bedroom 1 — full view",
    category: "chambre",
  },
  {
    filename: "chambre-2-lit-double-sous-pente-terracotta.webp",
    altFr: "Chambre 2 — lit double sous les combles, tons terracotta",
    altEn: "Bedroom 2 — double bed under the eaves, terracotta tones",
    captionFr: "Chambre 2 — sous pente terracotta",
    captionEn: "Bedroom 2 — terracotta sloped ceiling",
    category: "chambre",
  },
  {
    filename: "chambre-2-tete-de-lit-sous-pente.webp",
    altFr: "Chambre 2 — tête de lit sous les combles",
    altEn: "Bedroom 2 — headboard under the eaves",
    captionFr: "Chambre 2 — tête de lit",
    captionEn: "Bedroom 2 — headboard",
    category: "chambre",
  },
  {
    filename: "chambre-3-lits-simples-sous-pente.webp",
    altFr: "Chambre 3 — lits simples sous les combles",
    altEn: "Bedroom 3 — twin beds under the eaves",
    captionFr: "Chambre 3 — lits simples",
    captionEn: "Bedroom 3 — twin beds",
    category: "chambre",
  },
  {
    filename: "sejour-canape-buffet-escalier.webp",
    altFr: "Séjour — canapé, buffet et escalier",
    altEn: "Living room — sofa, sideboard and staircase",
    captionFr: "Séjour — espace de vie",
    captionEn: "Living room — living space",
    category: "sejour",
  },
  {
    filename: "sejour-canape-tv-escalier.webp",
    altFr: "Séjour — canapé, télévision et escalier",
    altEn: "Living room — sofa, TV and staircase",
    captionFr: "Séjour — coin télévision",
    captionEn: "Living room — TV area",
    category: "sejour",
  },
  {
    filename: "salon-cheminee-canapes-tv.webp",
    altFr: "Salon avec cheminée, canapés et télévision",
    altEn: "Lounge with fireplace, sofas and TV",
    captionFr: "Salon — cheminée et confort",
    captionEn: "Lounge — fireplace and comfort",
    category: "salon",
  },
  {
    filename: "salon-baby-foot-mur-briques.webp",
    altFr: "Salon — baby-foot devant le mur de briques",
    altEn: "Lounge — foosball table against brick wall",
    captionFr: "Salon — baby-foot et briques",
    captionEn: "Lounge — foosball and brick wall",
    category: "salon",
  },
  {
    filename: "cuisine-equipee-verte-poutres.webp",
    altFr: "Cuisine équipée verte avec poutres apparentes",
    altEn: "Fully equipped green kitchen with exposed beams",
    captionFr: "Cuisine — verte et bien équipée",
    captionEn: "Kitchen — green and fully equipped",
    category: "cuisine",
  },
  {
    filename: "detail-deco-coiffeuse-miroir-chambre-1.webp",
    altFr: "Détail décoration — coiffeuse et miroir, chambre 1",
    altEn: "Decor detail — dressing table and mirror, bedroom 1",
    captionFr: "Chambre 1 — coiffeuse",
    captionEn: "Bedroom 1 — dressing table",
    category: "detail",
  },
  {
    filename: "detail-deco-cuisine-cloche-bronze.webp",
    altFr: "Détail décoration cuisine — cloche en bronze",
    altEn: "Kitchen decor detail — bronze cloche",
    captionFr: "Cuisine — cloche bronze",
    captionEn: "Kitchen — bronze cloche",
    category: "detail",
  },
  {
    filename: "detail-deco-vase-visage-dore.webp",
    altFr: "Détail décoration — vase visage doré",
    altEn: "Decor detail — golden face vase",
    captionFr: "Détail déco — vase doré",
    captionEn: "Decor detail — golden vase",
    category: "detail",
  },
  {
    filename: "jardin-terrasse-vue-ensemble.webp",
    altFr: "Vue d'ensemble du jardin et de la terrasse",
    altEn: "Full view of the garden and terrace",
    captionFr: "Jardin — vue d'ensemble",
    captionEn: "Garden — full view",
    category: "jardin",
  },
  {
    filename: "jardin-souche-arbre-decorative.webp",
    altFr: "Jardin — souche d'arbre décorative",
    altEn: "Garden — decorative tree stump",
    captionFr: "Jardin — détail naturel",
    captionEn: "Garden — natural detail",
    category: "jardin",
  },
  {
    filename: "terrasse-salon-jardin.webp",
    altFr: "Terrasse avec salon de jardin",
    altEn: "Terrace with garden furniture",
    captionFr: "Terrasse — salon extérieur",
    captionEn: "Terrace — outdoor lounge",
    category: "jardin",
  },
] as const;

async function seed() {
  const { getPayload } = await import("payload");
  const { default: config } = await import("../src/payload.config");
  const payload = await getPayload({ config });

  // ── Purge des collections (seed re-jouable) ─────────────────────────────────
  console.log("Purging collections...");
  await payload.delete({ collection: "pages", where: {} });
  await payload.delete({ collection: "amenities", where: {} });
  await payload.delete({ collection: "testimonials", where: {} });
  await payload.delete({
    collection: "local-recommendations",
    where: {},
  });
  await payload.delete({ collection: "media", where: {} });

  // ── Admin (find-or-create) ──────────────────────────────────────────────────
  console.log("Creating admin user...");
  try {
    await payload.create({
      collection: "users",
      data: {
        email: "admin@instant-tranquille.com",
        password: "RxSDUJO981NTzCvu",
      },
    });
  } catch {
    console.log("Admin user already exists, skipping.");
  }

  // ── Media : 19 photos ──────────────────────────────────────────────────────
  console.log("Creating media (19 images)...");
  const mediaIds: Record<string, number> = {};
  for (const img of IMAGE_MAP) {
    const filePath = path.join(IMAGES_DIR, img.filename);
    const created = await payload.create({
      collection: "media",
      filePath,
      locale: "fr",
      data: {
        alt: img.altFr,
        caption: img.captionFr,
      },
    });
    // Save EN locale
    await payload.update({
      collection: "media",
      id: created.id,
      locale: "en",
      data: {
        alt: img.altEn,
        caption: img.captionEn,
      },
    });
    mediaIds[img.filename] = created.id as number;
    console.log(`  ✓ ${img.filename} → id ${created.id}`);
  }

  // ── SiteSettings ───────────────────────────────────────────────────────────
  console.log("Seeding SiteSettings...");
  await payload.updateGlobal({
    slug: "site-settings",
    locale: "fr",
    data: {
      siteName: "L'Instant Tranquille",
      tagline: "Un gîte en Sologne, entre forêts et étangs",
      siteDescription:
        "Gîte en Sologne à Romorantin-Lanthenay — 6 personnes, 3 chambres, 2 salles de bains, 120 m². Proche des châteaux de la Loire et du Grand Parquet de Lamotte-Beuvron.",
      propertyDetails: {
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        surface: 120,
      },
      contact: {
        email: "contact@linstant-tranquille.fr",
        phone: "+33 6 12 34 56 78",
        address: "Romorantin-Lanthenay, 41200\nLoir-et-Cher\nFrance",
        coordinates: {
          lat: 47.3608,
          lng: 1.7492,
          zoom: 12,
          markerLabel: "L'Instant Tranquille",
        },
      },
      accessRoutes: [
        {
          from: "Paris",
          duration: "2h00",
          distance: "190 km",
          description: "A10 direction Orléans, puis sortie Blois / Sologne",
        },
        {
          from: "Tours",
          duration: "1h00",
          distance: "80 km",
          description: "A85 puis D956 direction Romorantin",
        },
        {
          from: "Orléans",
          duration: "1h15",
          distance: "90 km",
          description: "N20 puis D922 direction Sologne",
        },
      ],
      socialLinks: {
        facebook: "https://www.facebook.com/linstanttranquille",
        instagram: "https://www.instagram.com/linstanttranquille",
      },
      faqs: [
        {
          question: "Combien de personnes le gîte peut-il accueillir ?",
          answer: {
            root: {
              type: "root",
              children: [
                {
                  type: "paragraph",
                  children: [
                    {
                      type: "text",
                      text: "Le gîte accueille jusqu'à 6 personnes dans 3 chambres (2 lits doubles, 2 lits simples).",
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          },
        },
        {
          question: "Les animaux sont-ils acceptés ?",
          answer: {
            root: {
              type: "root",
              children: [
                {
                  type: "paragraph",
                  children: [
                    {
                      type: "text",
                      text: "Les animaux de compagnie sont acceptés sous conditions. Contactez-nous avant la réservation.",
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          },
        },
      ],
      defaultSeo: {
        metaTitle: "L'Instant Tranquille — Gîte en Sologne, Romorantin-Lanthenay",
        metaDescription:
          "Gîte en Sologne à Romorantin-Lanthenay, 6 personnes, 3 chambres, 120 m². Proche Chambord, Cheverny et Grand Parquet de Lamotte-Beuvron.",
      },
    },
  });
  await payload.updateGlobal({
    slug: "site-settings",
    locale: "en",
    data: {
      tagline: "A holiday cottage in Sologne, between forests and ponds",
      siteDescription:
        "Holiday cottage in Sologne, Romorantin-Lanthenay — 6 guests, 3 bedrooms, 2 bathrooms, 120 m². Close to Loire Valley châteaux and the Grand Parquet equestrian centre.",
      accessRoutes: [
        {
          from: "Paris",
          duration: "2h00",
          distance: "190 km",
          description: "A10 towards Orléans, then exit Blois / Sologne",
        },
        {
          from: "Tours",
          duration: "1h00",
          distance: "80 km",
          description: "A85 then D956 towards Romorantin",
        },
        {
          from: "Orléans",
          duration: "1h15",
          distance: "90 km",
          description: "N20 then D922 towards Sologne",
        },
      ],
      faqs: [
        {
          question: "How many guests can the cottage accommodate?",
          answer: {
            root: {
              type: "root",
              children: [
                {
                  type: "paragraph",
                  children: [
                    {
                      type: "text",
                      text: "The cottage accommodates up to 6 guests in 3 bedrooms (2 double beds, 2 single beds).",
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          },
        },
        {
          question: "Are pets allowed?",
          answer: {
            root: {
              type: "root",
              children: [
                {
                  type: "paragraph",
                  children: [
                    {
                      type: "text",
                      text: "Pets are accepted under conditions. Please contact us before booking.",
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          },
        },
      ],
      defaultSeo: {
        metaTitle: "L'Instant Tranquille — Holiday Cottage in Sologne, France",
        metaDescription:
          "Holiday cottage in Sologne, Romorantin-Lanthenay, 6 guests, 3 bedrooms, 120 m². Close to Chambord, Cheverny and Grand Parquet equestrian centre.",
      },
    },
  });

  // ── Header ─────────────────────────────────────────────────────────────────
  console.log("Seeding Header...");
  await payload.updateGlobal({
    slug: "header",
    locale: "fr",
    data: {
      navItems: [
        { label: "Accueil", url: "/", isExternal: false, highlight: false },
        {
          label: "Le Gîte",
          url: "/le-gite",
          isExternal: false,
          highlight: false,
        },
        {
          label: "Les Alentours",
          url: "/les-alentours",
          isExternal: false,
          highlight: false,
        },
        {
          label: "Tarifs & Réservation",
          url: "/tarifs-reservation",
          isExternal: false,
          highlight: false,
        },
        {
          label: "Contact",
          url: "/contact",
          isExternal: false,
          highlight: false,
        },
      ],
      ctaButton: { label: "Réserver", url: "/tarifs-reservation" },
    },
  });
  await payload.updateGlobal({
    slug: "header",
    locale: "en",
    data: {
      navItems: [
        { label: "Home", url: "/", isExternal: false, highlight: false },
        {
          label: "The Cottage",
          url: "/le-gite",
          isExternal: false,
          highlight: false,
        },
        {
          label: "Surroundings",
          url: "/les-alentours",
          isExternal: false,
          highlight: false,
        },
        {
          label: "Rates & Booking",
          url: "/tarifs-reservation",
          isExternal: false,
          highlight: false,
        },
        {
          label: "Contact",
          url: "/contact",
          isExternal: false,
          highlight: false,
        },
      ],
      ctaButton: { label: "Book now", url: "/tarifs-reservation" },
    },
  });

  // ── Footer ─────────────────────────────────────────────────────────────────
  console.log("Seeding Footer...");
  await payload.updateGlobal({
    slug: "footer",
    locale: "fr",
    data: {
      description:
        "Un gîte en Sologne à Romorantin-Lanthenay — forêts, étangs, châteaux de la Loire.",
      navColumns: [
        {
          title: "Navigation",
          links: [
            { label: "Accueil", url: "/", isExternal: false },
            { label: "Le Gîte", url: "/le-gite", isExternal: false },
            { label: "Les Alentours", url: "/les-alentours", isExternal: false },
            {
              label: "Tarifs",
              url: "/tarifs-reservation",
              isExternal: false,
            },
            { label: "Contact", url: "/contact", isExternal: false },
          ],
        },
        {
          title: "Réservation",
          links: [
            {
              label: "Airbnb",
              url: "https://www.airbnb.fr",
              isExternal: true,
            },
            {
              label: "Booking",
              url: "https://www.booking.com",
              isExternal: true,
            },
          ],
        },
      ],
      legalText:
        "L'Instant Tranquille — Gîte de vacances en Sologne. Tous droits réservés.",
    },
  });
  await payload.updateGlobal({
    slug: "footer",
    locale: "en",
    data: {
      description:
        "A holiday cottage in Sologne, Romorantin-Lanthenay — forests, ponds, Loire Valley châteaux.",
      navColumns: [
        {
          title: "Navigation",
          links: [
            { label: "Home", url: "/", isExternal: false },
            { label: "The Cottage", url: "/le-gite", isExternal: false },
            { label: "Surroundings", url: "/les-alentours", isExternal: false },
            { label: "Rates", url: "/tarifs-reservation", isExternal: false },
            { label: "Contact", url: "/contact", isExternal: false },
          ],
        },
        {
          title: "Booking",
          links: [
            {
              label: "Airbnb",
              url: "https://www.airbnb.fr",
              isExternal: true,
            },
            {
              label: "Booking",
              url: "https://www.booking.com",
              isExternal: true,
            },
          ],
        },
      ],
      legalText:
        "L'Instant Tranquille — Holiday cottage in Sologne. All rights reserved.",
    },
  });

  // ── PricingConfig ──────────────────────────────────────────────────────────
  console.log("Seeding PricingConfig...");
  await payload.updateGlobal({
    slug: "pricing-config",
    locale: "fr",
    data: {
      currency: "EUR",
      seasons: [
        {
          name: "Basse saison",
          startMonth: "11",
          startDay: 1,
          endMonth: "3",
          endDay: 31,
          nightlyRate: 90,
          weeklyRate: 540,
          minimumStay: 2,
          color: "green",
        },
        {
          name: "Moyenne saison",
          startMonth: "4",
          startDay: 1,
          endMonth: "6",
          endDay: 30,
          nightlyRate: 120,
          weeklyRate: 720,
          minimumStay: 3,
          color: "orange",
        },
        {
          name: "Haute saison",
          startMonth: "7",
          startDay: 1,
          endMonth: "8",
          endDay: 31,
          nightlyRate: 150,
          weeklyRate: 900,
          minimumStay: 7,
          color: "red",
        },
        {
          name: "Très haute saison",
          startMonth: "12",
          startDay: 20,
          endMonth: "1",
          endDay: 5,
          nightlyRate: 170,
          weeklyRate: 1020,
          minimumStay: 3,
          color: "purple",
        },
      ],
      additionalFees: [
        {
          name: "Ménage de fin de séjour",
          amount: 60,
          type: "per_stay",
          description: "Obligatoire",
        },
        {
          name: "Linge de lit",
          amount: 15,
          type: "per_person",
          description: "Optionnel — draps et serviettes",
        },
        {
          name: "Taxe de séjour",
          amount: 1.1,
          type: "per_night",
          description: "Par personne et par nuit",
        },
      ],
      bookingLinks: {
        airbnb: "https://www.airbnb.fr",
        booking: "https://www.booking.com",
        email: "contact@linstant-tranquille.fr",
      },
      policies: {
        cancellation: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text: "Annulation gratuite jusqu'à 30 jours avant l'arrivée. 50 % entre 30 et 14 jours. Aucun remboursement dans les 14 derniers jours.",
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
        },
        deposit: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text: "Caution de 300 € demandée à l'arrivée, restituée sous 7 jours après vérification.",
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
        },
        checkIn: "À partir de 16h00",
        checkOut: "Avant 10h00",
        additional: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text: "Ménage obligatoire. Linge disponible en option. Animaux sur demande.",
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
        },
      },
    },
  });

  // ── Pages ──────────────────────────────────────────────────────────────────
  console.log("Seeding Pages...");

  // Page home — avec heroImage et introImage câblés
  const heroImageId = mediaIds["salon-cheminee-canapes-tv.webp"];
  const introImageId = mediaIds["jardin-terrasse-vue-ensemble.webp"];

  await payload.create({
    collection: "pages",
    locale: "fr",
    data: {
      title: "Accueil",
      slug: "home",
      heroImage: heroImageId,
      heroTitle: "L'Instant Tranquille",
      heroSubtitle: "Un gîte en Sologne, entre forêts et étangs",
      introTitle: "Bienvenue en Sologne",
      introText: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  text: "À Romorantin-Lanthenay, en plein cœur de la Sologne, ce gîte de 120 m² accueille jusqu'à 6 personnes dans 3 chambres. Forêts, étangs, châteaux de la Loire — tout est à portée.",
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
        },
      },
      introImage: introImageId,
      highlights: [
        {
          icon: "trees",
          title: "Sologne nature",
          description:
            "Forêts, étangs et sentiers à deux pas. La faune sauvage au quotidien.",
          linkUrl: "/le-gite",
          linkLabel: "Découvrir",
        },
        {
          icon: "castle",
          title: "Châteaux de la Loire",
          description:
            "Chambord à 30 min, Cheverny à 25 min, Blois à 40 min.",
          linkUrl: "/contact",
          linkLabel: "Nous trouver",
        },
        {
          icon: "horse",
          title: "Cavaliers bienvenus",
          description:
            "Base idéale pour les concours au Grand Parquet de Lamotte-Beuvron (FFE), à ~17 km.",
        },
        {
          icon: "users",
          title: "6 personnes, 3 chambres",
          description: "120 m², 2 salles de bains, cuisine équipée, cheminée.",
          linkUrl: "/le-gite",
          linkLabel: "Voir le gîte",
        },
      ],
      _status: "published",
    },
  });
  // Page home EN locale
  const homePages = await payload.find({
    collection: "pages",
    where: { slug: { equals: "home" } },
    limit: 1,
  });
  const homeId = homePages.docs[0]?.id;
  if (homeId) {
    await payload.update({
      collection: "pages",
      id: homeId,
      locale: "en",
      data: {
        title: "Home",
        heroTitle: "L'Instant Tranquille",
        heroSubtitle: "A holiday cottage in Sologne, between forests and ponds",
        introTitle: "Welcome to Sologne",
        introText: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text: "In Romorantin-Lanthenay, at the heart of Sologne, this 120 m² cottage sleeps up to 6 guests in 3 bedrooms. Forests, ponds, Loire Valley châteaux — all within easy reach.",
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
        },
        highlights: [
          {
            icon: "trees",
            title: "Sologne nature",
            description:
              "Forests, ponds and trails nearby. Wildlife on your doorstep.",
            linkUrl: "/le-gite",
            linkLabel: "Discover",
          },
          {
            icon: "castle",
            title: "Loire Valley châteaux",
            description: "Chambord 30 min, Cheverny 25 min, Blois 40 min.",
            linkUrl: "/contact",
            linkLabel: "Find us",
          },
          {
            icon: "horse",
            title: "Ideal for riders",
            description:
              "Perfect base for events at Grand Parquet de Lamotte-Beuvron (FFE), ~17 km away.",
          },
          {
            icon: "users",
            title: "6 guests, 3 bedrooms",
            description:
              "120 m², 2 bathrooms, fully equipped kitchen, fireplace.",
            linkUrl: "/le-gite",
            linkLabel: "See the cottage",
          },
        ],
      },
    });
  }

  // Page le-gite — galerie et previewImages câblées
  const galleryImages = [
    "salon-cheminee-canapes-tv.webp",
    "chambre-1-lit-double-vert-sauge.webp",
    "chambre-1-vue-ensemble-papier-peint-foret.webp",
    "chambre-2-lit-double-sous-pente-terracotta.webp",
    "chambre-2-tete-de-lit-sous-pente.webp",
    "chambre-3-lits-simples-sous-pente.webp",
    "cuisine-equipee-verte-poutres.webp",
    "sejour-canape-buffet-escalier.webp",
    "sejour-canape-tv-escalier.webp",
    "salon-baby-foot-mur-briques.webp",
    "entree-commode-deco-briques.webp",
    "entree-porte-manteau-papier-peint-herons.webp",
    "jardin-terrasse-vue-ensemble.webp",
    "terrasse-salon-jardin.webp",
    "detail-deco-coiffeuse-miroir-chambre-1.webp",
    "detail-deco-cuisine-cloche-bronze.webp",
    "detail-deco-vase-visage-dore.webp",
  ];

  const previewImageFiles = [
    "salon-cheminee-canapes-tv.webp",
    "chambre-1-lit-double-vert-sauge.webp",
    "cuisine-equipee-verte-poutres.webp",
    "jardin-terrasse-vue-ensemble.webp",
  ];

  const gallery = galleryImages
    .filter((f) => mediaIds[f] !== undefined)
    .map((f) => ({ image: mediaIds[f] as number }));

  const previewImages = previewImageFiles
    .filter((f) => mediaIds[f] !== undefined)
    .map((f) => ({ image: mediaIds[f] as number }));

  await payload.create({
    collection: "pages",
    locale: "fr",
    data: {
      title: "Le Gîte",
      slug: "le-gite",
      descriptionTitle: "Un gîte en Sologne",
      descriptionText: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  text: "Maison de 120 m² à Romorantin-Lanthenay — 3 chambres, 2 salles de bains, salon avec cheminée, cuisine équipée, baby-foot. Jardin et terrasse. Capacité 6 personnes.",
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
        },
      },
      gallery,
      previewImages,
      _status: "published",
    },
  });

  // le-gite EN locale
  const gitePages = await payload.find({
    collection: "pages",
    where: { slug: { equals: "le-gite" } },
    limit: 1,
  });
  const giteId = gitePages.docs[0]?.id;
  if (giteId) {
    await payload.update({
      collection: "pages",
      id: giteId,
      locale: "en",
      data: {
        title: "The Cottage",
        descriptionTitle: "A cottage in Sologne",
        descriptionText: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text: "120 m² house in Romorantin-Lanthenay — 3 bedrooms, 2 bathrooms, lounge with fireplace, fully equipped kitchen, foosball table. Garden and terrace. Sleeps 6.",
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
        },
      },
    });
  }

  await payload.create({
    collection: "pages",
    locale: "fr",
    data: {
      title: "Les Alentours",
      slug: "les-alentours",
      heroTitle: "Les Alentours",
      heroSubtitle: "Châteaux, nature, équitation — la Sologne à portée de route",
      equestrianTitle: "Cavaliers & sports équestres",
      equestrianVenues: [
        {
          name: "Le Grand Parquet de Lamotte-Beuvron",
          description:
            "Site fédéral de la FFE, accueille le Generali Open de France et de nombreux concours de saut d'obstacles nationaux.",
          distanceFromGite: "~17 km — 20 min",
          website: "https://www.ffe.com",
        },
      ],
      _status: "published",
    },
  });
  const alentoursPages = await payload.find({
    collection: "pages",
    where: { slug: { equals: "les-alentours" } },
    limit: 1,
  });
  const alentoursId = alentoursPages.docs[0]?.id;
  if (alentoursId) {
    await payload.update({
      collection: "pages",
      id: alentoursId,
      locale: "en",
      data: {
        title: "Surroundings",
        heroTitle: "The Surroundings",
        heroSubtitle: "Châteaux, nature, equestrian sports — Sologne at your doorstep",
        equestrianTitle: "Riders & equestrian sports",
        equestrianVenues: [
          {
            name: "Le Grand Parquet de Lamotte-Beuvron",
            description:
              "FFE national equestrian centre hosting the Generali Open de France and major showjumping events.",
            distanceFromGite: "~17 km — 20 min",
            website: "https://www.ffe.com",
          },
        ],
      },
    });
  }

  await payload.create({
    collection: "pages",
    locale: "fr",
    data: {
      title: "Tarifs & Réservation",
      slug: "tarifs-reservation",
      _status: "published",
    },
  });
  await payload.create({
    collection: "pages",
    locale: "fr",
    data: { title: "Contact", slug: "contact", _status: "published" },
  });

  // ── Amenities ──────────────────────────────────────────────────────────────
  console.log("Seeding Amenities...");
  const amenities = [
    { name: "WiFi haut débit", icon: "wifi", category: "indoor" },
    { name: "TV écran plat", icon: "tv", category: "indoor" },
    { name: "Lave-linge", icon: "washing-machine", category: "indoor" },
    { name: "Cheminée", icon: "flame", category: "indoor" },
    { name: "Literie premium", icon: "bed-double", category: "indoor" },
    { name: "Jardin", icon: "trees", category: "outdoor" },
    { name: "Parking privé", icon: "car", category: "outdoor" },
    { name: "Terrasse", icon: "sun", category: "outdoor" },
    { name: "Cuisine équipée", icon: "utensils", category: "kitchen" },
    { name: "Réfrigérateur", icon: "refrigerator", category: "kitchen" },
    { name: "Machine à café", icon: "coffee", category: "kitchen" },
    { name: "Chauffage central", icon: "heater", category: "comfort" },
    { name: "Draps & serviettes", icon: "bath", category: "comfort" },
  ];
  for (let i = 0; i < amenities.length; i++) {
    await payload.create({
      collection: "amenities",
      locale: "fr",
      data: { ...amenities[i]!, order: i, enabled: true },
    });
  }

  // ── Testimonials ───────────────────────────────────────────────────────────
  console.log("Seeding Testimonials...");
  const testimonials = [
    {
      guestName: "Sophie & Marc",
      guestOrigin: "Paris",
      rating: 5,
      text: "Un séjour très agréable dans cette maison bien équipée. Le calme, la nature, tout était là.",
      source: "airbnb",
      stayDate: "2025-08-15",
    },
    {
      guestName: "Emma Johnson",
      guestOrigin: "London",
      rating: 5,
      text: "Wonderful place! A well-maintained cottage with lovely surroundings.",
      source: "booking",
      stayDate: "2025-07-20",
    },
    {
      guestName: "Pierre & Anne",
      guestOrigin: "Lyon",
      rating: 4,
      text: "Très bon gîte, bien situé pour visiter les châteaux. Nous reviendrons.",
      source: "direct",
      stayDate: "2025-06-10",
    },
    {
      guestName: "Hans & Greta",
      guestOrigin: "Berlin",
      rating: 5,
      text: "Schönes Ferienhaus! Die Natur drumherum ist wirklich beeindruckend.",
      source: "airbnb",
      stayDate: "2025-09-01",
    },
    {
      guestName: "Famille Moreau",
      guestOrigin: "Bordeaux",
      rating: 5,
      text: "Nos enfants ont adoré le jardin et le baby-foot. Un séjour réussi.",
      source: "google",
      stayDate: "2025-04-15",
    },
    {
      guestName: "Laura & David",
      guestOrigin: "Bruxelles",
      rating: 4,
      text: "Cadre paisible, maison très confortable. La Sologne est magnifique à découvrir.",
      source: "booking",
      stayDate: "2025-05-20",
    },
  ];
  for (const t of testimonials) {
    await payload.create({
      collection: "testimonials",
      locale: "fr",
      data: { ...t, status: "approved", featured: true },
    });
  }

  // ── LocalRecommendations ───────────────────────────────────────────────────
  console.log("Seeding LocalRecommendations...");
  const recommendations = [
    {
      name: "Château de Chambord",
      category: "castles",
      description:
        "Le plus grand château de la Loire, chef-d'œuvre de la Renaissance.",
      distanceFromGite: "30 min",
      website: "https://www.chambord.org",
      featured: true,
      order: 0,
    },
    {
      name: "Château de Cheverny",
      category: "castles",
      description: "Château meublé d'époque, inspirateur du château de Moulinsart.",
      distanceFromGite: "25 min",
      website: "https://www.chateau-cheverny.fr",
      featured: true,
      order: 1,
    },
    {
      name: "Zoo de Beauval",
      category: "activities",
      description: "L'un des plus grands zoos d'Europe, avec pandas et koalas.",
      distanceFromGite: "45 min",
      website: "https://www.zoobeauval.com",
      featured: true,
      order: 2,
    },
    {
      name: "Étangs de Sologne",
      category: "nature",
      description:
        "Randonnées et balades autour des étangs typiques de la Sologne.",
      distanceFromGite: "10 min",
      featured: true,
      order: 3,
    },
    {
      name: "Grand Parquet de Lamotte-Beuvron",
      category: "activities",
      description:
        "Site national de la Fédération Française d'Équitation. Accueille le Generali Open de France et de nombreux concours équestres. Base idéale pour les cavaliers en séjour.",
      distanceFromGite: "~17 km",
      website: "https://www.ffe.com",
      featured: true,
      order: 4,
    },
  ];
  for (const r of recommendations) {
    await payload.create({
      collection: "local-recommendations",
      locale: "fr",
      data: r,
    });
  }

  console.log("Seed complete! 19 images chargées.");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
