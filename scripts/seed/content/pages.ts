import type { Block } from "../rich-text";

export const HOME_PAGE = {
  image: "salon-cheminee-canapes-tv",
  featuredGuides: [
    "chateaux-de-la-loire-depuis-romorantin",
    "gite-proche-zooparc-de-beauval",
    "tourisme-equestre-en-sologne",
    "etangs-et-forets-de-sologne",
    "que-faire-a-romorantin-lanthenay",
    "week-end-en-sologne",
  ],
  fr: {
    title: "Gîte en Sologne, à Romorantin-Lanthenay",
    lede: "Une maison entière de 115 m² pour 6 personnes, avec jardin clos, dans la capitale de la Sologne. Le ZooParc de Beauval, Chambord, Cheverny et le Parc équestre fédéral de Lamotte-Beuvron sont à moins d'une heure de route.",
    houseTitle: "Une maison pour six, décorée pièce par pièce",
    houseText:
      "Trois chambres, dont une au rez-de-chaussée, un séjour avec cheminée, une cuisine équipée et un coin baby-foot pour les soirées. Dehors, la terrasse et le jardin clos : les enfants et le chien y sont en sécurité. Le linge est fourni, le wifi et le parking sont inclus.",
    surroundingsTitle: "Tout ce qui se visite est à portée de voiture",
    surroundingsText:
      "Romorantin est au centre de la Sologne : vous partez le matin vers un château de la Loire, les pandas de Beauval ou un concours à Lamotte-Beuvron, et vous rentrez dîner sur la terrasse. Nos guides donnent les temps de route réels, les bons horaires et ce qu'il faut réserver.",
    reviewsTitle: "Ce que les voyageurs en disent",
    guidesTitle: "Préparez vos sorties avec nos guides",
    guidesText:
      "Châteaux, Beauval, concours à Lamotte-Beuvron, étangs et forêts : chaque guide répond à une question précise, avec les temps de route depuis la maison.",
    bookingTitle: "Réservez en direct ou sur votre plateforme habituelle",
    bookingText:
      "Comptez 130 € la nuit pour 4 personnes, taxes et frais inclus. Relevé le 6 octobre 2026, ce prix était le même pour les 6 mois consultés, de novembre à août. Réservez sur Airbnb ou Booking, ou écrivez-nous pour une demande en direct.",
    meta: {
      title: "Gîte en Sologne, Romorantin-Lanthenay | L'Instant Tranquille",
      description:
        "Gîte L'Instant Tranquille à Romorantin-Lanthenay, en Sologne : maison de 115 m² pour 6 personnes, 3 chambres, jardin clos. Beauval à 38 min, Chambord à 43.",
      shareTitle: "Un gîte au calme en Sologne",
    },
  },
  en: {
    title: "Holiday cottage in Sologne, in Romorantin-Lanthenay",
    lede: "A whole 115 m² house for 6 guests with an enclosed garden, in the main town of the Sologne. Beauval Zoo, Chambord, Cheverny and the Lamotte-Beuvron equestrian park are all less than an hour's drive away.",
    houseTitle: "A house for six, decorated room by room",
    houseText:
      "Three bedrooms, one of them on the ground floor, a living room with a fireplace, a fully equipped kitchen and a table football corner for the evenings. Outside, a terrace and an enclosed garden where children and dogs are safe. Linen is provided, Wi-Fi and parking are included.",
    surroundingsTitle: "Everything worth seeing is a short drive away",
    surroundingsText:
      "Romorantin sits in the middle of the Sologne: leave in the morning for a Loire château, the pandas at Beauval or a show at Lamotte-Beuvron, and be back for dinner on the terrace. Our guides give real driving times, the right opening hours and what to book ahead.",
    reviewsTitle: "What guests say",
    guidesTitle: "Plan your days out with our guides",
    guidesText:
      "Châteaux, Beauval, shows at Lamotte-Beuvron, ponds and forests: each guide answers one precise question, with driving times from the house.",
    bookingTitle: "Book direct or on the platform you already use",
    bookingText:
      "Allow €130 a night for 4 guests, taxes and fees included. Recorded on 6 October 2026, this price was the same for the 6 months checked, from November to August. Book on Airbnb or Booking, or email us for a direct request.",
    meta: {
      title: "Sologne holiday cottage, Romorantin | L'Instant Tranquille",
      description:
        "L'Instant Tranquille, a 115 m² holiday cottage for 6 in Romorantin-Lanthenay, Sologne: 3 bedrooms, enclosed garden. Beauval Zoo 38 minutes, Chambord 43.",
      shareTitle: "A quiet cottage in Sologne",
    },
  },
} as const;

