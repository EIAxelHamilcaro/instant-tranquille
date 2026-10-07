import type { Payload } from "payload";
import { SCREEN_TEXTS } from "./content/pages";
import { richText } from "./rich-text";

const ROUTES = [
  {
    distance: "212 km",
    fr: { from: "Paris", duration: "2 h 32", description: "A10 puis A71" },
    en: { from: "Paris", duration: "2 hr 32", description: "A10 then A71" },
  },
  {
    distance: "103 km",
    fr: { from: "Tours", duration: "1 h 10", description: "A85" },
    en: { from: "Tours", duration: "1 hr 10", description: "A85" },
  },
  {
    distance: "87 km",
    fr: { from: "Orléans", duration: "1 h 09", description: "A71" },
    en: { from: "Orléans", duration: "1 hr 09", description: "A71" },
  },
];

const FAQS = [
  {
    fr: {
      question: "Combien de personnes le gîte peut-il accueillir ?",
      answer:
        "Le gîte L'Instant Tranquille, à Romorantin-Lanthenay, accueille jusqu'à 6 personnes dans 3 chambres : 1 lit double dans la chambre 1, 1 lit double dans la chambre 2 et 2 lits simples dans la chambre 3. La maison fait 115 m² et compte 1 salle de bain.",
    },
    en: {
      question: "How many guests can the cottage accommodate?",
      answer:
        "L'Instant Tranquille, a holiday cottage in Romorantin-Lanthenay, sleeps up to 6 guests in 3 bedrooms: 1 double bed in bedroom 1, 1 double bed in bedroom 2 and 2 single beds in bedroom 3. The house measures 115 m² and has 1 bathroom.",
    },
  },
  {
    fr: {
      question: "Les animaux sont-ils acceptés ?",
      answer:
        "Oui, le gîte L'Instant Tranquille, à Romorantin-Lanthenay, accepte les animaux de compagnie, et son jardin est clos. Pour les conditions d'accueil, posez la question à Erick et Karine, les hôtes, par la messagerie d'Airbnb ou de Booking, ou par le formulaire de contact.",
    },
    en: {
      question: "Are pets allowed?",
      answer:
        "Yes, L'Instant Tranquille, a holiday cottage in Romorantin-Lanthenay, accepts pets, and its garden is enclosed. For the conditions, ask Erick and Karine, the hosts, through Airbnb or Booking messages, or with the contact form.",
    },
  },
  {
    fr: {
      question: "À quelle heure puis-je arriver et partir ?",
      answer:
        "Au gîte L'Instant Tranquille, à Romorantin-Lanthenay, l'arrivée se fait à partir de 17 h, en autonomie grâce à une boîte à clé sécurisée. Le départ se fait avant 10 h.",
    },
    en: {
      question: "What are the check-in and check-out times?",
      answer:
        "At L'Instant Tranquille, a holiday cottage in Romorantin-Lanthenay, check-in is from 5 pm, on your own with a secure key box. Check-out is before 10 am.",
    },
  },
  {
    fr: {
      question: "Où se garer, et peut-on recharger une voiture électrique ?",
      answer:
        "Le gîte L'Instant Tranquille, à Romorantin-Lanthenay, a 1 place de parking, et d'autres places se trouvent autour, dans la rue. Il n'a ni prise ni borne de recharge pour voiture électrique. La base nationale des bornes, consultée le 7 octobre 2026, recense des points de charge publics en ville, par exemple au 27 et au 31 avenue de Paris.",
    },
    en: {
      question: "Where can I park, and can I charge an electric car?",
      answer:
        "L'Instant Tranquille, a holiday cottage in Romorantin-Lanthenay, has 1 parking space, and there are more spaces around it, in the street. It has no socket or charging point for an electric car. The French national charging-point database, consulted on 7 October 2026, lists public charging points in town, for example at 27 and 31 avenue de Paris.",
    },
  },
  {
    fr: {
      question: "Peut-on aller au centre-ville à pied ?",
      answer:
        "Oui. Depuis le gîte L'Instant Tranquille, à Romorantin-Lanthenay, la Halle, au centre-ville, est à 1 km à pied, une dizaine de minutes. Si vous prenez la voiture, la ville a des parkings.",
    },
    en: {
      question: "Can I walk to the town centre?",
      answer:
        "Yes. From L'Instant Tranquille, a holiday cottage in Romorantin-Lanthenay, the Halle, the covered market in the town centre, is 1 km away on foot, about ten minutes. If you take the car, the town has car parks.",
    },
  },
  {
    fr: {
      question:
        "Linge, ménage, caution, wifi : comment avoir une réponse précise ?",
      answer:
        "Ce site ne publie que ce qu'Erick et Karine, les hôtes du gîte L'Instant Tranquille, à Romorantin-Lanthenay, ont confirmé. Pour toute autre question pratique, posez la question à Erick et Karine par la messagerie d'Airbnb ou de Booking, ou par le formulaire de contact.",
    },
    en: {
      question:
        "Linen, cleaning, deposit, Wi-Fi: how do I get a precise answer?",
      answer:
        "This site only publishes what Erick and Karine, the hosts of L'Instant Tranquille, a holiday cottage in Romorantin-Lanthenay, have confirmed. For any other practical question, ask Erick and Karine through Airbnb or Booking messages, or with the contact form.",
    },
  },
];

