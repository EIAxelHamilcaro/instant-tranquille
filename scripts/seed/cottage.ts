import type { Payload } from "payload";
import type { AmenityIconName } from "../../src/lib/amenity-icons";
import type { ReviewTopic } from "../../src/lib/review-topics";

type AmenityCategory = "indoor" | "outdoor" | "kitchen" | "comfort";

const AMENITIES: [string, string, AmenityIconName, AmenityCategory][] = [
  ["Wifi gratuit", "Free Wi-Fi", "wifi", "indoor"],
  ["Télévision", "Television", "tv", "indoor"],
  ["Baby-foot", "Table football", "games", "indoor"],
  ["Jeux de société", "Board games", "games", "indoor"],
  ["Cuisine équipée", "Fully equipped kitchen", "kitchen", "kitchen"],
  ["Lave-vaisselle", "Dishwasher", "dishes", "kitchen"],
  ["Cafetière Dolce Gusto", "Dolce Gusto coffee machine", "coffee", "kitchen"],
  ["Jardin privé clôturé", "Private enclosed garden", "fence", "outdoor"],
  ["Terrasse avec barbecue", "Terrace with barbecue", "barbecue", "outdoor"],
  ["Parking gratuit, 1 place", "Free parking, 1 space", "parking", "outdoor"],
  [
    "Linge et serviettes fournis",
    "Linen and towels provided",
    "linen",
    "comfort",
  ],
  ["Animaux acceptés", "Pets welcome", "pets", "comfort"],
];

interface SeedReview {
  guestName: string;
  source: "airbnb" | "booking";
  text: string;
  language?: "en" | "nl";
  featured?: boolean;
}

const TOPIC_WORDS: Record<ReviewTopic, RegExp> = {
  house: /déco|literie|baby-foot|decorated|comfortable beds/i,
  welcome: /disponibilité|gentillesse|bienveillance/i,
  value: /qualité-prix|value for money/i,
};

const topicsOf = (text: string) =>
  (Object.keys(TOPIC_WORDS) as ReviewTopic[]).filter((topic) =>
    TOPIC_WORDS[topic].test(text),
  );

const REVIEWS: SeedReview[] = [
  {
    guestName: "Glachant",
    source: "booking",
    featured: true,
    text: "L'apaisement que procure l'ambiance de cette maison. Espaces grands, petit jardin pour petit déjeuner dehors, grande cuisine, salon très agréable, jolies chambres, douche à l'italienne.",
  },
  {
    guestName: "Julien",
    source: "airbnb",
    featured: true,
    text: "Nous avons passé un excellent we de Pâques dans cette maison. Erick est un hôte accueillant, sympathique et très disponible. La maison est décorée avec goût et est très fonctionnelle. Linge de maison et literie de qualité. Cuisine très bien équipée. Nous recommandons et nous reviendrons avec grand plaisir !",
  },
  {
    guestName: "Lee",
    source: "booking",
    language: "en",
    featured: true,
    text: "Erick the host is very welcoming, the gite is immaculately decorated to a very high standard, the accomodation was spotlessly clean and comfortable. The local area is very pretty with plenty of shops, pubs and restuarants.",
  },
  {
    guestName: "Johanna",
    source: "airbnb",
    featured: true,
    text: "Nous avons passé un très bon week-end. Le logement est super et très bien situé pour visiter différents châteaux pour un week-end. Erik a été très gentil et réactif tout au long du week-end.",
  },
  {
    guestName: "Laura",
    source: "airbnb",
    featured: true,
    text: "Nous avons passé un très bon séjour. Éric a été très accueillant dès notre arrivée, ce qui met tout de suite à l'aise. Le logement était impeccable, très propre et parfaitement entretenu. La literie est très confortable, nous avons très bien dormi. Le baby-foot et les jeux de société sont un vrai plus pour passer une bonne soirée, c'est convivial. Pour un logement avec trois chambres, le rapport qualité-prix est vraiment très bon. Nous recommandons sans hésiter !",
  },
  {
    guestName: "Nicolas",
    source: "airbnb",
    featured: true,
    text: "Logement parfait très bien aménagé et décoré avec goût. Idéal pour une famille avec ados. Nous recommandons ce logement. Hôte très réactif",
  },
  {
    guestName: "Anilia",
    source: "booking",
    text: "J'ai adoré la maison, qui est d'ailleurs très bien situé. Mais je tiens surtout à souligner la disponibilité, la gentillesse et la qualité de l'hôte.",
  },
  {
    guestName: "Kate",
    source: "booking",
    language: "en",
    text: "Beautifully clean, and well equipped, comfortable beds and a 15 minute walk into town.",
  },
  {
    guestName: "Rony",
    source: "booking",
    language: "nl",
    text: "Een perfect onderhouden huisje met alle comfort. Heel comfortabel ook. Echt een rustmoment na een lange autorit.",
  },
  {
    guestName: "Stéphanie",
    source: "airbnb",
    text: "Merci beaucoup à Erick pour la qualité de son accueil. Vous avez une très belle maison très agréable. Celle-ci est décorée avec soin et chaleur. C'est avec plaisir que nous reviendrons si l'occasion se présente. Stéphanie et William",
  },
  {
    guestName: "Stephanie",
    source: "airbnb",
    text: "Très beau logement. Erick est un hôte attentif et très sympathique. Nous avons passé un excellent séjour en famille !",
  },
  {
    guestName: "Christèle et Manu",
    source: "airbnb",
    text: "Superbe logement très propre et très beau. Très bien situé. Erick est très gentil et très accueillant. Je recommande +++",
  },
  {
    guestName: "Gaël",
    source: "airbnb",
    text: "Nous avons passé un très bon séjour dans la maison de Erick. Maison décorée et aménagée avec beaucoup d'attention.",
  },
  {
    guestName: "David",
    source: "airbnb",
    text: "Logement très agréable et décoré avec goût, nous y reviendrons, certainement. Très bonne communication avec Erick.",
  },
  {
    guestName: "Veronique",
    source: "airbnb",
    text: "Logement impeccable, très bien agencé avec un petit plus : le baby-foot",
  },
  {
    guestName: "Philippe",
    source: "airbnb",
    text: "Logement très agréable, très bien aménagé avec beaucoup de goût. Il est très fonctionnel. Merci à Éric pour son accueil et sa bienveillance. Nous reviendrons.",
  },
  {
    guestName: "Hasan",
    source: "airbnb",
    text: "Logements bien refait et propre et fonctionnel, notre séjour est très bien passé. La communication et l'accueil par Erick était très sympathique. Merci Erick. Donc je recommande vivement.",
  },
  {
    guestName: "Stéphane",
    source: "booking",
    text: "C'est une charmante maison décoré avec goût contenant tout le confort nécessaire pour y séjourner.",
  },
  {
    guestName: "Marion",
    source: "airbnb",
    text: "Très beau logement, conforme à la description. Tout s'est bien passé",
  },
  {
    guestName: "Marie",
    source: "booking",
    text: "Très bon séjour, je recommande. Accueil, déco, propreté et calme.",
  },
  {
    guestName: "Florine",
    source: "airbnb",
    text: "Magnifique logement, rien à dire.",
  },
];