interface RoomText {
  name: string;
  details: string;
  description: string;
}

interface SeedRoom {
  level: "ground" | "upstairs" | "outdoors";
  photos: string[];
  fr: RoomText;
  en: RoomText;
}

const ROOMS: SeedRoom[] = [
  {
    level: "ground",
    photos: [
      "entree-porte-manteau-papier-peint-herons",
      "entree-commode-deco-briques",
    ],
    fr: {
      name: "L'entrée",
      details: "Porte-manteau, commode",
      description:
        "On pose les manteaux devant le papier peint aux hérons, un clin d'œil aux étangs de Sologne.",
    },
    en: {
      name: "The entrance hall",
      details: "Coat rack, chest of drawers",
      description:
        "Hang your coats in front of the heron wallpaper, a nod to the ponds of the Sologne.",
    },
  },
  {
    level: "ground",
    photos: [
      "salon-cheminee-canapes-tv",
      "sejour-canape-buffet-escalier",
      "sejour-canape-tv-escalier",
    ],
    fr: {
      name: "Le séjour",
      details: "Deux canapés, cheminée, télévision",
      description:
        "La pièce où tout le monde se retrouve : deux canapés autour de la table basse, la cheminée dans l'angle et la télévision. L'escalier en bois monte aux chambres.",
    },
    en: {
      name: "The living room",
      details: "Two sofas, fireplace, television",
      description:
        "The room where everyone gathers: two sofas around the coffee table, a fireplace in the corner and a television. The wooden staircase leads up to the bedrooms.",
    },
  },
  {
    level: "ground",
    photos: ["salon-baby-foot-mur-briques"],
    fr: {
      name: "Le coin jeux",
      details: "Baby-foot et jeux de société",
      description:
        "Un vrai baby-foot contre le mur de briques, et des jeux de société dans le buffet.",
    },
    en: {
      name: "The games corner",
      details: "Table football and board games",
      description:
        "A proper table football against the brick wall, and board games in the sideboard.",
    },
  },
  {
    level: "ground",
    photos: [
      "cuisine-equipee-verte-poutres",
      "detail-deco-cuisine-cloche-bronze",
    ],
    fr: {
      name: "La cuisine",
      details: "Lave-vaisselle, four, plaques, cafetière Dolce Gusto",
      description:
        "Une cuisine verte sous les poutres, avec tout ce qu'il faut pour cuisiner à six : lave-vaisselle, four, plaques et cafetière. La table est dans la pièce.",
    },
    en: {
      name: "The kitchen",
      details: "Dishwasher, oven, hob, Dolce Gusto coffee machine",
      description:
        "A green kitchen under the beams with everything needed to cook for six: dishwasher, oven, hob and coffee machine. The dining table is in the room.",
    },
  },
  {
    level: "ground",
    photos: [
      "chambre-1-vue-ensemble-papier-peint-foret",
      "chambre-1-lit-double-vert-sauge",
      "detail-deco-coiffeuse-miroir-chambre-1",
    ],
    fr: {
      name: "La chambre forêt",
      details: "1 lit double",
      description:
        "Un lit double, des tons vert sauge et un papier peint de sous-bois sur tout un mur. Un petit bureau complète la pièce.",
    },
    en: {
      name: "The forest bedroom",
      details: "1 double bed",
      description:
        "A double bed, sage green tones and a woodland wallpaper covering one wall. A small desk completes the room.",
    },
  },
  {
    level: "upstairs",
    photos: [
      "chambre-2-lit-double-sous-pente-terracotta",
      "chambre-2-tete-de-lit-sous-pente",
    ],
    fr: {
      name: "La chambre terracotta",
      details: "1 lit double",
      description:
        "Sous la pente du toit, un lit double et des murs couleur terre cuite, pour une chambre chaleureuse en toute saison.",
    },
    en: {
      name: "The terracotta bedroom",
      details: "1 double bed",
      description:
        "Under the slope of the roof, a double bed and terracotta walls make a warm room in any season.",
    },
  },
  {
    level: "upstairs",
    photos: ["chambre-3-lits-simples-sous-pente"],
    fr: {
      name: "La chambre aux deux lits",
      details: "2 lits simples",
      description:
        "Deux lits simples sous la pente, pour les enfants ou deux amis.",
    },
    en: {
      name: "The twin bedroom",
      details: "2 single beds",
      description:
        "Two single beds under the eaves, for children or two friends.",
    },
  },
  {
    level: "outdoors",
    photos: [
      "terrasse-salon-jardin",
      "jardin-terrasse-vue-ensemble",
      "jardin-souche-arbre-decorative",
    ],
    fr: {
      name: "La terrasse et le jardin",
      details: "Jardin clos, table pour six, barbecue",
      description:
        "Une terrasse en briques avec la table pour six et le barbecue, entourée de lierre et de rosiers. Le jardin est clos : les animaux sont les bienvenus.",
    },
    en: {
      name: "The terrace and garden",
      details: "Enclosed garden, table for six, barbecue",
      description:
        "A brick terrace with a table for six and a barbecue, surrounded by ivy and roses. The garden is enclosed: pets are welcome.",
    },
  },
];