const DESCRIPTION = {
  fr: "L'Instant Tranquille est une maison de 115 m² à Romorantin-Lanthenay, en Sologne, louée en entier pour 6 personnes au plus. 3 chambres, 1 salle de bain, terrasse avec barbecue, cuisine équipée, baby-foot et jeux de société, jardin clos. Wifi gratuit, 1 place de parking.",
  en: "L'Instant Tranquille is a 115 m² house in Romorantin-Lanthenay, in the Sologne, rented as a whole for up to 6 guests. 3 bedrooms, 1 bathroom, terrace with barbecue, fully equipped kitchen, table football and board games, enclosed garden. Free Wi-Fi, 1 parking space.",
};

const localizedRows = (locale: "fr" | "en") => ({
  accessRoutes: ROUTES.map((route) => ({
    ...route[locale],
    distance: route.distance,
  })),
  faqs: FAQS.map((faq) => ({
    question: faq[locale].question,
    answer: richText([faq[locale].answer]),
  })),
});

export async function seedSettings(payload: Payload) {
  const french = await payload.updateGlobal({
    slug: "site-settings",
    locale: "fr",
    data: {
      ...SCREEN_TEXTS.fr,
      siteDescription: DESCRIPTION.fr,
      propertyDetails: {
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 1,
        surface: 115,
        petsAllowed: true,
      },
      contact: {
        email: "contact@instant-tranquille.com",
        address: "23 Rue de Loreux",
        city: "Romorantin-Lanthenay",
        postalCode: "41200",
        coordinates: {
          lat: 47.360803,
          lng: 1.7533421,
          zoom: 13,
          markerLabel: "L'Instant Tranquille",
        },
      },
      socialLinks: {
        facebook: "https://www.facebook.com/linstanttranquille",
        instagram: "https://www.instagram.com/linstanttranquille",
      },
      ...localizedRows("fr"),
    },
  });
  const english = localizedRows("en");

  await payload.updateGlobal({
    slug: "site-settings",
    locale: "en",
    data: {
      ...SCREEN_TEXTS.en,
      siteDescription: DESCRIPTION.en,
      accessRoutes: english.accessRoutes.map((route, index) => ({
        ...route,
        id: french.accessRoutes?.[index]?.id,
      })),
      faqs: english.faqs.map((faq, index) => ({
        ...faq,
        id: french.faqs?.[index]?.id,
      })),
    },
  });
}
