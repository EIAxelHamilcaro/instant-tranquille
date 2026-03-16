import crypto from "crypto";
import { getPayload } from "@/lib/payload";

function richText(...paragraphs: string[]) {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: 0,
        indent: 0,
        version: 1,
        textFormat: 0,
        children: [{ type: "text", mode: "normal", text, format: 0, style: "" }],
      })),
    },
  };
}

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not allowed in production", { status: 403 });
  }

  const payload = await getPayload();
  const results: string[] = [];

  // Hero image skipped — upload via Payload admin with Vercel Blob storage
  const heroImageId: number | null = null;

  // Clean collections to avoid duplicates on re-seed
  for (const col of ["testimonials", "amenities", "local-recommendations", "onboarding-guides", "pages"] as const) {
    try {
      const existing = await payload.find({ collection: col, limit: 500 });
      for (const doc of existing.docs) {
        await payload.delete({ collection: col, id: doc.id });
      }
      results.push(`Cleaned ${existing.docs.length} ${col}`);
    } catch {
      results.push(`Could not clean ${col}`);
    }
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
        email: process.env.SEED_ADMIN_EMAIL || "admin@instant-tranquille.com",
        password: process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(16).toString("hex"),
        name: "Admin",
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
    { name: "WiFi haut débit", icon: "wifi", category: "comfort" as const, order: 1, description: "Connexion fibre optique disponible dans tout le gîte" },
    { name: "TV écran plat", icon: "tv", category: "indoor" as const, order: 2, description: "Télévision connectée avec accès aux plateformes de streaming" },
    { name: "Lave-linge", icon: "washing-machine", category: "indoor" as const, order: 3, description: "Lave-linge à disposition avec produits de lavage fournis" },
    { name: "Literie premium", icon: "bed-double", category: "indoor" as const, order: 4, description: "Matelas haut de gamme et couettes douillettes pour un sommeil réparateur" },
    { name: "Cheminée", icon: "flame", category: "indoor" as const, order: 5, description: "Cheminée à foyer fermé pour des soirées chaleureuses en hiver" },
    { name: "Cuisine équipée", icon: "chef-hat", category: "kitchen" as const, order: 6, description: "Tout le nécessaire pour préparer de bons repas : vaisselle, ustensiles, épices" },
    { name: "Machine à café", icon: "coffee", category: "kitchen" as const, order: 7, description: "Machine à café Nespresso avec capsules de bienvenue offertes" },
    { name: "Four & plaques", icon: "cooking-pot", category: "kitchen" as const, order: 8, description: "Four traditionnel et plaques à induction pour cuisiner comme à la maison" },
    { name: "Parking privé", icon: "car", category: "outdoor" as const, order: 9, description: "Deux places de parking privées et sécurisées devant le gîte" },
    { name: "Jardin 3000m²", icon: "flower-2", category: "outdoor" as const, order: 10, description: "Grand jardin clos et arboré, idéal pour les enfants et les moments de détente" },
    { name: "Barbecue", icon: "flame", category: "outdoor" as const, order: 11, description: "Barbecue au charbon avec ustensiles et table de jardin pour les repas en extérieur" },
    { name: "Chauffage central", icon: "thermometer", category: "comfort" as const, order: 12, description: "Chauffage central au gaz pour un confort optimal en toute saison" },
  ];

  for (const amenity of amenities) {
    try {
      await payload.create({ collection: "amenities", data: amenity });
    } catch {
      results.push(`Amenity ${amenity.name} might already exist`);
    }
  }
  results.push("Amenities seeded");

  // Seed local recommendations (store IDs for onboarding guide relation)
  // All data is public information from official sources
  const recommendationsData = [
    // ── Châteaux ──
    {
      name: "Château de Chambord",
      category: "castles" as const,
      address: "41250 Chambord",
      phone: "+33 2 54 50 40 00",
      website: "https://www.chambord.org",
      distanceFromGite: "30 min",
      featured: true,
      order: 1,
      description: "Le plus grand château de la Loire, chef-d'œuvre de la Renaissance. Son escalier à double révolution attribué à Léonard de Vinci et son domaine de 5 440 hectares en font une visite incontournable.",
      coordinates: { lat: 47.6161, lng: 1.517 },
    },
    {
      name: "Château de Cheverny",
      category: "castles" as const,
      address: "Avenue du Château, 41700 Cheverny",
      phone: "+33 2 54 79 96 29",
      website: "https://www.chateau-cheverny.fr",
      distanceFromGite: "25 min",
      featured: true,
      order: 2,
      description: "Château remarquablement meublé qui inspira Hergé pour Moulinsart. L'exposition « Les Secrets de Moulinsart », ses jardins à la française et ses croisières sur le canal raviront toute la famille.",
      coordinates: { lat: 47.5003, lng: 1.4581 },
    },
    {
      name: "Château de Chenonceau",
      category: "castles" as const,
      address: "37150 Chenonceaux",
      phone: "+33 2 47 23 90 07",
      website: "https://www.chenonceau.com",
      distanceFromGite: "55 min",
      featured: true,
      order: 3,
      description: "Le « Château des Dames », enjambant le Cher. Un joyau de l'architecture Renaissance avec ses galeries, ses jardins de Diane de Poitiers et Catherine de Médicis, et son potager de fleurs.",
      coordinates: { lat: 47.3249, lng: 1.0705 },
    },
    {
      name: "Château de Blois",
      category: "castles" as const,
      address: "6 Place du Château, 41000 Blois",
      phone: "+33 2 54 90 33 33",
      website: "https://www.chateaudeblois.fr",
      distanceFromGite: "35 min",
      featured: false,
      order: 4,
      description: "Résidence royale de 7 rois et 10 reines de France, le château de Blois présente un panorama unique de l'architecture française du XIIIe au XVIIe siècle. Son spectacle son et lumière estival est féerique.",
      coordinates: { lat: 47.5861, lng: 1.3308 },
    },
    // ── Activités ──
    {
      name: "ZooParc de Beauval",
      category: "activities" as const,
      address: "41110 Saint-Aignan",
      phone: "+33 2 54 75 50 00",
      website: "https://www.zoobeauval.com",
      distanceFromGite: "45 min",
      featured: true,
      order: 5,
      description: "L'un des 5 plus beaux zoos du monde. Plus de 35 000 animaux dont les célèbres pandas géants, koalas et lamantins. Ne manquez pas le spectacle d'oiseaux en vol libre et la serre tropicale.",
      coordinates: { lat: 47.2481, lng: 1.3547 },
    },
    {
      name: "Maison de la Magie Robert-Houdin",
      category: "activities" as const,
      address: "1 Place du Château, 41000 Blois",
      phone: "+33 2 54 90 33 33",
      website: "https://www.maisondelamagie.fr",
      distanceFromGite: "35 min",
      featured: false,
      order: 6,
      description: "Musée unique en Europe dédié à la magie et au père de la magie moderne. Spectacles de magie en live, collections d'automates et illusions en tout genre. Les dragons de la façade sont inoubliables !",
      coordinates: { lat: 47.5867, lng: 1.3303 },
    },
    // ── Restaurants ──
    {
      name: "La Maison d'à Côté",
      category: "restaurants" as const,
      address: "25 Route de Blois, 41350 Montlivault",
      phone: "+33 2 54 20 62 30",
      website: "https://www.lamaisondacote.fr",
      distanceFromGite: "30 min",
      featured: true,
      order: 7,
      description: "Restaurant étoilé Michelin du chef Christophe Hay, ambassadeur de la cuisine locavore en Val de Loire. Produits du potager, poissons de Loire et gibier de Sologne sublimés avec créativité.",
      coordinates: { lat: 47.5929, lng: 1.4376 },
    },
    {
      name: "Le Grand St Michel",
      category: "restaurants" as const,
      address: "Place Saint-Michel, 41250 Chambord",
      phone: "+33 2 54 20 31 31",
      website: "https://www.saintmichel-chambord.com",
      distanceFromGite: "30 min",
      featured: true,
      order: 8,
      description: "Face au château de Chambord, une brasserie de charme proposant une cuisine traditionnelle soignée. Terrasse avec vue imprenable sur le château. Idéal pour un déjeuner après la visite.",
      coordinates: { lat: 47.6164, lng: 1.5124 },
    },
    {
      name: "Auberge du Centre",
      category: "restaurants" as const,
      address: "24 Place de l'Église, 41700 Cheverny",
      phone: "+33 2 54 79 96 44",
      distanceFromGite: "25 min",
      featured: false,
      order: 9,
      description: "Cuisine traditionnelle du terroir solognot dans un cadre rustique et chaleureux, à deux pas du château de Cheverny. Gibier de saison, tarte Tatin maison et vins de Loire.",
      coordinates: { lat: 47.5004, lng: 1.4574 },
    },
    // ── Nature ──
    {
      name: "Domaine du Ciran",
      category: "nature" as const,
      address: "41210 Ménestreau-en-Villette",
      phone: "+33 2 38 76 90 93",
      website: "https://www.domaineduciran.com",
      distanceFromGite: "40 min",
      featured: true,
      order: 10,
      description: "Conservatoire de la faune et la flore de Sologne. 300 hectares de sentiers balisés à travers landes, forêts et étangs. Observatoires pour le brame du cerf en automne. Entrée libre.",
      coordinates: { lat: 47.6494, lng: 2.0036 },
    },
    {
      name: "Étangs de Sologne — Sentier de Villeherviers",
      category: "nature" as const,
      address: "41210 Villeherviers",
      distanceFromGite: "15 min",
      featured: true,
      order: 11,
      description: "Sentier de randonnée balisé de 8 km autour des étangs typiques de Sologne. Paysages de landes et de forêts, observation d'oiseaux et de la faune sauvage. Accessible toute l'année.",
      coordinates: { lat: 47.39, lng: 1.72 },
    },
    // ── Marchés ──
    {
      name: "Marché de Romorantin-Lanthenay",
      category: "markets" as const,
      address: "Place du Général de Gaulle, 41200 Romorantin-Lanthenay",
      distanceFromGite: "20 min",
      featured: true,
      order: 12,
      description: "Grand marché les mercredi et samedi matins. Producteurs locaux, fromages de chèvre AOP Selles-sur-Cher, miel de Sologne, asperges de Contres en saison. La ville mérite aussi une balade au bord de la Sauldre.",
      coordinates: { lat: 47.3564, lng: 1.7486 },
    },
    {
      name: "Marché de Blois",
      category: "markets" as const,
      address: "Place Louis XII, 41000 Blois",
      distanceFromGite: "35 min",
      featured: false,
      order: 13,
      description: "Marché couvert et marché de plein air le samedi matin au pied du château. Produits du Val de Loire : vins AOC, rillettes de Tours, chocolats artisanaux et fruits de saison.",
      coordinates: { lat: 47.5852, lng: 1.3316 },
    },
  ];

  const recommendationIds: number[] = [];
  for (const rec of recommendationsData) {
    try {
      const created = await payload.create({ collection: "local-recommendations", data: rec });
      recommendationIds.push(created.id as number);
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
        accessToken: crypto.randomBytes(12).toString("hex"),
        isActive: true,
        sections: [
          {
            blockType: "arrival",
            accessCode: "4589#",
            instructions: richText(
              "Entrez le code 4589# sur le digicode à gauche de la porte d'entrée principale.",
              "La clé se trouve dans la boîte à clés fixée au mur à droite de la porte, code 1234. Tournez les molettes pour composer le code, tirez le couvercle vers le bas.",
              "Une fois à l'intérieur, refermez la boîte à clés et mélangez les molettes."
            ),
            parkingInfo:
              "Deux places de parking sont disponibles devant le gîte. Merci de vous garer sur les emplacements prévus.",
          },
          {
            blockType: "houseRules",
            content: richText(
              "Merci de respecter le calme du voisinage, particulièrement entre 22h et 8h.",
              "Le gîte est entièrement non-fumeur. Vous pouvez fumer à l'extérieur, des cendriers sont à disposition sur la terrasse.",
              "Les animaux de compagnie sont acceptés sous réserve d'accord préalable. Un supplément de 30€ par séjour sera demandé.",
              "Merci de trier vos déchets : poubelle jaune pour le recyclage, poubelle verte pour les ordures ménagères."
            ),
          },
          {
            blockType: "wifi",
            networkName: "InstantTranquille_Wifi",
            password: "ChangeMe_WiFi",
          },
          {
            blockType: "equipment",
            items: [
              {
                name: "Machine à laver",
                instructions: richText(
                  "La machine à laver se trouve dans le cellier, derrière la cuisine.",
                  "Utilisez le programme « Coton 40°C » pour le linge courant. Les dosettes de lessive sont fournies dans le placard au-dessus.",
                  "Étendoir à linge disponible dans le cellier et corde à linge dans le jardin."
                ),
              },
              {
                name: "Cheminée",
                instructions: richText(
                  "Le bois est stocké sous l'abri à droite de l'entrée. Apportez quelques bûches et du petit bois.",
                  "Ouvrez le clapet d'aération en tirant la manette en bas à droite du foyer. Allumez le feu avec les allume-feux fournis.",
                  "Une fois le feu bien pris, vous pouvez refermer partiellement la vitre. N'oubliez pas de refermer le clapet quand le feu est totalement éteint."
                ),
              },
              {
                name: "Système audio Bluetooth",
                instructions: richText(
                  "L'enceinte Bluetooth se trouve dans le salon sur le meuble TV.",
                  "Allumez-la avec le bouton sur le dessus. Cherchez « IT-Speaker » dans vos appareils Bluetooth et connectez-vous.",
                  "Le volume se règle directement depuis votre téléphone ou avec les boutons +/- sur l'enceinte."
                ),
              },
            ],
          },
          ...(recommendationIds.length > 0
            ? [{ blockType: "recommendations" as const, items: recommendationIds }]
            : []),
          {
            blockType: "map",
          },
          {
            blockType: "emergency",
            contacts: [
              { name: "Propriétaires", role: "Hôtes", phone: "+33 6 12 34 56 78", available: "8h-22h" },
              { name: "SAMU", role: "Urgences médicales", phone: "15", available: "24h/24" },
              { name: "Pompiers", role: "Incendie / Secours", phone: "18", available: "24h/24" },
              { name: "Gendarmerie", role: "Police", phone: "17", available: "24h/24" },
            ],
          },
          {
            blockType: "checkInOut",
            checkInInstructions: richText(
              "L'arrivée se fait à partir de 16h00. Si vous souhaitez arriver plus tôt, contactez-nous pour vérifier la disponibilité.",
              "À votre arrivée, vous trouverez un petit panier de bienvenue sur la table de la cuisine avec quelques produits locaux.",
              "Faites le tour du gîte pour vous familiariser avec les équipements. N'hésitez pas à nous appeler si vous avez la moindre question."
            ),
            checkOutInstructions: richText(
              "Le départ est prévu avant 10h00 le jour du check-out.",
              "Avant de partir, merci de : vider le réfrigérateur, sortir les poubelles dans les bacs prévus, éteindre tous les appareils et le chauffage.",
              "Remettez la clé dans la boîte à clés et mélangez les molettes. Envoyez-nous un petit message pour nous prévenir de votre départ."
            ),
          },
        ],
      },
    });
    results.push("Onboarding guide created");
  } catch (e) {
    results.push(`Onboarding guide error: ${e}`);
  }

  // Seed pages
  const pages = [
    {
      title: "Accueil",
      slug: "home",
      heroTitle: "L'Instant Tranquille",
      heroSubtitle: "Votre parenthèse nature au cœur de la Sologne",
      _status: "published" as const,
      ...(heroImageId ? { heroImage: heroImageId } : {}),
      content: richText(
        "Bienvenue à L'Instant Tranquille, votre gîte de charme niché au cœur de la Sologne. Entre forêts majestueuses et châteaux de la Loire, notre maison vous offre un cadre idéal pour une escapade ressourçante.",
        "Entièrement rénové avec soin, le gîte allie le charme de l'ancien au confort moderne. Profitez de 120m² d'espace de vie, d'un jardin arboré de 3000m² et d'un calme absolu pour vous reconnecter à l'essentiel.",
        "Que vous soyez en couple, en famille ou entre amis, L'Instant Tranquille est le point de départ idéal pour découvrir les trésors de la région : Chambord, Cheverny, Beauval et bien d'autres merveilles vous attendent."
      ),
      seo: {
        metaTitle: "L'Instant Tranquille — Gîte de charme en Sologne",
        metaDescription: "Découvrez L'Instant Tranquille, gîte de charme au cœur de la Sologne. 120m², 3 chambres, jardin arboré. Idéal pour explorer les châteaux de la Loire.",
        ...(heroImageId ? { ogImage: heroImageId } : {}),
      },
    },
    {
      title: "Le Gîte",
      slug: "le-gite",
      heroTitle: "Le Gîte",
      heroSubtitle: "Un havre de paix au cœur de la nature",
      _status: "published" as const,
      ...(heroImageId ? { heroImage: heroImageId } : {}),
      content: richText(
        "Le gîte L'Instant Tranquille est une maison de caractère entièrement rénovée, offrant 120m² de surface habitable sur deux niveaux. Chaque détail a été pensé pour votre confort et votre bien-être.",
        "Au rez-de-chaussée, un grand séjour lumineux avec cheminée s'ouvre sur une cuisine entièrement équipée. Une première chambre avec lit double et une salle d'eau complètent ce niveau.",
        "À l'étage, deux chambres spacieuses (un lit double et deux lits simples) partagent une grande salle de bain avec baignoire. Un coin lecture sous les toits offre un espace de détente supplémentaire.",
        "À l'extérieur, le jardin clos de 3000m² est un véritable havre de paix. Barbecue, salon de jardin, transats et jeux pour enfants sont à votre disposition pour profiter des beaux jours."
      ),
      seo: {
        metaTitle: "Le Gîte — L'Instant Tranquille en Sologne",
        metaDescription: "Découvrez notre gîte de charme en Sologne : 120m², 3 chambres, jardin de 3000m², cheminée. Entièrement rénové avec goût pour un séjour inoubliable.",
        ...(heroImageId ? { ogImage: heroImageId } : {}),
      },
    },
    {
      title: "Tarifs & Réservation",
      slug: "tarifs-reservation",
      heroTitle: "Tarifs & Réservation",
      heroSubtitle: "Réservez votre séjour au cœur de la Sologne",
      _status: "published" as const,
      content: richText(
        "Nos tarifs varient selon la saison pour vous offrir le meilleur rapport qualité-prix tout au long de l'année. Le gîte est loué dans son intégralité, pour une capacité maximale de 6 personnes.",
        "La réservation peut s'effectuer directement via nos plateformes partenaires Airbnb et Booking, ou en nous contactant par e-mail pour bénéficier de nos meilleurs tarifs en direct.",
        "Un acompte de 30% est demandé à la réservation, le solde étant à régler à l'arrivée. Nous acceptons les virements bancaires et les paiements par carte."
      ),
      seo: {
        metaTitle: "Tarifs & Réservation — L'Instant Tranquille",
        metaDescription: "Consultez nos tarifs et réservez votre séjour au gîte L'Instant Tranquille en Sologne. Tarifs à partir de 90€/nuit. Réservation simple et rapide.",
        ...(heroImageId ? { ogImage: heroImageId } : {}),
      },
    },
    {
      title: "Contact",
      slug: "contact",
      heroTitle: "Nous contacter",
      heroSubtitle: "Une question ? N'hésitez pas à nous écrire",
      _status: "published" as const,
      content: richText(
        "Vous avez une question sur le gîte, la disponibilité ou la région ? N'hésitez pas à nous contacter, nous vous répondrons dans les meilleurs délais.",
        "Nous sommes disponibles par e-mail et par téléphone du lundi au samedi, de 9h à 19h. Pour les demandes de réservation, merci de préciser vos dates de séjour et le nombre de personnes."
      ),
      seo: {
        metaTitle: "Contact — L'Instant Tranquille",
        metaDescription: "Contactez-nous pour toute question ou demande de réservation pour le gîte L'Instant Tranquille en Sologne. Réponse rapide garantie.",
        ...(heroImageId ? { ogImage: heroImageId } : {}),
      },
    },
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
      locale: "fr",
      draft: false,
      data: {
        _status: "published",
        siteName: "L'Instant Tranquille",
        tagline: "Votre parenthèse nature au cœur de la Sologne",
        siteDescription:
          "Gîte de charme au cœur de la Sologne, entre forêts et châteaux de la Loire. Location de vacances idéale pour un séjour nature.",
        ...(heroImageId ? { logo: heroImageId } : {}),
        contact: {
          email: "contact@linstant-tranquille.fr",
          phone: "+33 6 12 34 56 78",
          address: "Sologne, 41000\nCentre-Val de Loire\nFrance",
          coordinates: { lat: 47.4833, lng: 1.7667 },
        },
        socialLinks: {
          facebook: "https://www.facebook.com/linstanttranquille",
          instagram: "https://www.instagram.com/linstanttranquille",
        },
        propertyDetails: { maxGuests: 6, bedrooms: 3, bathrooms: 2, surface: 120 },
        defaultSeo: {
          metaTitle: "L'Instant Tranquille — Gîte de charme en Sologne",
          metaDescription:
            "Découvrez L'Instant Tranquille, gîte de charme au cœur de la Sologne. 3 chambres, 120m², jardin arboré. Entre forêts et châteaux de la Loire.",
          ...(heroImageId ? { ogImage: heroImageId } : {}),
        },
      },
    });
    results.push("Site settings updated");
  } catch (e) {
    results.push(`Error updating site settings: ${e}`);
  }

  try {
    await payload.updateGlobal({
      slug: "pricing-config",
      locale: "fr",
      draft: false,
      data: {
        _status: "published",
        currency: "EUR",
        seasons: [
          { name: "Basse saison", startMonth: "11", startDay: 1, endMonth: "3", endDay: 31, nightlyRate: 90, weeklyRate: 540, minimumStay: 2, color: "green" },
          { name: "Moyenne saison", startMonth: "4", startDay: 1, endMonth: "6", endDay: 30, nightlyRate: 120, weeklyRate: 720, minimumStay: 3, color: "orange" },
          { name: "Haute saison", startMonth: "7", startDay: 1, endMonth: "8", endDay: 31, nightlyRate: 150, weeklyRate: 900, minimumStay: 7, color: "red" },
          { name: "Très haute saison", startMonth: "12", startDay: 20, endMonth: "1", endDay: 5, nightlyRate: 170, weeklyRate: 1020, minimumStay: 3, color: "purple" },
        ],
        additionalFees: [
          { name: "Ménage de fin de séjour", amount: 60, type: "per_stay", description: "Obligatoire" },
          { name: "Linge de lit", amount: 15, type: "per_person", description: "Optionnel, draps et serviettes" },
          { name: "Taxe de séjour", amount: 1.1, type: "per_night", description: "Par personne et par nuit" },
        ],
        bookingLinks: {
          airbnb: "https://www.airbnb.fr",
          booking: "https://www.booking.com",
          email: "contact@linstant-tranquille.fr",
        },
        policies: {
          checkIn: "À partir de 16h00",
          checkOut: "Avant 10h00",
          cancellation: richText(
            "Annulation gratuite jusqu'à 30 jours avant la date d'arrivée. L'acompte est intégralement remboursé.",
            "Entre 30 et 14 jours avant l'arrivée, 50% de l'acompte est retenu.",
            "Moins de 14 jours avant l'arrivée, l'acompte n'est pas remboursable. Nous vous recommandons de souscrire une assurance annulation voyage."
          ),
          deposit: richText(
            "Un acompte de 30% du montant total du séjour est demandé à la réservation pour confirmer votre réservation.",
            "Le solde est à régler à l'arrivée, par virement bancaire ou carte de paiement.",
            "Une caution de 300€ est demandée à l'arrivée (chèque ou empreinte de carte) et restituée après l'état des lieux de sortie."
          ),
          additional: richText(
            "Le ménage de fin de séjour est obligatoire (60€). Vous pouvez également laisser le gîte propre et rangé pour éviter ces frais — un guide de ménage est à votre disposition.",
            "Les draps et serviettes peuvent être fournis moyennant un supplément de 15€ par personne. Vous pouvez aussi apporter les vôtres.",
            "Les arrivées et départs en dehors des horaires standards sont possibles sur demande, sous réserve de disponibilité."
          ),
        },
      },
    });
    results.push("Pricing config updated");
  } catch (e) {
    results.push(`Error updating pricing config: ${e}`);
  }

  // Header — create with FR labels (default locale), then add EN
  try {
    await payload.updateGlobal({
      slug: "header",
      locale: "fr",
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
    // Add EN labels — use the existing navItem IDs
    const headerDoc = await payload.findGlobal({ slug: "header" });
    const existingNavItems = (headerDoc.navItems || []) as Array<Record<string, unknown>>;
    const enLabels = ["Home", "The Cottage", "Rates & Booking", "Contact"];
    await payload.updateGlobal({
      slug: "header",
      locale: "en",
      draft: false,
      data: {
        navItems: existingNavItems.map((item, i) => ({
          ...item,
          label: enLabels[i],
        })),
        ctaButton: { label: "Book now", url: "/tarifs-reservation" },
      },
    });
    results.push("Header FR+EN updated");
  } catch (e) {
    results.push(`Error updating header: ${e}`);
  }

  // Footer — create with FR, then add EN using existing IDs
  try {
    await payload.updateGlobal({
      slug: "footer",
      locale: "fr",
      draft: false,
      data: {
        _status: "published",
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
      },
    });
    const footerDoc = await payload.findGlobal({ slug: "footer" });
    const existingColumns = (footerDoc.navColumns || []) as Array<Record<string, unknown>>;
    const enColumns = [
      { title: "Navigation", linkLabels: ["Home", "The Cottage", "Rates", "Contact"] },
      { title: "Resources", linkLabels: ["Airbnb", "Booking"] },
    ];
    await payload.updateGlobal({
      slug: "footer",
      locale: "en",
      draft: false,
      data: {
        description: "A charming cottage in the heart of Sologne, between forests and Loire Valley castles.",
        navColumns: existingColumns.map((col, i) => ({
          ...col,
          title: enColumns[i].title,
          links: ((col.links || []) as Array<Record<string, unknown>>).map((link, j) => ({
            ...link,
            label: enColumns[i].linkLabels[j],
          })),
        })),
        legalText: "L'Instant Tranquille — Holiday cottage in Sologne. All rights reserved.",
      },
    });
    results.push("Footer FR+EN updated");
  } catch (e) {
    results.push(`Error updating footer: ${e}`);
  }

  // PricingConfig EN
  try {
    await payload.updateGlobal({
      slug: "pricing-config",
      locale: "en",
      draft: false,
      data: {
        seasons: [
          { name: "Low season", startMonth: "11", startDay: 1, endMonth: "3", endDay: 31, nightlyRate: 90, weeklyRate: 540, minimumStay: 2, color: "green" },
          { name: "Mid season", startMonth: "4", startDay: 1, endMonth: "6", endDay: 30, nightlyRate: 120, weeklyRate: 720, minimumStay: 3, color: "orange" },
          { name: "High season", startMonth: "7", startDay: 1, endMonth: "8", endDay: 31, nightlyRate: 150, weeklyRate: 900, minimumStay: 7, color: "red" },
          { name: "Peak season", startMonth: "12", startDay: 20, endMonth: "1", endDay: 5, nightlyRate: 170, weeklyRate: 1020, minimumStay: 3, color: "purple" },
        ],
        additionalFees: [
          { name: "End-of-stay cleaning", amount: 60, type: "per_stay", description: "Mandatory" },
          { name: "Bed linen", amount: 15, type: "per_person", description: "Optional, sheets and towels" },
          { name: "Tourist tax", amount: 1.1, type: "per_night", description: "Per person per night" },
        ],
        policies: {
          checkIn: "From 4:00 PM",
          checkOut: "Before 10:00 AM",
          cancellation: richText(
            "Free cancellation up to 30 days before arrival. The deposit is fully refunded.",
            "Between 30 and 14 days before arrival, 50% of the deposit is retained.",
            "Less than 14 days before arrival, the deposit is non-refundable. We recommend purchasing trip cancellation insurance."
          ),
          deposit: richText(
            "A deposit of 30% of the total stay amount is required at booking to confirm your reservation.",
            "The balance is due upon arrival, by bank transfer or card payment.",
            "A security deposit of €300 is required upon arrival (check or card hold) and returned after the departure inspection."
          ),
          additional: richText(
            "End-of-stay cleaning is mandatory (€60). You may also leave the cottage clean and tidy to waive this fee — a cleaning guide is provided.",
            "Bed linen and towels can be provided for a €15 per person supplement. You may also bring your own.",
            "Early check-in or late check-out is available upon request, subject to availability."
          ),
        },
      },
    });
    results.push("Pricing config EN updated");
  } catch (e) {
    results.push(`Error updating pricing config EN: ${e}`);
  }

  // Amenities EN
  const amenitiesEN = [
    { name: "High-speed WiFi", description: "Fibre optic connection available throughout the cottage" },
    { name: "Flat-screen TV", description: "Smart TV with access to streaming platforms" },
    { name: "Washing machine", description: "Washing machine available with laundry products provided" },
    { name: "Premium bedding", description: "High-quality mattresses and cosy duvets for a restful sleep" },
    { name: "Fireplace", description: "Closed fireplace for warm winter evenings" },
    { name: "Fully equipped kitchen", description: "Everything you need for great meals: dishes, utensils, spices" },
    { name: "Coffee machine", description: "Nespresso coffee machine with complimentary welcome capsules" },
    { name: "Oven & hob", description: "Traditional oven and induction hob for home-style cooking" },
    { name: "Private parking", description: "Two private and secure parking spaces in front of the cottage" },
    { name: "3000m² garden", description: "Large enclosed garden with trees, ideal for children and relaxation" },
    { name: "Barbecue", description: "Charcoal barbecue with utensils and garden table for outdoor dining" },
    { name: "Central heating", description: "Gas central heating for optimal comfort in all seasons" },
  ];

  try {
    const allAmenities = await payload.find({
      collection: "amenities",
      sort: "order",
      limit: 100,
    });
    for (let i = 0; i < allAmenities.docs.length; i++) {
      const enData = amenitiesEN[i];
      if (!enData) continue;
      await payload.update({
        collection: "amenities",
        id: allAmenities.docs[i].id,
        locale: "en",
        data: enData,
      });
    }
    results.push("Amenities EN updated");
  } catch (e) {
    results.push(`Error updating amenities EN: ${e}`);
  }

  // Local Recommendations EN (description is textarea, not richText)
  const recommendationsEN = [
    { name: "Château de Chambord", description: "The largest Loire Valley castle, a French Renaissance masterpiece. Its double-helix staircase attributed to Leonardo da Vinci and 5,440-hectare estate make it unmissable." },
    { name: "Château de Cheverny", description: "A beautifully furnished castle that inspired Hergé's Moulinsart. The \"Secrets of Moulinsart\" exhibition, French gardens and canal cruises delight the whole family." },
    { name: "Château de Chenonceau", description: "The 'Ladies' Castle' spanning the Cher river. A Renaissance jewel with galleries, gardens by Diane de Poitiers and Catherine de Medici, and a flower kitchen garden." },
    { name: "Château de Blois", description: "Royal residence of 7 kings and 10 queens of France, offering a unique panorama of French architecture from the 13th to 17th century. Its summer sound and light show is magical." },
    { name: "ZooParc de Beauval", description: "One of the world's top 5 zoos. Over 35,000 animals including giant pandas, koalas and manatees. Don't miss the free-flight bird show and the tropical greenhouse." },
    { name: "Maison de la Magie Robert-Houdin", description: "Europe's only museum dedicated to magic and the father of modern magic. Live magic shows, automaton collections and illusions galore. The facade dragons are unforgettable!" },
    { name: "La Maison d'à Côté", description: "Michelin-starred restaurant by chef Christophe Hay, champion of locavore cuisine in the Loire Valley. Garden produce, Loire fish and Sologne game elevated with creativity." },
    { name: "Le Grand St Michel", description: "Facing Chambord castle, a charming brasserie offering refined traditional cuisine. Terrace with stunning castle views — perfect for lunch after visiting." },
    { name: "Auberge du Centre", description: "Traditional Sologne cuisine in a rustic and warm setting, steps from Cheverny castle. Seasonal game, homemade tarte Tatin and Loire Valley wines." },
    { name: "Domaine du Ciran", description: "Conservatory of Sologne's wildlife and flora. 300 hectares of trails through heathlands, forests and ponds. Deer-calling observation hides in autumn. Free entry." },
    { name: "Sologne Ponds — Villeherviers Trail", description: "8 km waymarked trail around typical Sologne ponds. Heathland and forest landscapes, birdwatching and wildlife spotting. Open year-round." },
    { name: "Romorantin-Lanthenay Market", description: "Large market on Wednesday and Saturday mornings. Local producers, AOP Selles-sur-Cher goat cheese, Sologne honey, Contres asparagus in season. The town is worth a stroll along the Sauldre." },
    { name: "Blois Market", description: "Covered market and open-air market on Saturday mornings at the foot of the castle. Loire Valley AOC wines, Tours rillettes, artisan chocolates and seasonal fruit." },
  ];

  try {
    const allRecs = await payload.find({
      collection: "local-recommendations",
      sort: "order",
      limit: 100,
    });
    for (let i = 0; i < allRecs.docs.length; i++) {
      const enData = recommendationsEN[i];
      if (!enData) continue;
      await payload.update({
        collection: "local-recommendations",
        id: allRecs.docs[i].id,
        locale: "en",
        data: enData,
      });
    }
    results.push("Local recommendations EN updated");
  } catch (e) {
    results.push(`Error updating local recommendations EN: ${e}`);
  }

  // Pages EN
  const pagesEN = [
    {
      slug: "home",
      title: "Home",
      heroTitle: "L'Instant Tranquille",
      heroSubtitle: "Your nature retreat in the heart of Sologne",
      content: richText(
        "Welcome to L'Instant Tranquille, your charming cottage nestled in the heart of Sologne. Between majestic forests and Loire Valley castles, our home offers the perfect setting for a restorative escape.",
        "Fully renovated with care, the cottage combines period character with modern comfort. Enjoy 120m² of living space, a tree-lined garden of 3,000m² and absolute peace and quiet to reconnect with what matters most.",
        "Whether you're a couple, a family or a group of friends, L'Instant Tranquille is the ideal base for discovering the treasures of the region: Chambord, Cheverny, Beauval and many more wonders await you."
      ),
    },
    {
      slug: "le-gite",
      title: "The Cottage",
      heroTitle: "The Cottage",
      heroSubtitle: "A haven of peace in the heart of nature",
      content: richText(
        "L'Instant Tranquille is a characterful house, fully renovated, offering 120m² of living space on two floors. Every detail has been considered for your comfort and well-being.",
        "On the ground floor, a large bright living room with a fireplace opens onto a fully equipped kitchen. A first bedroom with a double bed and a shower room complete this level.",
        "Upstairs, two spacious bedrooms (one double bed and two single beds) share a large bathroom with a bath. A reading nook under the eaves provides an extra relaxation space.",
        "Outside, the enclosed garden of 3,000m² is a true haven of peace. A barbecue, garden furniture, sun loungers and children's games are at your disposal to make the most of fine days."
      ),
    },
    {
      slug: "tarifs-reservation",
      title: "Rates & Booking",
      heroTitle: "Rates & Booking",
      heroSubtitle: "Book your stay in the heart of Sologne",
      content: richText(
        "Our rates vary by season to offer you the best value for money throughout the year. The cottage is rented in its entirety, for a maximum capacity of 6 guests.",
        "Booking can be made directly through our partner platforms Airbnb and Booking, or by contacting us by email to benefit from our best direct rates.",
        "A 30% deposit is required at the time of booking, with the balance payable on arrival. We accept bank transfers and card payments."
      ),
    },
    {
      slug: "contact",
      title: "Contact",
      heroTitle: "Contact us",
      heroSubtitle: "Got a question? Don't hesitate to get in touch",
      content: richText(
        "Do you have a question about the cottage, availability or the area? Don't hesitate to contact us — we'll get back to you as soon as possible.",
        "We're available by email and phone Monday to Saturday, 9 am to 7 pm. For booking enquiries, please include your preferred dates and the number of guests."
      ),
    },
  ];

  try {
    for (const pageEN of pagesEN) {
      const { slug, ...enData } = pageEN;
      const found = await payload.find({
        collection: "pages",
        where: { slug: { equals: slug } },
        limit: 1,
      });
      if (found.docs.length === 0) {
        results.push(`Page EN (${slug}): not found, skipping`);
        continue;
      }
      await payload.update({
        collection: "pages",
        id: found.docs[0].id,
        locale: "en",
        draft: false,
        data: enData,
      });
    }
    results.push("Pages EN updated");
  } catch (e) {
    results.push(`Error updating pages EN: ${e}`);
  }

  // Testimonials EN (skip Wilson — already in English; translate Dupont, Martin, Müller)
  const testimonialsEN: Array<{ guestName: string; guestOrigin: string; text: string }> = [
    {
      guestName: "Marie & Pierre Dupont",
      guestOrigin: "Paris, France",
      text: "A magical stay in an exceptional setting. The cottage is beautifully renovated, very clean and perfectly equipped. The tranquillity of Sologne restored us completely. We will definitely be back!",
    },
    {
      guestName: "Thomas & Lisa Martin",
      guestOrigin: "Lyon, France",
      text: "The perfect place to unwind. The children loved the garden and we enjoyed unforgettable walks in the forest. Our hosts' recommendations were spot on.",
    },
    {
      guestName: "Hans & Greta Müller",
      guestOrigin: "Munich, Germany",
      text: "A beautiful holiday cottage in a stunning setting. Everything was clean and well equipped. The location is perfect for day trips to the Loire castles.",
    },
  ];

  try {
    for (const t of testimonialsEN) {
      const found = await payload.find({
        collection: "testimonials",
        where: { guestName: { equals: t.guestName } },
        limit: 1,
      });
      if (found.docs.length === 0) {
        results.push(`Testimonial EN (${t.guestName}): not found, skipping`);
        continue;
      }
      await payload.update({
        collection: "testimonials",
        id: found.docs[0].id,
        locale: "en",
        data: { guestOrigin: t.guestOrigin, text: t.text },
      });
    }
    results.push("Testimonials EN updated");
  } catch (e) {
    results.push(`Error updating testimonials EN: ${e}`);
  }

  results.push("Seeding complete!");
  return Response.json({ results });
}