const cottageDescriptionFr: Block[] = [
  "L'Instant Tranquille est une maison de ville de 115 m² à Romorantin-Lanthenay, dans le Loir-et-Cher. Elle se loue en entier, pour 6 personnes au plus : trois chambres dont une au rez-de-chaussée, un grand séjour, une cuisine équipée, une terrasse et un jardin clos.",
  "Erick et Karine l'ont décorée avec soin, pièce par pièce. La Halle, au centre-ville, est à 1 km à pied, une dizaine de minutes. La maison a 1 place de parking, et d'autres places se trouvent autour, dans la rue.",
];

const cottageDescriptionEn: Block[] = [
  "L'Instant Tranquille is a 115 m² town house in Romorantin-Lanthenay, in the Loir-et-Cher. It is rented as a whole, for up to 6 guests: three bedrooms, one of them on the ground floor, a large living room, a fully equipped kitchen, a terrace and an enclosed garden.",
  "Erick and Karine decorated it with care, room by room. The Halle, the covered market in the town centre, is 1 km away on foot, about ten minutes. The house has 1 parking space, and there are more spaces around it, in the street.",
];

export const COTTAGE_PAGE = {
  rooms: ROOMS,
  gallery: ["entree-detail-lampe-vase-briques", "detail-deco-vase-visage-dore"],
  fr: {
    title: "Une maison de 115 m² pour 6 personnes à Romorantin",
    lede: "Trois chambres, un séjour avec cheminée, une cuisine équipée, une terrasse et un jardin clos. Voici la maison, pièce par pièce.",
    description: cottageDescriptionFr,
    meta: {
      title: "Gîte 3 chambres, 6 personnes, jardin clos à Romorantin",
      description:
        "L'Instant Tranquille pièce par pièce : maison de 115 m² à Romorantin-Lanthenay, 3 chambres, 1 salle de bain, cheminée, baby-foot, terrasse et jardin clos.",
      shareTitle: "La maison, pièce par pièce",
    },
  },
  en: {
    title: "A 115 m² house for 6 guests in Romorantin",
    lede: "Three bedrooms, a living room with a fireplace, a fully equipped kitchen, a terrace and an enclosed garden. Here is the house, room by room.",
    description: cottageDescriptionEn,
    meta: {
      title: "3-bedroom cottage for 6 with enclosed garden in Romorantin",
      description:
        "L'Instant Tranquille room by room: a 115 m² house in Romorantin-Lanthenay with 3 bedrooms, 1 bathroom, fireplace, table football, terrace, enclosed garden.",
      shareTitle: "The house, room by room",
    },
  },
};

