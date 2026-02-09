import fs from "fs";
import path from "path";
import { getPayload } from "@/lib/payload";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not allowed in production", { status: 403 });
  }

  const payload = await getPayload();
  const results: string[] = [];

  // Upload hero image
  let heroImageId: number | null = null;
  try {
    const heroPath = path.resolve(process.cwd(), "scripts/assets/hero-gite.jpg");
    if (fs.existsSync(heroPath)) {
      const buffer = fs.readFileSync(heroPath);
      const heroMedia = await payload.create({
        collection: "media",
        data: { alt: "Gîte de charme en Sologne — L'Instant Tranquille" },
        file: {
          data: buffer,
          name: "hero-gite.jpg",
          mimetype: "image/jpeg",
          size: buffer.length,
        },
      });
      heroImageId = heroMedia.id as number;
      results.push(`Hero image uploaded (id: ${heroImageId})`);
    } else {
      results.push("Hero image file not found at scripts/assets/hero-gite.jpg");
    }
  } catch (e) {
    results.push(`Error uploading hero image: ${e}`);
  }

  // Reset and create admin user
  try {
    const existingUsers = await payload.find({ collection: "users", limit: 100 });
    for (const user of existingUsers.docs) {
      await payload.delete({ collection: "users", id: user.id });
    }
    results.push(`Deleted ${existingUsers.docs.length} existing users`);
    await payload.create({
      collection: "users",
      data: {
        email: "admin@linstant-tranquille.fr",
        password: "changeme123",
      },
    });
    results.push("Admin user created");
  } catch (e) {
    results.push(`Error with admin user: ${e}`);
  }

  // Seed testimonials
  const testimonials = [
    {
      guestName: "Marie & Pierre Dupont",
      guestOrigin: "Paris, France",
      rating: 5,
      text: "Un séjour magique dans un cadre exceptionnel. Le gîte est magnifiquement rénové, très propre et parfaitement équipé. Le calme de la Sologne nous a ressourcés. Nous reviendrons sans hésiter !",
      source: "airbnb" as const,
      status: "approved" as const,
      featured: true,
      stayDate: "2024-07-15",
    },
    {
      guestName: "Sarah & James Wilson",
      guestOrigin: "London, UK",
      rating: 5,
      text: "A wonderful retreat in the French countryside. The cottage is beautifully decorated and the surroundings are simply stunning. Perfect base for exploring the Loire castles. Highly recommended!",
      source: "booking" as const,
      status: "approved" as const,
      featured: true,
      stayDate: "2024-08-20",
    },
    {
      guestName: "Thomas & Lisa Martin",
      guestOrigin: "Lyon, France",
      rating: 5,
      text: "L'endroit idéal pour déconnecter. Les enfants ont adoré le jardin et nous avons profité de balades en forêt inoubliables. Les recommandations de nos hôtes étaient parfaites.",
      source: "google" as const,
      status: "approved" as const,
      featured: true,
      stayDate: "2024-06-10",
    },
    {
      guestName: "Hans & Greta Müller",
      guestOrigin: "München, Deutschland",
      rating: 4,
      text: "Sehr schönes Ferienhaus in einer traumhaften Umgebung. Alles war sauber und gut ausgestattet. Die Lage ist perfekt für Ausflüge zu den Loire-Schlössern.",
      source: "booking" as const,
      status: "approved" as const,
      featured: false,
      stayDate: "2024-09-05",
    },
  ];

  for (const testimonial of testimonials) {
    try {
      await payload.create({ collection: "testimonials", data: testimonial });
    } catch {
      results.push(`Testimonial ${testimonial.guestName} might already exist`);
    }
  }
  results.push("Testimonials seeded");

  // Seed amenities
  const amenities = [
    { name: "WiFi haut débit", icon: "wifi", category: "comfort" as const, order: 1 },
    { name: "TV écran plat", icon: "tv", category: "indoor" as const, order: 2 },
    { name: "Lave-linge", icon: "washing-machine", category: "indoor" as const, order: 3 },
    { name: "Literie premium", icon: "bed-double", category: "indoor" as const, order: 4 },
    { name: "Cheminée", icon: "flame", category: "indoor" as const, order: 5 },
    { name: "Cuisine équipée", icon: "chef-hat", category: "kitchen" as const, order: 6 },
    { name: "Machine à café", icon: "coffee", category: "kitchen" as const, order: 7 },
    { name: "Four & plaques", icon: "cooking-pot", category: "kitchen" as const, order: 8 },
    { name: "Parking privé", icon: "car", category: "outdoor" as const, order: 9 },
    { name: "Jardin 3000m²", icon: "flower-2", category: "outdoor" as const, order: 10 },
    { name: "Barbecue", icon: "flame", category: "outdoor" as const, order: 11 },
    { name: "Chauffage central", icon: "thermometer", category: "comfort" as const, order: 12 },
  ];

  for (const amenity of amenities) {
    try {
      await payload.create({ collection: "amenities", data: amenity });
    } catch {
      results.push(`Amenity ${amenity.name} might already exist`);
    }
  }
  results.push("Amenities seeded");

  // Seed local recommendations
  const recommendations = [
    { name: "Château de Chambord", category: "castles" as const, address: "41250 Chambord", phone: "+33 2 54 50 40 00", website: "https://www.chambord.org", distanceFromGite: "30 min", featured: true, order: 1 },
    { name: "Château de Cheverny", category: "castles" as const, address: "41700 Cheverny", phone: "+33 2 54 79 96 29", website: "https://www.chateau-cheverny.fr", distanceFromGite: "25 min", featured: true, order: 2 },
    { name: "Zoo de Beauval", category: "activities" as const, address: "41110 Saint-Aignan", phone: "+33 2 54 75 50 00", website: "https://www.zoobeauval.com", distanceFromGite: "45 min", featured: true, order: 3 },
    { name: "Auberge du Cerf", category: "restaurants" as const, address: "Sologne", phone: "+33 2 54 XX XX XX", distanceFromGite: "5 km", featured: true, order: 4 },
    { name: "Étang de Sologne — Randonnée", category: "nature" as const, distanceFromGite: "10 min à pied", featured: true, order: 5 },
    { name: "Marché de Romorantin", category: "markets" as const, address: "Romorantin-Lanthenay", distanceFromGite: "20 min", featured: false, order: 6 },
  ];

  for (const rec of recommendations) {
    try {
      await payload.create({ collection: "local-recommendations", data: rec });
    } catch {
      results.push(`Recommendation ${rec.name} might already exist`);
    }
  }
  results.push("Local recommendations seeded");

  // Seed onboarding guide
  try {
    await payload.create({
      collection: "onboarding-guides",
      data: {
        title: "Bienvenue — Famille Dupont",
        accessToken: "dupont-2024-test",
        isActive: true,
        arrivalInstructions: { accessCode: "4589#", parkingInfo: "Deux places de parking sont disponibles devant le gîte." },
        wifiInfo: { networkName: "InstantTranquille_Wifi", password: "Sologne2024!" },
        equipmentGuide: [{ name: "Machine à laver" }, { name: "Cheminée" }, { name: "Système audio Bluetooth" }],
        emergencyContacts: [
          { name: "Propriétaires", role: "Hôtes", phone: "+33 6 12 34 56 78", available: "8h-22h" },
          { name: "SAMU", role: "Urgences médicales", phone: "15", available: "24h/24" },
          { name: "Pompiers", role: "Incendie / Secours", phone: "18", available: "24h/24" },
          { name: "Gendarmerie", role: "Police", phone: "17", available: "24h/24" },
        ],
      },
    });
    results.push("Onboarding guide created");
  } catch {
    results.push("Onboarding guide might already exist");
  }

  // Seed pages
  const pages = [
    { title: "Accueil", slug: "home", heroTitle: "L'Instant Tranquille", heroSubtitle: "Votre parenthèse nature au cœur de la Sologne", _status: "published" as const, ...(heroImageId ? { heroImage: heroImageId } : {}) },
    { title: "Le Gîte", slug: "le-gite", heroTitle: "Le Gîte", heroSubtitle: "Un havre de paix au cœur de la nature", _status: "published" as const, ...(heroImageId ? { heroImage: heroImageId } : {}) },
    { title: "Tarifs & Réservation", slug: "tarifs-reservation", heroTitle: "Tarifs & Réservation", _status: "published" as const },
    { title: "Contact", slug: "contact", heroTitle: "Nous contacter", _status: "published" as const },
  ];

  for (const page of pages) {
    try {
      await payload.create({ collection: "pages", draft: false, data: page });
    } catch {
      results.push(`Page ${page.slug} might already exist`);
    }
  }
  results.push("Pages seeded");

  // Seed globals
  try {
    await payload.updateGlobal({
      slug: "site-settings",
      draft: false,
      data: {
        _status: "published",
        siteName: "L'Instant Tranquille",
        tagline: "Votre parenthèse nature au cœur de la Sologne",
        siteDescription: "Gîte de charme au cœur de la Sologne, entre forêts et châteaux de la Loire.",
        contact: { email: "contact@linstant-tranquille.fr", phone: "+33 6 12 34 56 78", address: "Sologne, 41000\nCentre-Val de Loire\nFrance", coordinates: { lat: 47.4833, lng: 1.7667 } },
        propertyDetails: { maxGuests: 6, bedrooms: 3, bathrooms: 2, surface: 120 },
      },
    });
    results.push("Site settings updated");
  } catch (e) {
    results.push(`Error updating site settings: ${e}`);
  }

  try {
    await payload.updateGlobal({
      slug: "pricing-config",
      draft: false,
      data: {
        _status: "published",
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
        policies: { checkIn: "À partir de 16h00", checkOut: "Avant 10h00" },
      },
    });
    results.push("Pricing config updated");
  } catch (e) {
    results.push(`Error updating pricing config: ${e}`);
  }

  try {
    await payload.updateGlobal({
      slug: "header",
      draft: false,
      data: {
        _status: "published",
        navItems: [
          { label: "Accueil", url: "/", isExternal: false, highlight: false },
          { label: "Le Gîte", url: "/le-gite", isExternal: false, highlight: false },
          { label: "Tarifs & Réservation", url: "/tarifs-reservation", isExternal: false, highlight: false },
          { label: "Contact", url: "/contact", isExternal: false, highlight: false },
        ],
        ctaButton: { label: "Réserver", url: "/tarifs-reservation" },
      },
    });
    results.push("Header updated");
  } catch (e) {
    results.push(`Error updating header: ${e}`);
  }

  try {
    await payload.updateGlobal({
      slug: "footer",
      draft: false,
      data: {
        _status: "published",
        description: "Un gîte de charme au cœur de la Sologne, entre forêts et châteaux de la Loire.",
        navColumns: [
          {
            title: "Navigation",
            links: [
              { label: "Accueil", url: "/", isExternal: false },
              { label: "Le Gîte", url: "/le-gite", isExternal: false },
              { label: "Tarifs", url: "/tarifs-reservation", isExternal: false },
              { label: "Contact", url: "/contact", isExternal: false },
            ],
          },
        ],
        legalText: "L'Instant Tranquille — Gîte de vacances en Sologne. Tous droits réservés.",
      },
    });
    results.push("Footer updated");
  } catch (e) {
    results.push(`Error updating footer: ${e}`);
  }

  results.push("Seeding complete!");
  return Response.json({ results });
}