const ENGLISH_BADGES: Record<string, string> = {
  airbnb: "Guest favourite",
};

export async function seedCottage(payload: Payload) {
  const settings = await payload.updateGlobal({
    slug: "site-settings",
    data: {
      hosts: "Erick et Karine",
      platforms: [
        {
          platform: "airbnb",
          url: "https://www.airbnb.fr/rooms/1605140748799580144",
          rating: 5,
          ratingScale: 5,
          reviewCount: 15,
          badge: "Coup de cœur voyageurs",
        },
        {
          platform: "booking",
          url: "https://www.booking.com/hotel/fr/linstant-tranquille.fr.html",
          rating: 9.6,
          ratingScale: 10,
          reviewCount: 13,
        },
      ],
    },
  });
  await payload.updateGlobal({
    slug: "site-settings",
    locale: "en",
    data: {
      platforms: settings.platforms?.map((platform) => ({
        ...platform,
        badge: ENGLISH_BADGES[platform.platform],
      })),
    },
  });

  const amenities = await payload.count({ collection: "amenities" });
  if (amenities.totalDocs === 0) {
    for (const [index, [fr, en, icon, category]] of AMENITIES.entries()) {
      const created = await payload.create({
        collection: "amenities",
        locale: "fr",
        data: { name: fr, icon, category, order: index, enabled: true },
      });
      await payload.update({
        collection: "amenities",
        id: created.id,
        locale: "en",
        data: { name: en },
      });
    }
    console.log(`Amenities created: ${AMENITIES.length}`);
  }

  const reviews = await payload.count({ collection: "testimonials" });
  if (reviews.totalDocs === 0) {
    for (const { featured = false, ...review } of REVIEWS) {
      await payload.create({
        collection: "testimonials",
        locale: "fr",
        data: {
          ...review,
          rating: 5,
          status: "approved",
          featured,
          topics: topicsOf(review.text),
        },
      });
    }
    console.log(`Reviews created: ${REVIEWS.length}`);
  }

  const existing = await payload.find({
    collection: "testimonials",
    locale: "fr",
    limit: 200,
    depth: 0,
  });
  for (const review of existing.docs) {
    const topics = topicsOf(review.text);
    if (review.topics?.length || topics.length === 0) continue;

    await payload.update({
      collection: "testimonials",
      id: review.id,
      data: { topics },
    });
    console.log(`Review tagged: ${review.guestName} (${topics.join(", ")})`);
  }
}