export const SURROUNDINGS_PAGE = {
  fr: {
    title: "Que faire autour de Romorantin, en Sologne",
    lede: "Châteaux de la Loire, ZooParc de Beauval, concours équestres, étangs et forêts : voici ce qui se visite depuis le gîte, avec le temps de route réel pour chaque lieu.",
    intro: [
      "Romorantin-Lanthenay est la plus grande ville de Sologne, à mi-chemin entre la Loire et le Cher. C'est ce qui rend le gîte pratique : la plupart des grands sites sont à moins d'une heure, les plus lointains à 1 h 30, et chaque journée peut partir dans une direction différente.",
      "Au nord, Chambord, Cheverny et Blois. À l'ouest, le ZooParc de Beauval et Chenonceau. À l'est, les étangs, les villages de briques et le Parc équestre fédéral de Lamotte-Beuvron. Au sud, Valençay et la vallée du Cher.",
    ] as Block[],
    equestrianTitle: "Cavaliers : dormir à Romorantin pendant un concours",
    headings: {
      chateaux: "Quels châteaux de la Loire visiter depuis Romorantin ?",
      famille: "Où sortir en famille en Sologne ?",
      nature: "Où marcher, pédaler et jouer au golf ?",
      villages: "Quelles villes et quels villages voir autour de Romorantin ?",
      terroir: "Où goûter les vins et les produits du terroir ?",
      loire: "Où embarquer sur la Loire et le Cher ?",
      romorantin: "Que faire à Romorantin, à deux pas du gîte ?",
      pratique: "Gare, courses, autoroute",
    },
    equestrianText: [
      "Le Parc équestre fédéral de Lamotte-Beuvron, siège de la Fédération française d'équitation, accueille chaque année le Generali Open de France et le Game Fair. Pendant ces semaines, les hébergements de Lamotte-Beuvron affichent complet des mois à l'avance.",
      "Le gîte loge une équipe ou une famille de six dans trois chambres, avec une cuisine pour les repas décalés et un jardin clos pour le chien. Il n'y a pas de box ni de pré sur place : les chevaux restent au parc ou dans une écurie des environs.",
    ] as Block[],
    meta: {
      title: "Que faire autour de Romorantin : châteaux, Beauval, cheval",
      description:
        "Que faire autour de Romorantin-Lanthenay : Cheverny à 31 min du gîte, Beauval à 38 min, Chambord à 43 min, étangs de Sologne, Parc équestre fédéral.",
      shareTitle: "Que faire autour du gîte",
    },
  },
  en: {
    title: "Things to do around Romorantin, in the Sologne",
    lede: "Loire châteaux, Beauval Zoo, horse shows, ponds and forests: here is what you can visit from the cottage, with the real driving time to each place.",
    intro: [
      "Romorantin-Lanthenay is the largest town in the Sologne, halfway between the Loire and the Cher. That is what makes the cottage practical: most major sights are less than an hour away, the furthest 1 hour 30, and each day can head in a different direction.",
      "To the north, Chambord, Cheverny and Blois. To the west, Beauval Zoo and Chenonceau. To the east, ponds, brick villages and the Lamotte-Beuvron equestrian park. To the south, Valençay and the Cher valley.",
    ] as Block[],
    equestrianTitle: "Riders: staying in Romorantin during a show",
    headings: {
      chateaux: "Which Loire châteaux can you visit from Romorantin?",
      famille: "Where to go with children in Sologne?",
      nature: "Where to walk, cycle and play golf?",
      villages: "Which towns and villages are worth a stop around Romorantin?",
      terroir: "Where to taste local wines and produce?",
      loire: "Where to get out on the Loire and the Cher?",
      romorantin: "What is there to do in Romorantin, near the cottage?",
      pratique: "Station, shopping, motorway",
    },
    equestrianText: [
      "The Parc équestre fédéral in Lamotte-Beuvron, home of the French Equestrian Federation, hosts the Generali Open de France and the Game Fair every year. During those weeks, accommodation in Lamotte-Beuvron is fully booked months ahead.",
      "The cottage sleeps a team or a family of six in three bedrooms, with a kitchen for meals at odd hours and an enclosed garden for the dog. There are no stables or paddocks on site: horses stay at the park or at a nearby yard.",
    ] as Block[],
    meta: {
      title: "Things to do around Romorantin: châteaux, Beauval, horses",
      description:
        "Things to do around Romorantin-Lanthenay: Cheverny 31 minutes from the cottage, Beauval Zoo 38, Chambord 43, the ponds of the Sologne, the equestrian park.",
      shareTitle: "Things to do near the cottage",
    },
  },
};

