import { getPayload } from "payload";
import config from "../src/payload.config";

async function seed() {
  const payload = await getPayload({ config });

  console.log("Creating admin user...");
  await payload.create({
    collection: "users",
    data: {
      email: "admin@instant-tranquille.com",
      password: "RxSDUJO981NTzCvu",
    },
  });

  console.log("Seeding SiteSettings...");
  await payload.updateGlobal({
    slug: "site-settings",
    locale: "fr",
    data: {
      siteName: "L'Instant Tranquille",
      tagline: "Votre parenthèse nature au cœur de la Sologne",
      siteDescription: "Découvrez L'Instant Tranquille, un gîte de charme au cœur de la Sologne.",
      propertyDetails: { maxGuests: 6, bedrooms: 3, bathrooms: 2, surface: 120 },
      contact: {
        email: "contact@linstant-tranquille.fr",
        phone: "+33 6 12 34 56 78",
        address: "Sologne, 41000\nCentre-Val de Loire\nFrance",
        coordinates: { lat: 47.4833, lng: 1.7667, zoom: 12, markerLabel: "L'Instant Tranquille" },
      },
      accessRoutes: [
        { from: "Paris", duration: "2h00", distance: "190 km", description: "A10 direction Orléans, puis sortie Blois / Sologne" },
        { from: "Tours", duration: "1h00", distance: "80 km", description: "A85 puis D956 direction Romorantin" },
        { from: "Orléans", duration: "1h15", distance: "90 km", description: "N20 puis D922 direction Sologne" },
      ],
      socialLinks: { facebook: "https://www.facebook.com/linstanttranquille", instagram: "https://www.instagram.com/linstanttranquille" },
      faqs: [
        { question: "Combien de personnes le gîte peut-il accueillir ?", answer: { root: { type: "root", children: [{ type: "paragraph", children: [{ type: "text", text: "Le gîte peut accueillir jusqu'à 6 personnes dans 3 chambres." }], direction: "ltr", format: "", indent: 0, version: 1 }], direction: "ltr", format: "", indent: 0, version: 1 } } },
        { question: "Les animaux sont-ils acceptés ?", answer: { root: { type: "root", children: [{ type: "paragraph", children: [{ type: "text", text: "Les animaux de compagnie sont les bienvenus sous conditions. Contactez-nous." }], direction: "ltr", format: "", indent: 0, version: 1 }], direction: "ltr", format: "", indent: 0, version: 1 } } },
      ],
      defaultSeo: { metaTitle: "L'Instant Tranquille — Gîte en Sologne", metaDescription: "Gîte de charme en Sologne, 6 personnes, 3 chambres, 120m²." },
    },
  });
  await payload.updateGlobal({
    slug: "site-settings",
    locale: "en",
    data: {
      tagline: "Your nature retreat in the heart of Sologne",
      siteDescription: "Discover L'Instant Tranquille, a charming cottage in the heart of Sologne.",
      accessRoutes: [
        { from: "Paris", duration: "2h00", distance: "190 km", description: "A10 towards Orléans, then exit Blois / Sologne" },
        { from: "Tours", duration: "1h00", distance: "80 km", description: "A85 then D956 towards Romorantin" },
        { from: "Orléans", duration: "1h15", distance: "90 km", description: "N20 then D922 towards Sologne" },
      ],
      faqs: [
        { question: "How many guests can the cottage accommodate?", answer: { root: { type: "root", children: [{ type: "paragraph", children: [{ type: "text", text: "The cottage accommodates up to 6 guests in 3 bedrooms." }], direction: "ltr", format: "", indent: 0, version: 1 }], direction: "ltr", format: "", indent: 0, version: 1 } } },
        { question: "Are pets allowed?", answer: { root: { type: "root", children: [{ type: "paragraph", children: [{ type: "text", text: "Pets are welcome under conditions. Contact us." }], direction: "ltr", format: "", indent: 0, version: 1 }], direction: "ltr", format: "", indent: 0, version: 1 } } },
      ],
      defaultSeo: { metaTitle: "L'Instant Tranquille — Charming Cottage in Sologne", metaDescription: "Charming cottage in Sologne, 6 guests, 3 bedrooms, 120m²." },
    },
  });

  console.log("Seeding Header...");
  await payload.updateGlobal({ slug: "header", locale: "fr", data: {
    navItems: [
      { label: "Accueil", url: "/", isExternal: false, highlight: false },
      { label: "Le Gîte", url: "/le-gite", isExternal: false, highlight: false },
      { label: "Tarifs & Réservation", url: "/tarifs-reservation", isExternal: false, highlight: false },
      { label: "Contact", url: "/contact", isExternal: false, highlight: false },
    ],
    ctaButton: { label: "Réserver", url: "/tarifs-reservation" },
  }});
  await payload.updateGlobal({ slug: "header", locale: "en", data: {
    navItems: [
      { label: "Home", url: "/", isExternal: false, highlight: false },
      { label: "The Cottage", url: "/le-gite", isExternal: false, highlight: false },
      { label: "Rates & Booking", url: "/tarifs-reservation", isExternal: false, highlight: false },
      { label: "Contact", url: "/contact", isExternal: false, highlight: false },
    ],
    ctaButton: { label: "Book now", url: "/tarifs-reservation" },
  }});

  console.log("Seeding Footer...");
  await payload.updateGlobal({ slug: "footer", locale: "fr", data: {
    description: "Un gîte de charme au cœur de la Sologne, entre forêts et châteaux de la Loire.",
    navColumns: [
      { title: "Navigation", links: [
        { label: "Accueil", url: "/", isExternal: false },
        { label: "Le Gîte", url: "/le-gite", isExternal: false },
        { label: "Tarifs", url: "/tarifs-reservation", isExternal: false },
        { label: "Contact", url: "/contact", isExternal: false },
      ]},
      { title: "Ressources", links: [
        { label: "Airbnb", url: "https://www.airbnb.fr", isExternal: true },
        { label: "Booking", url: "https://www.booking.com", isExternal: true },
      ]},
    ],
    legalText: "L'Instant Tranquille — Gîte de vacances en Sologne. Tous droits réservés.",
  }});
  await payload.updateGlobal({ slug: "footer", locale: "en", data: {
    description: "A charming cottage in the heart of Sologne, between forests and Loire Valley castles.",
    navColumns: [
      { title: "Navigation", links: [
        { label: "Home", url: "/", isExternal: false },
        { label: "The Cottage", url: "/le-gite", isExternal: false },
        { label: "Rates", url: "/tarifs-reservation", isExternal: false },
        { label: "Contact", url: "/contact", isExternal: false },
      ]},
      { title: "Resources", links: [
        { label: "Airbnb", url: "https://www.airbnb.fr", isExternal: true },
        { label: "Booking", url: "https://www.booking.com", isExternal: true },
      ]},
    ],
    legalText: "L'Instant Tranquille — Holiday cottage in Sologne. All rights reserved.",
  }});

  console.log("Seeding PricingConfig...");
  await payload.updateGlobal({ slug: "pricing-config", locale: "fr", data: {
    currency: "EUR",
    seasons: [
      { name: "Basse saison", dateRange: { start: "1er novembre", end: "31 mars" }, nightlyRate: 90, weeklyRate: 540, minimumStay: 2, color: "green" },
      { name: "Moyenne saison", dateRange: { start: "1er avril", end: "30 juin" }, nightlyRate: 120, weeklyRate: 720, minimumStay: 3, color: "orange" },
      { name: "Haute saison", dateRange: { start: "1er juillet", end: "31 août" }, nightlyRate: 150, weeklyRate: 900, minimumStay: 7, color: "red" },
      { name: "Très haute saison", dateRange: { start: "Fêtes", end: "et ponts" }, nightlyRate: 170, weeklyRate: 1020, minimumStay: 3, color: "purple" },
    ],
    additionalFees: [
      { name: "Ménage de fin de séjour", amount: 60, type: "per_stay", description: "Obligatoire" },
      { name: "Linge de lit", amount: 15, type: "per_person", description: "Optionnel, draps et serviettes" },
      { name: "Taxe de séjour", amount: 1.1, type: "per_night", description: "Par personne et par nuit" },
    ],
    bookingLinks: { airbnb: "https://www.airbnb.fr", booking: "https://www.booking.com", email: "contact@linstant-tranquille.fr" },
    policies: {
      cancellation: { root: { type: "root", children: [{ type: "paragraph", children: [{ type: "text", text: "Annulation gratuite jusqu'à 30 jours avant l'arrivée. 50% entre 30 et 14 jours. Aucun remboursement dans les 14 derniers jours." }], direction: "ltr", format: "", indent: 0, version: 1 }], direction: "ltr", format: "", indent: 0, version: 1 } },
      deposit: { root: { type: "root", children: [{ type: "paragraph", children: [{ type: "text", text: "Caution de 300€ demandée à l'arrivée, restituée sous 7 jours après vérification." }], direction: "ltr", format: "", indent: 0, version: 1 }], direction: "ltr", format: "", indent: 0, version: 1 } },
      checkIn: "À partir de 16h00",
      checkOut: "Avant 10h00",
      additional: { root: { type: "root", children: [{ type: "paragraph", children: [{ type: "text", text: "Ménage obligatoire. Linge disponible en option. Animaux sur demande." }], direction: "ltr", format: "", indent: 0, version: 1 }], direction: "ltr", format: "", indent: 0, version: 1 } },
    },
  }});

  console.log("Seeding Pages...");
  await payload.create({ collection: "pages", locale: "fr", data: { title: "Accueil", slug: "home", heroTitle: "L'Instant Tranquille", heroSubtitle: "Votre parenthèse nature au cœur de la Sologne", introTitle: "Bienvenue en Sologne", _status: "published" } });
  await payload.create({ collection: "pages", locale: "fr", data: { title: "Le Gîte", slug: "le-gite", descriptionTitle: "Une maison de caractère", _status: "published" } });
  await payload.create({ collection: "pages", locale: "fr", data: { title: "Tarifs & Réservation", slug: "tarifs-reservation", _status: "published" } });
  await payload.create({ collection: "pages", locale: "fr", data: { title: "Contact", slug: "contact", _status: "published" } });

  console.log("Seeding Amenities...");
  const amenities = [
    { name: "WiFi haut débit", icon: "wifi", category: "indoor" },
    { name: "TV écran plat", icon: "tv", category: "indoor" },
    { name: "Lave-linge", icon: "washing-machine", category: "indoor" },
    { name: "Cheminée", icon: "flame", category: "indoor" },
    { name: "Literie premium", icon: "bed-double", category: "indoor" },
    { name: "Jardin 3 hectares", icon: "trees", category: "outdoor" },
    { name: "Parking privé", icon: "car", category: "outdoor" },
    { name: "Terrasse", icon: "sun", category: "outdoor" },
    { name: "Cuisine équipée", icon: "utensils", category: "kitchen" },
    { name: "Réfrigérateur", icon: "refrigerator", category: "kitchen" },
    { name: "Machine à café", icon: "coffee", category: "kitchen" },
    { name: "Chauffage central", icon: "heater", category: "comfort" },
    { name: "Draps & serviettes", icon: "bath", category: "comfort" },
  ];
  for (let i = 0; i < amenities.length; i++) {
    await payload.create({ collection: "amenities", locale: "fr", data: { ...amenities[i], order: i, enabled: true } });
  }

  console.log("Seeding Testimonials...");
  const testimonials = [
    { guestName: "Sophie & Marc", guestOrigin: "Paris", rating: 5, text: "Un séjour magique dans cette maison pleine de charme. Le calme, la nature, tout était parfait.", source: "airbnb", stayDate: "2025-08-15" },
    { guestName: "Emma Johnson", guestOrigin: "London", rating: 5, text: "Absolutely wonderful place! Beautifully renovated cottage with breathtaking surroundings.", source: "booking", stayDate: "2025-07-20" },
    { guestName: "Pierre & Anne", guestOrigin: "Lyon", rating: 4, text: "Très beau gîte, bien situé pour visiter les châteaux. Nous reviendrons !", source: "direct", stayDate: "2025-06-10" },
    { guestName: "Hans & Greta", guestOrigin: "Berlin", rating: 5, text: "Wunderschönes Ferienhaus! Die Natur drumherum ist fantastisch.", source: "airbnb", stayDate: "2025-09-01" },
    { guestName: "Famille Moreau", guestOrigin: "Bordeaux", rating: 5, text: "Nos enfants ont adoré le jardin. Un vrai havre de paix.", source: "google", stayDate: "2025-04-15" },
    { guestName: "Laura & David", guestOrigin: "Bruxelles", rating: 4, text: "Cadre idyllique, maison très confortable. La Sologne est magnifique.", source: "booking", stayDate: "2025-05-20" },
  ];
  for (const t of testimonials) {
    await payload.create({ collection: "testimonials", locale: "fr", data: { ...t, status: "approved", featured: true } });
  }

  console.log("Seeding LocalRecommendations...");
  const recommendations = [
    { name: "Château de Chambord", category: "castles", description: "Le plus grand château de la Loire, chef-d'œuvre de la Renaissance.", distanceFromGite: "30 min", website: "https://www.chambord.org", featured: true, order: 0 },
    { name: "Château de Cheverny", category: "castles", description: "Château meublé d'époque, inspirateur du château de Moulinsart.", distanceFromGite: "25 min", website: "https://www.chateau-cheverny.fr", featured: true, order: 1 },
    { name: "Zoo de Beauval", category: "activities", description: "L'un des plus beaux zoos d'Europe, avec pandas et koalas.", distanceFromGite: "45 min", website: "https://www.zoobeauval.com", featured: true, order: 2 },
    { name: "Étang de Sologne", category: "nature", description: "Randonnée paisible autour des étangs typiques de la Sologne.", distanceFromGite: "10 min à pied", featured: true, order: 3 },
  ];
  for (const r of recommendations) {
    await payload.create({ collection: "local-recommendations", locale: "fr", data: r });
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((e) => { console.error("Seed failed:", e); process.exit(1); });
