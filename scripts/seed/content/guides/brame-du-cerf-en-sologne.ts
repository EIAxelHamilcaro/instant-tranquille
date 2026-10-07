import type { SeedGuide } from "../../guides";

export const guide: SeedGuide = {
  slug: "brame-du-cerf-en-sologne",
  theme: "nature",
  places: [
    "brame-chambord",
    "chambord",
    "maison-du-cerf",
    "boucle-velo-cerf",
    "domaine-du-ciran",
  ],
  checkedAt: "2026-10-06",
  sources: [
    {
      url: "https://www.chambord.org/fr/agenda/brame-du-cerf/",
      fr: "Domaine national de Chambord, brame du cerf 2026",
      en: "Domaine national de Chambord, 2026 deer rut",
    },
    {
      url: "https://www.chambord.org/fr/preparer-ma-visite/comment-venir/",
      fr: "Domaine national de Chambord, accès et parkings",
      en: "Domaine national de Chambord, access and car parks",
    },
    {
      url: "https://www.onf.fr/vivre-la-foret/+/22ce::ecouter-le-brame-du-cerf-des-regles-de-prudence-simposent.html",
      fr: "Office national des forêts, écouter le brame : les règles de prudence",
      en: "French National Forests Office, rules for listening to the rut",
    },
    {
      url: "https://ofb.gouv.fr/especes/cerf-elaphe-cervus-elaphus",
      fr: "Office français de la biodiversité, fiche du cerf élaphe",
      en: "French Biodiversity Agency, red deer fact sheet",
    },
    {
      url: "https://www.maisonducerf.fr/informations-pratiques",
      fr: "Maison du Cerf à Villeny, horaires et tarifs",
      en: "Maison du Cerf in Villeny, opening times and prices",
    },
    {
      url: "https://www.sologne-nature.org/sne-vue-de-l-interieur/a-l-ecoute-du-brame-quelques-conseils-avises",
      fr: "Sologne Nature Environnement, conseils pour écouter le brame",
      en: "Sologne Nature Environnement, advice on listening to the rut",
    },
    {
      url: "https://www.plumedenature.com/brame-du-cerf/",
      fr: "Plume de Nature, sorties brame 2026",
      en: "Plume de Nature, 2026 guided rut outings",
    },
    {
      url: "https://fdc41.com/ouvertures-et-fermetures-de-la-chasse/",
      fr: "Fédération des chasseurs de Loir-et-Cher, dates de chasse 2026-2027",
      en: "Loir-et-Cher hunting federation, 2026-2027 season dates",
    },
    {
      url: "https://relaisdechambord.com/legrandsaintmichel",
      fr: "Relais de Chambord, restaurant Le Grand Saint-Michel",
      en: "Relais de Chambord, Le Grand Saint-Michel restaurant",
    },
  ],
  fr: {
    title: "Brame du cerf en Sologne : où, quand et comment l'écouter",
    excerpt:
      "Le brame du cerf s'écoute en Sologne de mi-septembre à mi-octobre, à l'aube et au crépuscule. À Chambord, à 43 min de Romorantin, 5 aires de vision et 5 miradors sont en accès libre. Les sorties guidées se réservent des mois avant.",
    metaTitle: "Brame du cerf en Sologne : dates, lieux, tarifs 2026",
    metaDescription:
      "Brame du cerf en Sologne, de mi-septembre à mi-octobre : observatoires gratuits de Chambord à 43 min de Romorantin, sorties guidées dès 17 € en 2026.",
    practical: [
      {
        label: "Quand",
        value:
          "De mi-septembre à mi-octobre. Le soir à partir de 18 h, le matin vers 6 h 30.",
      },
      {
        label: "Où",
        value:
          "Domaine de Chambord, à 43 min (40 km) du gîte L'Instant Tranquille, à Romorantin-Lanthenay : 5 aires de vision et 5 miradors en accès libre.",
      },
      {
        label: "Budget",
        value:
          "Gratuit en accès libre, hors parking de Chambord à 8 € par jour. Sorties guidées de 17 € à 60 € par personne, ou 250 € pour un groupe de 4 (tarifs 2026).",
      },
      {
        label: "À réserver",
        value:
          "Les sorties guidées seulement. En 2026, Chambord a ouvert ses réservations le 1er juin, la Maison du Cerf le 1er avril.",
      },
      {
        label: "Enfants",
        value:
          "Accès libre sans âge minimum. Sorties guidées à partir de 10, 12 ou 15 ans selon l'organisateur.",
      },
      {
        label: "Chiens",
        value:
          "À laisser à la maison : l'Office national des forêts demande de ne pas en emmener, même en laisse.",
      },
    ],
    body: [
      "Le brame du cerf s'écoute en Sologne de mi-septembre à mi-octobre, à l'aube et au crépuscule. L'endroit le plus simple est le domaine de Chambord, à 43 min du gîte L'Instant Tranquille, à Romorantin-Lanthenay : 5 aires de vision et 5 miradors y sont ouverts à tous, gratuitement, sans réservation. Pour approcher les cerfs de plus près, il faut une sortie guidée, et elle se réserve plusieurs mois à l'avance.",
      "Ce guide a été vérifié le 6 octobre 2026, en fin de saison. Les dates et les tarifs sont ceux de 2026. Rien n'est encore publié pour 2027 : les repères de réservation ci-dessous vous disent quand surveiller les sites.",
      { h2: "Quand écouter le brame du cerf en Sologne ?" },
      [
        "De début septembre à mi-octobre selon l'",
        {
          text: "Office français de la biodiversité",
          href: "https://ofb.gouv.fr/especes/cerf-elaphe-cervus-elaphus",
        },
        ". Chambord organise ses sorties de mi-septembre à mi-octobre. Le cerf brame surtout quand la température baisse, aux aurores et à la tombée du jour. L'association Sologne Nature Environnement conseille d'être en place à partir de 18 h le soir, ou vers 6 h 30 le matin.",
      ],
      "Le soir est plus simple à organiser : vous arrivez de jour, vous repartez de nuit. Le matin, vous arrivez dans le noir, car le soleil se lève tard à cette saison.",
      {
        table: {
          head: ["Date", "Lever du soleil", "Coucher du soleil"],
          rows: [
            ["15 septembre", "7 h 29", "20 h 08"],
            ["1er octobre", "7 h 51", "19 h 35"],
            ["15 octobre", "8 h 11", "19 h 08"],
          ],
        },
      },
      "Ces heures sont calculées pour Chambord, en heure d'été. Personne ne peut promettre un brame : les organisateurs eux-mêmes préviennent que l'observation n'est jamais garantie.",
      { h2: "Où écouter le brame gratuitement, sans guide ?" },
      [
        "À Chambord. Le ",
        {
          text: "domaine national",
          href: "https://www.chambord.org/fr/agenda/brame-du-cerf/",
        },
        " couvre 5 440 hectares, dont 1 000 sont ouverts au public. Il estime sa population à 700 cerfs. Dans la zone publique, 5 aires de vision, pour 50 personnes chacune, et 5 miradors, pour 4 à 6 personnes, sont en accès libre et gratuit. Leur emplacement figure sur le « plan des promenades et observatoires », à télécharger sur la page du brame du domaine.",
      ],
      {
        list: [
          [
            { text: "Stationnement", bold: true },
            ", les parkings du domaine sont ouverts 24 h sur 24. Le tarif est de 8 € par jour pour une voiture, payable par carte aux bornes. Le parking P0 est à 600 m du château.",
          ],
          [
            { text: "Trajet", bold: true },
            ", 43 min (40 km) depuis le gîte. Le retour se fait de nuit, par des routes de forêt : roulez lentement.",
          ],
          [
            { text: "Affluence", bold: true },
            ", les miradors n'ont que 4 à 6 places. Arrivez tôt et préférez un soir de semaine.",
          ],
        ],
      },
      "Ailleurs en Sologne, la forêt est en grande partie privée. Aucun office de tourisme ne recommande un lieu d'écoute libre en dehors de Chambord. Si vous tentez votre chance depuis un chemin communal, restez sur le chemin et garez-vous loin des places de brame.",
      { h2: "Quelles sorties guidées, et à quel prix ?" },
      "Six formules existaient en 2026, de 17 € par personne à 250 € pour un groupe de 4. Toutes demandent une réservation, et la plupart affichent complet bien avant septembre.",
      {
        table: {
          head: ["Sortie", "Tarif 2026", "Âge", "Réservation"],
          rows: [
            [
              "Chambord, « L'écoute du brame » : mirador en zone fermée, 16 personnes, environ 2 h",
              "45 € en semaine, 60 € le week-end",
              "12 ans",
              "Par téléphone, à partir du 1er juin",
            ],
            [
              "Chambord, « Au cœur du brame » : mirador choisi par un guide, 4 personnes",
              "250 € par groupe",
              "12 ans",
              "Par téléphone, à partir du 1er juin",
            ],
            [
              "Maison du Cerf, Villeny : visite du musée puis sortie en forêt, départ 17 h 30",
              "Non publié",
              "15 ans",
              "À partir du 1er avril",
            ],
            [
              "Sologne Nature Environnement : sortie d'environ 2 h 30",
              "17 €, gratuit avant 14 ans",
              "Non précisé",
              "Jusqu'à 24 h avant",
            ],
            [
              "Plume de Nature : 4 h, 5 km, 8 personnes, repas ou petit déjeuner compris",
              "52 €",
              "10 ans conseillé",
              "En ligne",
            ],
            [
              "Domaine du Ciran, Ménestreau-en-Villette : cerfs élevés en parc",
              "Complet en 2026",
              "8 ans",
              "Par téléphone",
            ],
          ],
        },
      },
      [
        "À Chambord, les départs ont lieu entre 6 h et 7 h le matin, entre 18 h et 19 h le soir. La réservation se fait uniquement par téléphone, au 02 54 50 40 00. La ",
        { text: "Maison du Cerf", href: "https://www.maisonducerf.fr/" },
        " est à Villeny, à 36 min (33 km) du gîte. ",
        {
          text: "Sologne Nature Environnement",
          href: "https://www.sologne-nature.org/",
        },
        " est basée à Romorantin et communique le lieu de rendez-vous une semaine avant la sortie. ",
        {
          text: "Plume de Nature",
          href: "https://www.plumedenature.com/brame-du-cerf/",
        },
        " est une guide indépendante qui sort près de Chambord. Le domaine du Ciran est dans le Loiret, à 62 min du gîte.",
      ],
      { h2: "Une soirée de brame à Chambord, heure par heure" },
      "Voici le déroulé d'une soirée en accès libre, début octobre, quand le soleil se couche vers 19 h 35. En septembre, décalez tout de 30 min plus tard.",
      {
        programme: [
          {
            time: "16 h 45",
            title: "Départ du gîte",
            details:
              "43 min de route (40 km). Emportez des jumelles, des vêtements chauds et sombres, et laissez le chien à la maison.",
          },
          {
            time: "17 h 30",
            title: "Arrivée à Chambord",
            details:
              "Stationnement à 8 € par jour, payable par carte. Repérez l'aire de vision ou le mirador choisi sur le plan du domaine avant de partir à pied.",
          },
          {
            time: "18 h 00",
            title: "En place, en silence",
            details:
              "Téléphone en silencieux, pas de parfum, pas de vêtement qui bruisse. Les premiers brames s'entendent souvent avant de voir un animal.",
          },
          {
            time: "19 h 35",
            title: "Coucher du soleil",
            details:
              "Le moment le plus actif. Restez jusqu'à la nuit, sans lampe ni flash : les éclairer est interdit.",
          },
          {
            time: "20 h 15",
            title: "Dîner ou retour",
            details:
              "Le Grand Saint-Michel, au Relais de Chambord, sert de 19 h à 22 h, réservation vivement conseillée. Sinon, retour au gîte vers 21 h.",
          },
        ],
      },
      { h2: "Quelles règles suivre pour ne pas déranger les cerfs ?" },
      [
        "Il faut plusieurs heures pour que le brame s'installe, et une simple présence humaine suffit à le rompre. L'",
        {
          text: "Office national des forêts",
          href: "https://www.onf.fr/vivre-la-foret/+/22ce::ecouter-le-brame-du-cerf-des-regles-de-prudence-simposent.html",
        },
        " donne ces consignes :",
      ],
      {
        list: [
          "Restez sur les chemins autorisés et loin des places de brame. Il n'est pas nécessaire d'entrer au cœur de la forêt : les appels s'entendent depuis les abords.",
          "Écoutez sans chercher le contact. À cette période, les cerfs peuvent se montrer agressifs.",
          "N'emmenez pas de chien, même tenu en laisse.",
          "N'utilisez ni lampe torche, ni phares de voiture, ni flash : c'est interdit.",
          "Évitez les vêtements clairs ou bruyants et le parfum. Prévoyez des chaussures de marche et des vêtements chauds.",
        ],
      },
      "Sologne Nature Environnement ajoute quelques gestes : chuchoter, ne pas claquer les portières, marcher lentement face au vent, et laisser cigarettes et nourriture odorante dans la voiture. La chasse a ouvert le 27 septembre 2026 en Loir-et-Cher : une raison de plus pour ne pas quitter les chemins.",
      { h2: "Et avec des enfants, ou sans se lever à l'aube ?" },
      [
        "Les observatoires libres de Chambord n'ont pas d'âge minimum, mais une heure de silence dans le froid est longue pour un petit. Deux visites de jour complètent bien la sortie. Le musée de la Maison du Cerf, à Villeny, ouvre de 14 h à 18 h 30 le mercredi, le samedi et le dimanche jusqu'au 30 novembre, et du mardi au dimanche pendant les vacances scolaires. L'entrée coûte 6 € par adulte et 3 € de 6 à 16 ans. À Chambord, la visite de la forêt en véhicule tout terrain avec un guide dure 1 h 30 et coûte 20 € par adulte, 15 € de 3 à 17 ans. Elle n'est pas ouverte aux moins de 3 ans.",
      ],
      [
        "À vélo, la boucle « En forêt, sur la piste du cerf » fait 15 km au départ de La Marolle-en-Sologne, à 31 min du gîte, et passe par Villeny. Notre guide de la ",
        { text: "Sologne à vélo", href: "/guides/sologne-a-velo" },
        " la détaille, et celui des ",
        {
          text: "étangs et forêts de Sologne",
          href: "/guides/etangs-et-forets-de-sologne",
        },
        " indique les sentiers ouverts au public.",
      ],
      { h2: "Peut-on visiter le château le même jour ?" },
      [
        "Oui, et c'est le meilleur usage d'une journée d'automne. Le château ouvre de 9 h à 18 h jusqu'au 25 octobre 2026. Le billet coûte 21 € pour les résidents de l'Espace économique européen, sur justificatif, et 31 € pour les autres visiteurs. Il est gratuit pour les moins de 18 ans. Notre itinéraire des ",
        {
          text: "châteaux de la Loire en 3 jours",
          href: "/guides/chateaux-de-la-loire-depuis-romorantin",
        },
        " donne le détail de la visite. ",
        { text: "Le gîte", href: "/le-gite" },
        " est à 43 min : vous rentrez dormir à Romorantin, dans une maison de 115 m² pour 6 personnes.",
      ],
    ],
    faq: [
      {
        question:
          "Quelle est la meilleure période pour le brame du cerf en Sologne ?",
        answer:
          "De mi-septembre à mi-octobre. L'Office français de la biodiversité situe le rut du cerf élaphe entre début septembre et mi-octobre, et Chambord organise ses sorties de mi-septembre à mi-octobre. Venez à l'aube ou au crépuscule, quand la température baisse.",
      },
      {
        question: "Le brame du cerf à Chambord est-il gratuit ?",
        answer:
          "Oui en accès libre : 5 aires de vision et 5 miradors sont ouverts gratuitement dans la zone publique du domaine. Seul le stationnement est payant, 8 € par jour en 2026. Les sorties guidées en zone fermée coûtent 45 € à 60 € par personne, ou 250 € par groupe de 4.",
      },
      {
        question: "À quelle heure aller écouter le brame ?",
        answer:
          "Le soir, soyez en place vers 18 h et restez jusqu'à la nuit : le soleil se couche à 20 h 08 le 15 septembre et à 19 h 08 le 15 octobre à Chambord. Le matin, arrivez vers 6 h 30, avant le lever du jour.",
      },
      {
        question: "Peut-on emmener un chien pour écouter le brame ?",
        answer:
          "Non. L'Office national des forêts demande de ne pas emmener de chien, même tenu en laisse. Les chiens ne sont pas acceptés non plus lors des visites guidées de la forêt de Chambord.",
      },
      {
        question: "Quand réserver une sortie brame pour 2027 ?",
        answer:
          "Les dates 2027 ne sont pas publiées en octobre 2026. Pour la saison 2026, Chambord a ouvert ses réservations le 1er juin, uniquement par téléphone, et la Maison du Cerf le 1er avril. Surveillez leurs sites dès le printemps.",
      },
    ],
  },
  en: {
    title: "The deer rut in the Sologne: where, when and how to hear it",
    excerpt:
      "The red deer rut can be heard in the Sologne from mid-September to mid-October, at dawn and dusk. At Chambord, 43 minutes from Romorantin, 5 viewing areas and 5 hides are free and open to all. Guided outings sell out months ahead.",
    metaTitle: "Deer rut in the Sologne: dates, places, 2026 prices",
    metaDescription:
      "Deer rut in the Sologne, mid-September to mid-October: Chambord's free hides 43 minutes from Romorantin, guided outings from €17 in 2026.",
    practical: [
      {
        label: "When",
        value:
          "Mid-September to mid-October. In the evening from 6 pm, in the morning at about 6.30 am.",
      },
      {
        label: "Where",
        value:
          "The Chambord estate, 43 minutes (40 km, 25 miles) from L'Instant Tranquille cottage in Romorantin-Lanthenay: 5 viewing areas and 5 hides with free access.",
      },
      {
        label: "Budget",
        value:
          "Free on your own, apart from €8 a day to park at Chambord. Guided outings €17 to €60 per person, or €250 for a group of 4 (2026 prices).",
      },
      {
        label: "Book ahead",
        value:
          "Guided outings only. In 2026 Chambord opened bookings on 1 June and the Maison du Cerf on 1 April.",
      },
      {
        label: "Children",
        value:
          "No minimum age on your own. Guided outings from age 10, 12 or 15 depending on the organiser.",
      },
      {
        label: "Dogs",
        value:
          "Leave them at the house: the French forestry office asks visitors not to bring dogs, even on a lead.",
      },
    ],
    body: [
      "The red deer rut can be heard in the Sologne from mid-September to mid-October, at dawn and dusk. The French call it the brame: the roar of the stags as they call the hinds and challenge rivals. The easiest place to hear it is the Chambord estate, 43 minutes from L'Instant Tranquille cottage in Romorantin-Lanthenay, where 5 viewing areas and 5 hides are open to everyone, free of charge, with no booking. To get closer you need a guided outing, and those are booked several months ahead.",
      "This guide was checked on 6 October 2026, at the end of the season. Dates and prices are those of 2026. Nothing has been published for 2027 yet: the booking dates below tell you when to start watching the websites.",
      { h2: "When can you hear the deer rut in the Sologne?" },
      [
        "From early September to mid-October according to the ",
        {
          text: "French Biodiversity Agency",
          href: "https://ofb.gouv.fr/especes/cerf-elaphe-cervus-elaphus",
        },
        ". Chambord runs its outings from mid-September to mid-October. Stags roar mostly when the temperature drops, at first light and at nightfall. The local association Sologne Nature Environnement advises being in position from 6 pm in the evening, or at about 6.30 am.",
      ],
      "The evening is easier to organise: you arrive in daylight and leave in the dark. In the morning you arrive in the dark, because the sun rises late at this time of year.",
      {
        table: {
          head: ["Date", "Sunrise", "Sunset"],
          rows: [
            ["15 September", "7.29 am", "8.08 pm"],
            ["1 October", "7.51 am", "7.35 pm"],
            ["15 October", "8.11 am", "7.08 pm"],
          ],
        },
      },
      "These times are calculated for Chambord, in French summer time (one hour ahead of the UK). Nobody can promise a roar: the organisers themselves warn that sightings are never guaranteed.",
      { h2: "Where can you hear the rut for free, without a guide?" },
      [
        "At Chambord. The ",
        {
          text: "national estate",
          href: "https://www.chambord.org/fr/agenda/brame-du-cerf/",
        },
        " covers 5,440 hectares (about 13,400 acres), of which 1,000 hectares are open to the public. It puts its herd at 700 red deer. In the public area, 5 viewing areas for 50 people each and 5 raised hides for 4 to 6 people are free to use. Their locations are shown on the map of walks and observation points, which you can download from the estate's rut page (in French: “plan des promenades et observatoires”).",
      ],
      {
        list: [
          [
            { text: "Parking", bold: true },
            ", the estate car parks are open 24 hours a day. The charge is €8 a day for a car, paid by card at the machines. Car park P0 is 600 m from the château.",
          ],
          [
            { text: "The drive", bold: true },
            ", 43 minutes (40 km) from the cottage, with no toll. You drive back at night on forest roads: go slowly.",
          ],
          [
            { text: "Crowds", bold: true },
            ", the hides only take 4 to 6 people. Arrive early and choose a weekday evening.",
          ],
        ],
      },
      "Elsewhere in the Sologne, most of the forest is privately owned, and there is no general right to roam in France. No tourist office recommends a free listening spot outside Chambord. If you try your luck from a public lane, stay on it and park well away from the rutting grounds.",
      { h2: "Which guided outings are there, and what do they cost?" },
      "There were six options in 2026, from €17 per person to €250 for a group of 4. All need booking, and most are full well before September.",
      {
        table: {
          head: ["Outing", "2026 price", "Age", "Booking"],
          rows: [
            [
              "Chambord, “L'écoute du brame”: hide in the closed reserve, 16 people, about 2 hours",
              "€45 on weekdays, €60 at weekends",
              "12",
              "By phone, from 1 June",
            ],
            [
              "Chambord, “Au cœur du brame”: hide chosen by a guide, 4 people",
              "€250 per group",
              "12",
              "By phone, from 1 June",
            ],
            [
              "Maison du Cerf, Villeny: museum tour then forest outing, starts 5.30 pm",
              "Not published",
              "15",
              "From 1 April",
            ],
            [
              "Sologne Nature Environnement: outing of about 2 hr 30",
              "€17, free under 14",
              "Not stated",
              "Up to 24 hours before",
            ],
            [
              "Plume de Nature: 4 hours, 5 km, 8 people, meal or breakfast included",
              "€52",
              "10 advised",
              "Online",
            ],
            [
              "Domaine du Ciran, Ménestreau-en-Villette: deer kept in a park",
              "Sold out in 2026",
              "8",
              "By phone",
            ],
          ],
        },
      },
      [
        "At Chambord, outings leave between 6 am and 7 am, or between 6 pm and 7 pm. Booking is by phone only, on +33 2 54 50 40 00. The ",
        { text: "Maison du Cerf", href: "https://www.maisonducerf.fr/" },
        " is in Villeny, 36 minutes (33 km) from the cottage. ",
        {
          text: "Sologne Nature Environnement",
          href: "https://www.sologne-nature.org/",
        },
        " is based in Romorantin and gives the meeting point one week before the outing. ",
        {
          text: "Plume de Nature",
          href: "https://www.plumedenature.com/brame-du-cerf/",
        },
        " is an independent nature guide who works near Chambord. The Domaine du Ciran is in the Loiret, 62 minutes from the cottage.",
      ],
      { h2: "An evening at Chambord, hour by hour" },
      "This is how a self-guided evening runs in early October, when the sun sets at about 7.35 pm. In September, shift everything 30 minutes later.",
      {
        programme: [
          {
            time: "4.45 pm",
            title: "Leave the cottage",
            details:
              "A 43-minute drive (40 km). Bring binoculars and warm, dark clothes, and leave the dog at the house.",
          },
          {
            time: "5.30 pm",
            title: "Arrive at Chambord",
            details:
              "Parking is €8 a day, paid by card. Find your chosen viewing area or hide on the estate map before setting off on foot.",
          },
          {
            time: "6.00 pm",
            title: "In position, in silence",
            details:
              "Phone on silent, no perfume, no rustling fabrics. You often hear the first roars before you see an animal.",
          },
          {
            time: "7.35 pm",
            title: "Sunset",
            details:
              "The busiest moment. Stay until dark, with no torch and no flash: lighting up the deer is forbidden.",
          },
          {
            time: "8.15 pm",
            title: "Dinner or the drive back",
            details:
              "Le Grand Saint-Michel, at the Relais de Chambord hotel, serves dinner from 7 pm to 10 pm; booking is strongly advised. Otherwise you are back at the cottage by about 9 pm.",
          },
        ],
      },
      { h2: "What rules should you follow so as not to disturb the deer?" },
      [
        "It takes several hours for the rut to settle, and a single human presence is enough to break it up. The ",
        {
          text: "French National Forests Office",
          href: "https://www.onf.fr/vivre-la-foret/+/22ce::ecouter-le-brame-du-cerf-des-regles-de-prudence-simposent.html",
        },
        " (ONF) sets out these rules:",
      ],
      {
        list: [
          "Stay on authorised paths and away from the rutting grounds. There is no need to go deep into the forest: the calls carry to its edges.",
          "Listen without seeking contact. Stags can be aggressive at this time of year.",
          "Do not bring a dog, even on a lead.",
          "Do not use a torch, car headlights or a camera flash: it is forbidden.",
          "Avoid pale or noisy clothing and perfume. Wear walking shoes and warm clothes.",
        ],
      },
      "Sologne Nature Environnement adds a few habits: whisper, do not slam car doors, walk slowly into the wind, and leave cigarettes and strong-smelling food in the car. The shooting season opened on 27 September 2026 in the Loir-et-Cher, one more reason to keep to the paths.",
      { h2: "What about children, or avoiding a dawn start?" },
      [
        "Chambord's free hides have no minimum age, but an hour of silence in the cold is long for a small child. Two daytime visits round the trip out well. The Maison du Cerf museum in Villeny opens from 2 pm to 6.30 pm on Wednesdays, Saturdays and Sundays until 30 November, and Tuesday to Sunday in the French school holidays. Admission is €6 per adult and €3 for ages 6 to 16. At Chambord, the guided forest tour by off-road vehicle lasts 1 hr 30 and costs €20 per adult, €15 for ages 3 to 17. Children under 3 are not allowed.",
      ],
      [
        "By bike, the “En forêt, sur la piste du cerf” loop is 15 km from La Marolle-en-Sologne, 31 minutes from the cottage, and passes through Villeny. Our guide to ",
        {
          text: "cycling in the Sologne",
          href: "/en/guides/sologne-a-velo",
        },
        " describes it, and the one on the ",
        {
          text: "ponds and forests of the Sologne",
          href: "/en/guides/etangs-et-forets-de-sologne",
        },
        " lists the trails open to the public.",
      ],
      { h2: "Can you visit the château on the same day?" },
      [
        "Yes, and it is the best use of an autumn day. The château opens from 9 am to 6 pm until 25 October 2026. Since January 2026 the ticket costs €31, or €21 for citizens and residents of the European Economic Area with proof. Visitors from the UK, the USA and other non-EEA countries pay €31. Under-18s go free. Our ",
        {
          text: "Loire châteaux in 3 days",
          href: "/en/guides/chateaux-de-la-loire-depuis-romorantin",
        },
        " itinerary covers the visit in detail. ",
        { text: "The cottage", href: "/en/the-cottage" },
        " is 43 minutes away: you drive back to sleep in Romorantin, in a house of 115 m² for 6 guests.",
      ],
    ],
    faq: [
      {
        question: "When is the best time for the deer rut in the Sologne?",
        answer:
          "Mid-September to mid-October. The French Biodiversity Agency places the red deer rut between early September and mid-October, and Chambord runs its outings from mid-September to mid-October. Come at dawn or dusk, when the temperature drops.",
      },
      {
        question: "Is the deer rut at Chambord free?",
        answer:
          "Yes if you go on your own: 5 viewing areas and 5 hides are free in the public part of the estate. Only parking is charged, €8 a day in 2026. Guided outings in the closed reserve cost €45 to €60 per person, or €250 for a group of 4.",
      },
      {
        question: "What time should you go to hear the rut?",
        answer:
          "In the evening, be in position by about 6 pm and stay until dark: at Chambord the sun sets at 8.08 pm on 15 September and 7.08 pm on 15 October. In the morning, arrive at about 6.30 am, before daybreak.",
      },
      {
        question: "Can you bring a dog to hear the rut?",
        answer:
          "No. The French National Forests Office asks visitors not to bring dogs, even on a lead. Dogs are not accepted on Chambord's guided forest tours either.",
      },
      {
        question: "When should you book a rut outing for 2027?",
        answer:
          "The 2027 dates had not been published in October 2026. For the 2026 season, Chambord opened bookings on 1 June, by phone only, and the Maison du Cerf on 1 April. Watch their websites from spring onwards.",
      },
    ],
  },
};