export const RATES_PAGE = {
  fr: {
    title: "Tarifs du gîte et réservation",
    lede: "Le prix dépend du nombre de voyageurs et de la durée du séjour. La maison se loue en entier, jusqu'à 6 personnes.",
    stepsTitle: "Comment réserver, en 3 étapes",
    steps: [
      {
        title: "Comptez voyageurs et nuits",
        text: "Le prix dépend du nombre de voyageurs et de la durée du séjour. Le séjour dure au moins {sejour_minimum}.",
      },
      {
        title: "Vérifiez vos dates",
        text: "Les dates libres se consultent sur Airbnb et Booking.com. Vous pouvez aussi nous les demander par message.",
      },
      {
        title: "Réservez",
        text: "En ligne sur la plateforme de votre choix, ou en direct en nous écrivant depuis la page contact.",
      },
    ],
    directBooking: [
      "Vous pouvez réserver sur Airbnb ou Booking, ou nous écrire directement. En direct, vous parlez tout de suite à Erick et Karine : dates souples, arrivée tardive après un concours, question sur le chien, tout se règle en un message.",
    ] as Block[],
    meta: {
      title: "Tarifs et réservation du gîte à Romorantin-Lanthenay",
      description:
        "Tarifs du gîte L'Instant Tranquille à Romorantin-Lanthenay : 130 € la nuit pour 4 personnes, taxes et frais inclus, prix relevés en octobre 2026.",
      shareTitle: "Tarifs et réservation du gîte",
    },
  },
  en: {
    title: "Cottage rates and booking",
    lede: "The price depends on the number of guests and the length of your stay. The house is rented as a whole, for up to 6 guests.",
    stepsTitle: "How to book, in 3 steps",
    steps: [
      {
        title: "Count guests and nights",
        text: "The price depends on the number of guests and the length of stay. The minimum stay is {sejour_minimum}.",
      },
      {
        title: "Check your dates",
        text: "Free dates are shown on Airbnb and Booking.com. You can also ask us by message.",
      },
      {
        title: "Book",
        text: "Online on the platform you prefer, or directly by writing to us from the contact page.",
      },
    ],
    directBooking: [
      "You can book on Airbnb or Booking, or email us directly. Booking direct puts you straight in touch with Erick and Karine: flexible dates, a late arrival after a show, a question about the dog, all settled in one message.",
    ] as Block[],
    meta: {
      title: "Rates and booking: holiday cottage in Romorantin-Lanthenay",
      description:
        "Rates for L'Instant Tranquille in Romorantin-Lanthenay: €130 a night for 4 guests, taxes and fees included, prices recorded in October 2026.",
      shareTitle: "Rates and how to book",
    },
  },
};

