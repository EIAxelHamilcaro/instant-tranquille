import "dotenv/config";
import fs from "fs";
import path from "path";
import { getPayload } from "payload";
import config from "../src/payload.config";

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

async function seed() {
  const payload = await getPayload({ config });

  console.log("Seeding database...");

  // Upload hero image
  let heroImageId: number | null = null;
  try {
    const heroPath = path.resolve(process.cwd(), "scripts/assets/hero-gite.jpg");
    if (fs.existsSync(heroPath)) {
      const buffer = fs.readFileSync(heroPath);
      const heroMedia = await payload.create({
        collection: "media",
        data: {
          alt: "Gîte de charme en Sologne — L'Instant Tranquille",
          caption: "Vue extérieure du gîte L'Instant Tranquille en Sologne",
        },
        file: {
          data: buffer,
          name: "hero-gite.jpg",
          mimetype: "image/jpeg",
          size: buffer.length,
        },
      });
      heroImageId = heroMedia.id as number;
      console.log(`Hero image uploaded (id: ${heroImageId})`);
    } else {
      console.log("Hero image file not found at scripts/assets/hero-gite.jpg");
    }
  } catch (e) {
    console.log("Error uploading hero image:", e);
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
      console.log(`Testimonial ${testimonial.guestName} might already exist`);
    }
  }
  console.log("Testimonials seeded");

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
      console.log(`Amenity ${amenity.name} might already exist`);
    }
  }
  console.log("Amenities seeded");

  // Seed local recommendations (store IDs for onboarding guide relation)
  const recommendationsData = [
    {
      name: "Château de Chambord",
      category: "castles" as const,
      address: "41250 Chambord",
      phone: "+33 2 54 50 40 00",
      website: "https://www.chambord.org",
      distanceFromGite: "30 min",
      featured: true,
      order: 1,
      description: richText(
        "Le plus grand et le plus majestueux des châteaux de la Loire. Chef-d'œuvre de la Renaissance française, Chambord fascine par son architecture unique et son escalier à double révolution attribué à Léonard de Vinci.",
        "Le domaine de 5 440 hectares offre également de magnifiques promenades en forêt, des observations de la faune sauvage et des spectacles équestres."
      ),
      coordinates: { lat: 47.6161, lng: 1.517 },
    },
    {
      name: "Château de Cheverny",
      category: "castles" as const,
      address: "41700 Cheverny",
      phone: "+33 2 54 79 96 29",
      website: "https://www.chateau-cheverny.fr",
      distanceFromGite: "25 min",
      featured: true,
      order: 2,
      description: richText(
        "Château remarquablement meublé qui inspira Hergé pour le château de Moulinsart dans les aventures de Tintin. L'exposition permanente « Les Secrets de Moulinsart » ravira petits et grands.",
        "Ses jardins à la française, son chenil de chiens courants et ses croisières sur le canal en font une visite incontournable."
      ),
      coordinates: { lat: 47.5003, lng: 1.4581 },
    },
    {
      name: "Zoo de Beauval",
      category: "activities" as const,
      address: "41110 Saint-Aignan",
      phone: "+33 2 54 75 50 00",
      website: "https://www.zoobeauval.com",
      distanceFromGite: "45 min",
      featured: true,
      order: 3,
      description: richText(
        "L'un des plus beaux zoos du monde, classé parmi les 5 meilleurs. Beauval abrite plus de 35 000 animaux dont les célèbres pandas géants, des koalas et des lamantins.",
        "Ne manquez pas le spectacle d'oiseaux en vol libre et la serre tropicale, véritable dôme équatorial unique en France."
      ),
      coordinates: { lat: 47.2481, lng: 1.3547 },
    },
    {
      name: "Auberge du Cerf",
      category: "restaurants" as const,
      address: "Sologne",
      phone: "+33 2 54 XX XX XX",
      distanceFromGite: "5 km",
      featured: true,
      order: 4,
      description: richText(
        "Restaurant traditionnel solognot proposant une cuisine du terroir avec des produits locaux et de saison. Spécialités de gibier en automne et poissons d'étang.",
        "Cadre chaleureux avec terrasse ombragée pour les beaux jours. Réservation conseillée le week-end."
      ),
      coordinates: { lat: 47.49, lng: 1.78 },
    },
    {
      name: "Étang de Sologne — Randonnée",
      category: "nature" as const,
      distanceFromGite: "10 min à pied",
      featured: true,
      order: 5,
      description: richText(
        "Sentier de randonnée balisé autour d'un étang typique de Sologne. Parcours de 5 km accessible à tous, idéal pour observer les oiseaux et la flore locale.",
        "Au petit matin ou en fin de journée, vous pourrez peut-être apercevoir des cerfs, des biches ou des hérons cendrés."
      ),
      coordinates: { lat: 47.485, lng: 1.77 },
    },
    {
      name: "Marché de Romorantin",
      category: "markets" as const,
      address: "Romorantin-Lanthenay",
      distanceFromGite: "20 min",
      featured: false,
      order: 6,
      description: richText(
        "Grand marché traditionnel le mercredi et samedi matin dans le centre-ville de Romorantin. Producteurs locaux, fromages de chèvre, miel de Sologne, légumes de saison.",
        "Profitez-en pour flâner dans les ruelles de cette jolie ville et découvrir son patrimoine historique au bord de la Sauldre."
      ),
      coordinates: { lat: 47.3564, lng: 1.7486 },
    },
  ];

  const recommendationIds: number[] = [];
  for (const rec of recommendationsData) {
    try {
      const created = await payload.create({ collection: "local-recommendations", data: rec });
      recommendationIds.push(created.id as number);
    } catch {
      console.log(`Recommendation ${rec.name} might already exist`);
    }
  }
  console.log("Local recommendations seeded");

  // Seed an onboarding guide
  try {
    await payload.create({
      collection: "onboarding-guides",
      data: {
        title: "Bienvenue — Famille Dupont",
        accessToken: "dupont-2024-test",
        isActive: true,
        arrivalInstructions: {
          accessCode: "4589#",
          instructions: richText(
            "Entrez le code 4589# sur le digicode à gauche de la porte d'entrée principale.",
            "La clé se trouve dans la boîte à clés fixée au mur à droite de la porte, code 1234. Tournez les molettes pour composer le code, tirez le couvercle vers le bas.",
            "Une fois à l'intérieur, refermez la boîte à clés et mélangez les molettes."
          ),
          parkingInfo:
            "Deux places de parking sont disponibles devant le gîte. Merci de vous garer sur les emplacements prévus.",
        },
        houseRules: richText(
          "Merci de respecter le calme du voisinage, particulièrement entre 22h et 8h.",
          "Le gîte est entièrement non-fumeur. Vous pouvez fumer à l'extérieur, des cendriers sont à disposition sur la terrasse.",
          "Les animaux de compagnie sont acceptés sous réserve d'accord préalable. Un supplément de 30€ par séjour sera demandé.",
          "Merci de trier vos déchets : poubelle jaune pour le recyclage, poubelle verte pour les ordures ménagères."
        ),
        wifiInfo: {
          networkName: "InstantTranquille_Wifi",
          password: "Sologne2024!",
        },
        equipmentGuide: [
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
        emergencyContacts: [
          {
            name: "Propriétaires",
            role: "Hôtes",
            phone: "+33 6 12 34 56 78",
            available: "8h-22h",
          },
          {
            name: "SAMU",
            role: "Urgences médicales",
            phone: "15",
            available: "24h/24",
          },
          {
            name: "Pompiers",
            role: "Incendie / Secours",
            phone: "18",
            available: "24h/24",
          },
          {
            name: "Gendarmerie",
            role: "Police",
            phone: "17",
            available: "24h/24",
          },
        ],
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
        ...(recommendationIds.length > 0 ? { localRecommendations: recommendationIds } : {}),
      },
    });
    console.log("Onboarding guide created");
  } catch {
    console.log("Onboarding guide might already exist");
  }

  // Seed pages (with drafts enabled, _status is required)
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
      console.log(`Page ${page.slug} might already exist`);
    }
  }
  console.log("Pages seeded");

  // Seed site settings global
  try {
    await payload.updateGlobal({
      slug: "site-settings",
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
          coordinates: {
            lat: 47.4833,
            lng: 1.7667,
          },
        },
        socialLinks: {
          facebook: "https://www.facebook.com/linstanttranquille",
          instagram: "https://www.instagram.com/linstanttranquille",
        },
        propertyDetails: {
          maxGuests: 6,
          bedrooms: 3,
          bathrooms: 2,
          surface: 120,
        },
        defaultSeo: {
          metaTitle: "L'Instant Tranquille — Gîte de charme en Sologne",
          metaDescription:
            "Découvrez L'Instant Tranquille, gîte de charme au cœur de la Sologne. 3 chambres, 120m², jardin arboré. Entre forêts et châteaux de la Loire.",
          ...(heroImageId ? { ogImage: heroImageId } : {}),
        },
      },
    });
    console.log("Site settings updated");
  } catch (e) {
    console.log("Error updating site settings:", e);
  }

  // Seed pricing config global
  try {
    await payload.updateGlobal({
      slug: "pricing-config",
      draft: false,
      data: {
        _status: "published",
        currency: "EUR",
        seasons: [
          {
            name: "Basse saison",
            dateRange: { start: "1er novembre", end: "31 mars" },
            nightlyRate: 90,
            weeklyRate: 540,
            minimumStay: 2,
            color: "green",
          },
          {
            name: "Moyenne saison",
            dateRange: { start: "1er avril", end: "30 juin" },
            nightlyRate: 120,
            weeklyRate: 720,
            minimumStay: 3,
            color: "orange",
          },
          {
            name: "Haute saison",
            dateRange: { start: "1er juillet", end: "31 août" },
            nightlyRate: 150,
            weeklyRate: 900,
            minimumStay: 7,
            color: "red",
          },
          {
            name: "Très haute saison",
            dateRange: { start: "Fêtes", end: "et ponts" },
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
            description: "Optionnel, draps et serviettes",
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
    console.log("Pricing config updated");
  } catch (e) {
    console.log("Error updating pricing config:", e);
  }

  // Seed header global
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
        ctaButton: {
          label: "Réserver",
          url: "/tarifs-reservation",
        },
      },
    });
    console.log("Header updated");
  } catch (e) {
    console.log("Error updating header:", e);
  }

  // Seed footer global
  try {
    await payload.updateGlobal({
      slug: "footer",
      draft: false,
      data: {
        _status: "published",
        description:
          "Un gîte de charme au cœur de la Sologne, entre forêts et châteaux de la Loire.",
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
          {
            title: "Ressources",
            links: [
              { label: "Airbnb", url: "https://www.airbnb.fr", isExternal: true },
              { label: "Booking", url: "https://www.booking.com", isExternal: true },
            ],
          },
        ],
        legalText:
          "L'Instant Tranquille — Gîte de vacances en Sologne. Tous droits réservés.",
      },
    });
    console.log("Footer updated");
  } catch (e) {
    console.log("Error updating footer:", e);
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
