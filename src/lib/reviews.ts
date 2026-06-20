import type { CmsTestimonial } from "@/lib/queries";

export const REVIEWS: CmsTestimonial[] = [
  {
    id: "julien",
    guestName: "Julien",
    rating: 5,
    source: "airbnb",
    text: "Nous avons passé un excellent we de Pâques dans cette maison. Erick est un hôte accueillant, sympathique et très disponible. La maison est décorée avec goût et est très fonctionnelle. Linge de maison et literie de qualité. Cuisine très bien équipée. Nous recommandons et nous reviendrons avec grand plaisir !",
  },
  {
    id: "laura",
    guestName: "Laura",
    rating: 5,
    source: "airbnb",
    text: "Nous avons passé un très bon séjour. Éric a été très accueillant dès notre arrivée, ce qui met tout de suite à l'aise. Le logement était impeccable, très propre et parfaitement entretenu. La literie est très confortable, nous avons très bien dormi. Le baby-foot et les jeux de société sont un vrai plus pour passer une bonne soirée, c'est convivial. Pour un logement avec trois chambres, le rapport qualité-prix est vraiment très bon. Nous recommandons sans hésiter !",
  },
  {
    id: "hasan",
    guestName: "Hasan",
    rating: 5,
    source: "airbnb",
    text: "Logements bien refait et propre et fonctionnel, notre séjour est très bien passé. La communication et l'accueil par Erick était très sympathique. Merci Erick. Donc je recommande vivement.",
  },
  {
    id: "stephanie",
    guestName: "Stéphanie",
    rating: 5,
    source: "airbnb",
    text: "Merci beaucoup à Erick pour la qualité de son accueil. Vous avez une très belle maison très agréable. Celle-ci est décorée avec soin et chaleur. C'est avec plaisir que nous reviendrons si l'occasion se présente. Stéphanie et William",
  },
  {
    id: "nicolas",
    guestName: "Nicolas",
    rating: 5,
    source: "airbnb",
    text: "Logement parfait très bien aménagé et décoré avec goût. Idéal pour une famille avec ados. Nous recommandons ce logement. Hôte très réactif",
  },
  {
    id: "arbi",
    guestName: "Arbi",
    rating: 5,
    source: "airbnb",
    text: "Séjour très satisfaisant dans cet appartement, conforme à la description, propre et bien équipé. Nous le recommandons sans hésitation.",
  },
  {
    id: "philippe",
    guestName: "Philippe",
    rating: 5,
    source: "airbnb",
    text: "Logement très agréable, très bien aménagé avec beaucoup de goût. Il est très fonctionnel. Merci à Éric pour son accueil et sa bienveillance. Nous reviendrons.",
  },
  {
    id: "anilia",
    guestName: "Anilia",
    guestOrigin: "France",
    rating: 5,
    source: "booking",
    text: "J'ai adoré la maison, qui est d'ailleurs très bien situé. Mais je tiens surtout à souligner la disponibilité, la gentillesse et la qualité de l'hôte.",
  },
  {
    id: "stephane",
    guestName: "Stéphane",
    guestOrigin: "France",
    rating: 5,
    source: "booking",
    text: "C'est une charmante maison décoré avec goût contenant tout le confort nécessaire pour y séjourner.",
  },
];

export const REVIEW_LINKS = {
  airbnb: "https://www.airbnb.fr/rooms/1605140748799580144/reviews",
  booking: "https://www.booking.com/hotel/fr/linstant-tranquille.fr.html",
};

export const REVIEW_AGGREGATE = {
  airbnb: { rating: "5,0", scale: "5", count: 8 },
  booking: { rating: "9,8", scale: "10", count: 5 },
};