export const CONTACT_PAGE = {
  fr: {
    title: "Contacter le gîte et venir à Romorantin",
    lede: "Une question sur les dates, le couchage ou les alentours : écrivez-nous, nous vous répondons rapidement.",
    hostsNote:
      "Nous accueillons nous-mêmes chaque voyageur. Dites-nous ce qui vous amène en Sologne, nous vous dirons quoi voir et où manger.",
    bookingTitle: "Vous préférez réserver directement ?",
    bookingText:
      "La maison se réserve aussi en ligne, sur Airbnb et Booking.com.",
    meta: {
      title: "Contact et accès au gîte L'Instant Tranquille, Romorantin",
      description:
        "Écrivez à Erick et Karine, hôtes du gîte L'Instant Tranquille, 23 rue de Loreux, Romorantin-Lanthenay. Paris est à 2 h 32 en voiture, Orléans à 1 h 09.",
      shareTitle: "Écrire aux propriétaires du gîte",
    },
  },
  en: {
    title: "Contact the cottage and getting to Romorantin",
    lede: "A question about dates, beds or the area: email us and we will get back to you quickly.",
    hostsNote:
      "We welcome every guest ourselves. Tell us what brings you to the Sologne and we will tell you what to see and where to eat.",
    bookingTitle: "Would you rather book straight away?",
    bookingText:
      "The house can also be booked online, on Airbnb and Booking.com.",
    meta: {
      title: "Contact and directions: L'Instant Tranquille, Romorantin",
      description:
        "Write to Erick and Karine, hosts of L'Instant Tranquille, 23 rue de Loreux, 41200 Romorantin-Lanthenay, France. Paris is 2 hr 32 by car, Orléans 1 hr 09.",
      shareTitle: "Write to the cottage owners",
    },
  },
};

export const GUIDES_PAGE = {
  fr: {
    title: "Guides de séjour en Sologne",
    lede: "{count} réponses courtes aux questions que posent nos voyageurs, écrites depuis Romorantin-Lanthenay. Chaque guide donne les temps de route réels depuis le gîte.",
    leadTitle: "Par où commencer ?",
    allTitle: "Tous les guides, thème par thème",
    meta: {
      title: "Guides de séjour en Sologne, depuis Romorantin-Lanthenay",
      description:
        "Guides de séjour en Sologne, écrits depuis Romorantin-Lanthenay : châteaux, sorties en famille, cheval, nature, avec les temps de route depuis le gîte.",
      shareTitle: "Nos guides pour vos sorties",
    },
  },
  en: {
    title: "Travel guides to Sologne",
    lede: "{count} short answers to the questions our guests ask, written from Romorantin-Lanthenay. Each guide gives real driving times from the cottage.",
    leadTitle: "Where should you start?",
    allTitle: "All the guides, theme by theme",
    meta: {
      title: "Travel guides to Sologne, from Romorantin-Lanthenay",
      description:
        "Travel guides to the Sologne, written from Romorantin-Lanthenay: châteaux, family days out, horses and nature, with real driving times from the cottage.",
      shareTitle: "Our guides for your days out",
    },
  },
};

export const SCREEN_TEXTS = {
  fr: {
    tagline: "Gîte en Sologne, Romorantin-Lanthenay",
    filmEndTitle: "Et si votre prochain week‑end commençait ici ?",
  },
  en: {
    tagline: "Holiday cottage in Sologne, Romorantin-Lanthenay",
    filmEndTitle: "What if your next weekend started here?",
  },
};
