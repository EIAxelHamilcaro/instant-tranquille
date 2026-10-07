export interface PlacePhoto {
  file: string;
  altFr: string;
  altEn: string;
  author: string;
  license: string;
  sourceUrl: string;
  focalX?: number;
  focalY?: number;
}

export const PLACE_PHOTOS: Record<string, PlacePhoto> = {
  "chateau-du-moulin": {
    file: "chateau-du-moulin.webp",
    altFr:
      "Le château du Moulin à Lassay-sur-Croisne, tours de brique rouge et toits d'ardoise sous un ciel bleu",
    altEn:
      "The Château du Moulin in Lassay-sur-Croisne, red brick towers and slate roofs under a blue sky",
    author: "Dinkum",
    license: "CC0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_du_Moulin_vue_d%27ensemble.JPG",
    focalX: 55,
    focalY: 10,
  },
  "selles-sur-cher": {
    file: "selles-sur-cher.webp",
    altFr:
      "Pavillon Renaissance de brique et pierre du château de Selles-sur-Cher, encadré par les branches d'un cèdre",
    altEn:
      "Brick and stone Renaissance pavilion of the Château de Selles-sur-Cher, framed by cedar branches",
    author: "Krzysztof Golik",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Castle_of_Selles-sur-Cher_14.jpg",
    focalX: 40,
    focalY: 40,
  },
  cheverny: {
    file: "cheverny.webp",
    altFr:
      "Façade classique blanche du château de Cheverny face à l'allée de gravier sous un ciel bleu",
    altEn:
      "White classical façade of the Château de Cheverny facing the gravel avenue under a blue sky",
    author: "Jean-Christophe Benoist",
    license: "CC BY 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cheverny-Chateau-VueFrontale.jpg",
    focalX: 50,
    focalY: 5,
  },
  villesavin: {
    file: "villesavin.webp",
    altFr:
      "Façade Renaissance du château de Villesavin, toits d'ardoise et lucarnes sculptées sous un ciel bleu",
    altEn:
      "Renaissance façade of the Château de Villesavin, slate roofs and carved dormers under a blue sky",
    author: "Manfred Heyde",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Villesavin02.jpg",
    focalX: 50,
    focalY: 15,
  },
  valencay: {
    file: "valencay.webp",
    altFr:
      "Château de Valençay, son donjon et sa tour à dôme, vus depuis les topiaires du jardin à la française",
    altEn:
      "Château de Valençay, its keep and domed tower, seen from the topiary of the formal garden",
    author: "Fab5669",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Valen%C3%A7ay_-_ch%C3%A2teau_81.jpg",
    focalX: 50,
    focalY: 25,
  },
  "fougeres-sur-bievre": {
    file: "fougeres-sur-bievre.webp",
    altFr:
      "Château fort de Fougères-sur-Bièvre, son donjon carré et ses tours à poivrières sous un ciel bleu",
    altEn:
      "The fortified Château de Fougères-sur-Bièvre, its square keep and pepper-pot towers under a blue sky",
    author: "Krzysztof Golik",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Castle_of_Fougeres-sur-Bievre_10.jpg",
    focalX: 45,
    focalY: 10,
  },
  chambord: {
    file: "chambord.webp",
    altFr:
      "Château de Chambord doré par le soleil, reflété dans l'eau calme du Cosson",
    altEn:
      "Château de Chambord in golden sunlight, mirrored in the still water of the Cosson",
    author: "Henneveux Marc",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_de_Chambord_et_plan_d%27eau.JPG",
    focalX: 60,
    focalY: 20,
  },
  blois: {
    file: "blois.webp",
    altFr:
      "Blois au crépuscule : le pont Jacques-Gabriel, l'église Saint-Nicolas et le château royal reflétés dans la Loire",
    altEn:
      "Blois at dusk: the Jacques-Gabriel bridge, Saint-Nicolas church and the royal château mirrored in the Loire",
    author: "Krzysztof Golik",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bridge_of_Jacques-Gabriel_in_Blois_01.jpg",
    focalX: 55,
    focalY: 45,
  },
  chenonceau: {
    file: "chenonceau.webp",
    altFr:
      "Château de Chenonceau et tour des Marques reflétés dans le Cher, à la lumière du matin",
    altEn:
      "Château de Chenonceau and the Marques tower mirrored in the river Cher in morning light",
    author: "Antoine Montulé",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_de_Chenonceau_-_Fa%C3%A7ade_Ouest_et_Tour_des_Marques_reflets.jpg",
    focalX: 55,
    focalY: 45,
  },
  "ferte-saint-aubin": {
    file: "ferte-saint-aubin.webp",
    altFr:
      "Allée de gravier menant au château de la Ferté-Saint-Aubin entre deux grands cèdres",
    altEn:
      "Gravel path leading to the Château de la Ferté-Saint-Aubin between two large cedars",
    author: "Croquant",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:La_Fert%C3%A9-Saint-Aubin_ch%C3%A2teau_1.jpg",
    focalX: 50,
    focalY: 60,
  },
  "chaumont-sur-loire": {
    file: "chaumont-sur-loire.webp",
    altFr:
      "Tours rondes à toits coniques du château de Chaumont-sur-Loire, au soleil sous un ciel bleu",
    altEn:
      "Round towers with conical roofs of the Château de Chaumont-sur-Loire, sunlit under a blue sky",
    author: "W. Bulach",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:00_2417_Ch%C3%A2teau_de_Chaumont-sur-Loire.jpg",
    focalX: 45,
    focalY: 2,
  },
  beauval: {
    file: "beauval.webp",
    altFr:
      "Panda géant endormi sur une branche dans son enclos du ZooParc de Beauval",
    altEn:
      "Giant panda sleeping on a branch in its enclosure at the ZooParc de Beauval",
    author: "Thesupermat",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Zooparc_de_Beauval_-_Panda_-_2016_-_012.jpg",
    focalX: 40,
    focalY: 35,
  },
  "center-parcs": {
    file: "center-parcs.webp",
    altFr:
      "Aire de jeux et bâtiment du domaine des Hauts de Bruyères parmi les pins",
    altEn:
      "Playground and building of the Hauts de Bruyères estate among the pine trees",
    author: "Poudou99",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Les-Hauts-de-Bruy%C3%A8res_-_2017-11-15_-_IMG_1537.jpg",
    focalX: 60,
    focalY: 45,
  },
  "parc-equestre-federal": {
    file: "parc-equestre-federal.webp",
    altFr:
      "Piste de saut d'obstacles et tribune en bois du parc équestre fédéral de Lamotte-Beuvron",
    altEn:
      "Show jumping arena and wooden stand at the Federal Equestrian Park in Lamotte-Beuvron",
    author: "Wouter Hagens",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Parc_%C3%A9questre_f%C3%A9d%C3%A9ral_in_Lamotte-Beuvron_A1538.jpg",
    focalX: 45,
    focalY: 30,
  },
  "chambord-spectacle-equestre": {
    file: "chambord-spectacle-equestre.webp",
    altFr:
      "Cavalière en robe rouge brodée sur un cheval noir pendant le spectacle équestre de Chambord",
    altEn:
      "Rider in an embroidered red dress on a black horse during the equestrian show at Chambord",
    author: "Pierre André Leclercq",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Chambord_Show_aux_%C3%A9curies_du_Mar%C3%A9chal_de_Saxe_(12).jpg",
    focalX: 45,
    focalY: 20,
  },
  "musee-de-sologne": {
    file: "musee-de-sologne.webp",
    altFr:
      "Moulins et maisons de Romorantin-Lanthenay au bord de la Sauldre, dorés par le soleil couchant",
    altEn:
      "Mills and houses of Romorantin-Lanthenay on the Sauldre, golden in the setting sun",
    author: "Angelo Brathot from Sologne-France",
    license: "CC0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Les_%C3%A9cluses_de_la_Sauldre_(49492327793).jpg",
    focalX: 50,
    focalY: 50,
  },
  "musee-matra": {
    file: "musee-matra.webp",
    altFr:
      "Monoplace bleue Matra MS80 de Formule 1 exposée à l'Espace Automobiles Matra de Romorantin-Lanthenay",
    altEn:
      "Blue Matra MS80 Formula 1 car on display at the Espace Automobiles Matra in Romorantin-Lanthenay",
    author: "FSTH000",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Matra_MS80_1969_Jackie_Stewart_Mus%C3%A9e_Matra_2025.jpg",
    focalX: 50,
    focalY: 30,
  },
  "office-de-tourisme": {
    file: "office-de-tourisme.webp",
    altFr:
      "Clocher et façades de Romorantin-Lanthenay au bord de la Sauldre, fleurie en été",
    altEn:
      "Church spire and façades of Romorantin-Lanthenay on the Sauldre, in bloom in summer",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Romorantin-Lanthenay_(Loir-et-Cher)_(32495542688).jpg",
    focalX: 65,
    focalY: 10,
  },
  "veloroute-v46": {
    file: "veloroute-v46.webp",
    altFr:
      "Voie verte longeant le canal de Berry à Mennetou-sur-Cher, nuages reflétés dans l'eau",
    altEn:
      "Greenway along the Berry canal at Mennetou-sur-Cher, clouds mirrored in the water",
    author: "VVVCFFrance",
    license: "CC0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Voie_verte_du_canal_de_Berry_%C3%A0_Mennetou_vers_Langon.jpg",
    focalX: 50,
    focalY: 45,
  },
  "maison-des-etangs": {
    file: "maison-des-etangs.webp",
    altFr:
      "Étang de Sologne au lever du jour, arbres dorés et brume légère reflétés dans l'eau",
    altEn:
      "Sologne pond at daybreak, golden trees and light mist mirrored in the water",
    author: "Angelo Brathot from Sologne-France",
    license: "Public domain",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Pond_of_Sologne_(29758027838).jpg",
    focalX: 55,
    focalY: 45,
  },
  "boucle-velo-cerf": {
    file: "boucle-velo-cerf.webp",
    altFr:
      "Petite route forestière de Sologne en fin d'automne, entre bouleaux et tapis de feuilles",
    altEn:
      "Small forest road in the Sologne in late autumn, between birches and a carpet of leaves",
    author: "Angelo Brathot from Sologne-France",
    license: "Public domain",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Route_de_for%C3%AAt_en_hiver_(45922523435).jpg",
    focalX: 50,
    focalY: 50,
  },
  "maison-du-cerf": {
    file: "maison-du-cerf.webp",
    altFr:
      "Cerf en plein brame dans les fougères rousses, bois dressés, en sous-bois d'automne",
    altEn:
      "Red deer stag bellowing among russet ferns, antlers raised, in autumn woodland",
    author: "Julian Herzog",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Red_Deer_Bellowing_Cervus_Elaphus_Richmond_Park_2025_01.jpg",
    focalX: 60,
    focalY: 55,
  },
  "brame-chambord": {
    file: "brame-chambord.webp",
    altFr:
      "Cerf en plein brame dans les herbes dorées au bord de l'eau, à la lumière du soir",
    altEn:
      "Red deer stag roaring in golden grass beside the water in the evening light",
    author: "Stagiairemarketingsaintecroix",
    license: "CC0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Brame_du_cerf.jpg",
    focalX: 40,
    focalY: 35,
  },
  "pole-des-etoiles": {
    file: "pole-des-etoiles.webp",
    altFr:
      "Grand radiotélescope de Nançay, son immense miroir à treillis dressé sur le ciel bleu de Sologne",
    altEn:
      "The Nançay large radio telescope, its huge lattice mirror rising against the blue Sologne sky",
    author: "Wouter Hagens",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Nan%C3%A7ay_Observatory_B.jpg",
    focalX: 60,
    focalY: 2,
  },
  "mennetou-sur-cher": {
    file: "mennetou-sur-cher.webp",
    altFr:
      "Clocher et maisons de Mennetou-sur-Cher derrière le canal bordé de nénuphars",
    altEn:
      "Church spire and houses of Mennetou-sur-Cher behind the canal dotted with water lilies",
    author: "Pymouss",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mennetou-sur-Cher_-_canal_20220530-02.jpg",
    focalX: 55,
    focalY: 45,
  },
  "souvigny-en-sologne": {
    file: "souvigny-en-sologne.webp",
    altFr:
      "Maison à colombages de Souvigny-en-Sologne, jardinières fleuries et massifs en été",
    altEn:
      "Half-timbered house in Souvigny-en-Sologne with flower boxes and summer borders",
    author: "Wouter Hagens",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Souvigny-en-Sologne_B.jpg",
    focalX: 50,
    focalY: 25,
  },
  gare: {
    file: "gare.webp",
    altFr:
      "Bâtiment voyageurs de la gare de Romorantin-Lanthenay et son rond-point",
    altEn:
      "Passenger building of Romorantin-Lanthenay station and its roundabout",
    author: "Croquant",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Romorantin_gare_Blanc-Argent_1.jpg",
    focalX: 50,
    focalY: 50,
  },
  "clos-luce": {
    file: "clos-luce.webp",
    altFr:
      "Façade de brique rose et de tuffeau du château du Clos Lucé à Amboise, côté parc",
    altEn:
      "Pink brick and tufa façade of the Château du Clos Lucé in Amboise, seen from the park",
    author: "Nadège Villain",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Clos_luce_04.jpg",
    focalX: 50,
    focalY: 30,
  },
  "chateau-amboise": {
    file: "chateau-amboise.webp",
    altFr:
      "Château royal d'Amboise dominant la ville, reflété dans la Loire sous un ciel bleu",
    altEn:
      "Royal Château of Amboise above the town, mirrored in the Loire under a blue sky",
    author: "W. Bulach",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:00_1297_Ch%C3%A2teau_d%27Amboise.jpg",
    focalX: 50,
    focalY: 20,
  },
  montpoupon: {
    file: "montpoupon.webp",
    altFr:
      "Tours du château de Montpoupon au-dessus de la vallée, sous un ciel de soleil couchant",
    altEn:
      "Towers of the Château de Montpoupon above the valley under a sunset sky",
    author: "Krzysztof Golik",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Castle_of_Montpoupon_21.jpg",
    focalX: 60,
    focalY: 45,
  },
  "chateau-montresor": {
    file: "chateau-montresor.webp",
    altFr:
      "Château de Montrésor et ses tours au-dessus des arbres d'automne, au bord de l'Indrois",
    altEn:
      "Château de Montrésor and its towers above autumn trees beside the Indrois",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Montr%C3%A9sor_(Indre-et-Loire)_-_Flickr_-_sybarite48.jpg",
    focalX: 50,
    focalY: 20,
  },
  loches: {
    file: "loches.webp",
    altFr:
      "Logis royal de Loches dominant les toits de la vieille ville, vu depuis le jardin public",
    altEn:
      "Royal lodge of Loches above the rooftops of the old town, seen from the public garden",
    author: "Krzysztof Golik",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Royal_appartments_in_Loches_03.jpg",
    focalX: 50,
    focalY: 30,
  },
  beauregard: {
    file: "beauregard.webp",
    altFr:
      "Façade sud du château de Beauregard à Cellettes, au bout de la pelouse sous un ciel bleu",
    altEn:
      "South façade of the Château de Beauregard in Cellettes, across the lawn under a blue sky",
    author: "Rolf Kranz",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Fa%C3%A7ade_sud_du_ch%C3%A2teau_de_Beauregard_%C3%A0_Cellettes.jpg",
    focalX: 50,
    focalY: 40,
  },
  troussay: {
    file: "troussay.webp",
    altFr:
      "Façade Renaissance du château de Troussay à Cheverny, encadrée par ses deux tourelles",
    altEn:
      "Renaissance façade of the Château de Troussay in Cheverny, framed by its two turrets",
    author: "N.duske",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:ND_Troussay.JPG",
    focalX: 50,
    focalY: 25,
  },
  talcy: {
    file: "talcy.webp",
    altFr:
      "Cour du château de Talcy, donjon-porche, tourelle et galerie à arcades",
    altEn:
      "Courtyard of the Château de Talcy with its gate keep, turret and arcaded gallery",
    author: "Manfred Heyde",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Talcy_Castle_Loire_ValleyB.jpg",
    focalX: 55,
    focalY: 5,
  },
  "meung-sur-loire": {
    file: "meung-sur-loire.webp",
    altFr:
      "Façade rose du château de Meung-sur-Loire et ses tours rondes, face à la pelouse",
    altEn:
      "Pink façade of the Château de Meung-sur-Loire with its round towers, facing the lawn",
    author: "Calips",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:France_Centre_Loiret_Meung-sur-Loire_chateau_03.JPG",
    focalX: 50,
    focalY: 30,
  },
  "maison-de-la-magie": {
    file: "maison-de-la-magie.webp",
    altFr:
      "Façade de brique et pierre de la Maison de la Magie à Blois, sous un ciel bleu",
    altEn:
      "Brick and stone façade of the Maison de la Magie in Blois under a blue sky",
    author: "Ymblanter",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Blois_Maison_de_la_Magie_seen_from_the_southwest.jpg",
    focalX: 50,
    focalY: 15,
  },
  "aquarium-de-touraine": {
    file: "aquarium-de-touraine.webp",
    altFr:
      "Perche-soleil aux écailles orange et turquoise dans un bassin de l'aquarium de Touraine",
    altEn:
      "Pumpkinseed sunfish with orange and turquoise scales in a tank at the Aquarium de Touraine",
    author: "Bernard Dupont",
    license: "CC BY-SA 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Pumpkinseed_(Lepomis_gibbosus)_(13533753654).jpg",
    focalX: 50,
    focalY: 50,
  },
  "domaine-du-ciran": {
    file: "domaine-du-ciran.webp",
    altFr:
      "Château de brique du domaine du Ciran à Ménestreau-en-Villette, sous les arbres",
    altEn:
      "Brick château of the Domaine du Ciran in Ménestreau-en-Villette, under the trees",
    author: "Danny van Leeuwen",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:45240_M%C3%A9nestreau-en-Villette,_France_-_panoramio.jpg",
    focalX: 55,
    focalY: 30,
  },
  "marais-de-bourges": {
    file: "marais-de-bourges.webp",
    altFr:
      "Jardin sur une île entourée d'eau dans les marais de Bourges, en été",
    altEn:
      "Garden on an island surrounded by water in the Bourges marshes in summer",
    author: "Berthgmn",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Maraisdebourges1.jpg",
    focalX: 50,
    focalY: 50,
  },
  "saint-aignan": {
    file: "saint-aignan.webp",
    altFr:
      "Saint-Aignan au bord du Cher : le pont, la collégiale et le château au-dessus des toits",
    altEn:
      "Saint-Aignan on the Cher: the bridge, the collegiate church and the château above the rooftops",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Pont_routier_sur_le_Cher_Saint-Aignan.jpg",
    focalX: 50,
    focalY: 35,
  },
  montrichard: {
    file: "montrichard.webp",
    altFr:
      "Montrichard vu depuis le Cher, le donjon médiéval et l'église au-dessus des maisons",
    altEn:
      "Montrichard seen from the Cher, the medieval keep and the church above the houses",
    author: "Krzysztof Golik",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:View_of_Montrichard_01.jpg",
    focalX: 55,
    focalY: 30,
  },
  bracieux: {
    file: "bracieux.webp",
    altFr:
      "Vieille halle en bois de Bracieux et son clocheton d'ardoise sous un ciel bleu",
    altEn:
      "Old timber market hall of Bracieux and its slate bell turret under a blue sky",
    author: "F Ceragioli",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bracieux_halle.jpg",
    focalX: 45,
    focalY: 5,
  },
  "chaumont-sur-tharonne": {
    file: "chaumont-sur-tharonne.webp",
    altFr:
      "Église et place fleurie de Chaumont-sur-Tharonne, entourées de maisons de brique",
    altEn:
      "Church and flowered square of Chaumont-sur-Tharonne, ringed by brick houses",
    author: "Poudou99",
    license: "CC BY 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Chaumont-sur-Tharonne-Eglise_eIMG_9978.jpg",
    focalX: 35,
    focalY: 15,
  },
  "lamotte-beuvron": {
    file: "lamotte-beuvron.webp",
    altFr:
      "Bassin du canal de la Sauldre à Lamotte-Beuvron, jets d'eau et massifs fleuris",
    altEn:
      "Basin of the Sauldre canal in Lamotte-Beuvron with fountains and flower beds",
    author: "Mairie Lamotte-Beuvron",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bassin_du_canal_2.jpg",
    focalX: 55,
    focalY: 50,
  },
  vierzon: {
    file: "vierzon.webp",
    altFr:
      "Pont et façades du centre de Vierzon reflétés dans l'eau, depuis le quai du Bassin",
    altEn:
      "Bridge and town centre façades of Vierzon mirrored in the water, from the Quai du Bassin",
    author: "Yzergues",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vierzon_-_vue_g%C3%A9n%C3%A9rale_sur_le_centre_depuis_le_quai_du_Bassin.jpg",
    focalX: 50,
    focalY: 50,
  },
  bourges: {
    file: "bourges.webp",
    altFr:
      "Cathédrale Saint-Étienne de Bourges illuminée à l'heure bleue, chevet et arcs-boutants",
    altEn:
      "Saint-Étienne Cathedral in Bourges lit up at blue hour, chevet and flying buttresses",
    author: "Wladyslaw Sojka",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Kathedrale_Bourges_v2.jpg",
    focalX: 50,
    focalY: 35,
  },
  beaugency: {
    file: "beaugency.webp",
    altFr:
      "Vieux pont de pierre de Beaugency et ses arches reflétés dans la Loire",
    altEn: "Old stone bridge of Beaugency and its arches mirrored in the Loire",
    author: "W. Bulach",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:00_2395_Beaugency_-_Br%C3%BCcke.jpg",
    focalX: 50,
    focalY: 45,
  },
  "aubigny-sur-nere": {
    file: "aubigny-sur-nere.webp",
    altFr:
      "Maisons à pans de bois et rue commerçante fleurie d'Aubigny-sur-Nère",
    altEn:
      "Half-timbered houses and flower-decked shopping street in Aubigny-sur-Nère",
    author: "Gerd Eichmann",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Aubigny-sur-N%C3%A8re-115-Haus_Franz_I-2008-gje.jpg",
    focalX: 45,
    focalY: 30,
  },
  orleans: {
    file: "orleans.webp",
    altFr:
      "Rue Jeanne-d'Arc et cathédrale Sainte-Croix d'Orléans illuminées de nuit",
    altEn:
      "Rue Jeanne-d'Arc and Sainte-Croix Cathedral in Orléans lit up at night",
    author: "Patrick",
    license: "CC BY-SA 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Orl%C3%A9ans_(Loiret)_-_Rue_Jeanne_d%27Arc_et_cath%C3%A9drale_Sainte-Croix_-_49412681258.jpg",
    focalX: 50,
    focalY: 20,
  },
  "troglo-degusto": {
    file: "troglo-degusto.webp",
    altFr: "Maisons troglodytiques creusées dans le coteau de tuffeau à Bourré",
    altEn: "Troglodyte houses carved into the tufa hillside at Bourré",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bourr%C3%A9_(Loir-et-Cher)_(51134183059).jpg",
    focalX: 50,
    focalY: 45,
  },
  "cave-des-roches": {
    file: "cave-des-roches.webp",
    altFr:
      "Village de Bourré et son coteau de tuffeau percé de caves, vus depuis le barrage du Cher",
    altEn:
      "Village of Bourré and its tufa hillside dotted with cellars, seen from the weir on the Cher",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bourr%C3%A9_(Loir-et-Cher)_(51134179654).jpg",
    focalX: 50,
    focalY: 40,
  },
  "milliere-raboton": {
    file: "milliere-raboton.webp",
    altFr:
      "Toues et bateaux traditionnels amarrés sur la Loire à Chaumont-sur-Loire, en automne",
    altEn:
      "Toues and traditional boats moored on the Loire at Chaumont-sur-Loire in autumn",
    author: "pom'.",
    license: "CC BY-SA 2.0",
    sourceUrl: "https://www.flickr.com/photos/146832554@N06/50640588392",
    focalX: 55,
    focalY: 55,
  },
  "observatoire-loire": {
    file: "observatoire-loire.webp",
    altFr:
      "La Loire et le pont Jacques-Gabriel à Blois, vus depuis la rive sous un ciel bleu",
    altEn:
      "The Loire and the Jacques-Gabriel bridge in Blois, seen from the bank under a blue sky",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Blois,_pont_Gabriel_sur_la_Loire.jpg",
    focalX: 50,
    focalY: 30,
  },
  "marins-du-port-de-chambord": {
    file: "marins-du-port-de-chambord.webp",
    altFr:
      "Coucher de soleil orange sur la Loire à Saint-Dyé-sur-Loire, depuis la levée",
    altEn:
      "Orange sunset over the Loire at Saint-Dyé-sur-Loire, from the embankment",
    author: "Angelo Brathot from Sologne-France",
    license: "CC0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Coucher_de_soleil_-_Saint_Dy%C3%A9_sur_Loire_(50701722027).jpg",
    focalX: 50,
    focalY: 50,
  },
  "la-rabouilleuse": {
    file: "la-rabouilleuse.webp",
    altFr:
      "Toues de Loire sous voile carrée pendant une régate de bateaux traditionnels à Rochecorbon",
    altEn:
      "Loire toues under square sail during a traditional boat regatta at Rochecorbon",
    author: "La Petite Bècheuse",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:R%C3%A9gate_de_bateau_traditionnels_sur_la_Loire.jpg",
    focalX: 72,
    focalY: 55,
  },
  "passeurs-de-loire": {
    file: "passeurs-de-loire.webp",
    altFr:
      "Bateau traditionnel de Loire sous voile blanche à Orléans, pendant le Festival de Loire",
    altEn:
      "Traditional Loire boat under white sail in Orléans during the Festival de Loire",
    author: "Fab5669",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Orl%C3%A9ans_-_festival_de_Loire_2019_(19).jpg",
    focalX: 40,
    focalY: 25,
  },
  "la-belandre": {
    file: "la-belandre.webp",
    altFr:
      "Bateau de promenade sur le Cher au pied de la galerie du château de Chenonceau",
    altEn:
      "Excursion boat on the Cher at the foot of the gallery of the Château de Chenonceau",
    author: "Fab5669",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_de_Chenonceau_-_galerie_(09).jpg",
    focalX: 70,
    focalY: 60,
  },
  "canoe-company": {
    file: "canoe-company.webp",
    altFr:
      "Arches de la galerie du château de Chenonceau au-dessus du Cher, vues depuis la rive",
    altEn:
      "Arches of the Château de Chenonceau gallery above the Cher, seen from the bank",
    author: "Ra-smit",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Chateau_de_Chenonceau_2008.jpg",
    focalX: 50,
    focalY: 50,
  },
  "loire-kayak": {
    file: "loire-kayak.webp",
    altFr:
      "La Loire vue depuis un kayak, îles boisées et pont à l'horizon sous un ciel bleu",
    altEn:
      "The Loire seen from a kayak, wooded islands and a bridge on the horizon under a blue sky",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Kayak_sur_la_Loire,_de_Chaumont_%C3%A0_Saumur._(8560915721).jpg",
    focalX: 50,
    focalY: 55,
  },
  "cave-de-vouvray": {
    file: "cave-de-vouvray.webp",
    altFr:
      "Rangs de vigne de l'appellation Vouvray et arbre isolé sous un ciel de nuages",
    altEn:
      "Vine rows of the Vouvray appellation and a lone tree under a cloudy sky",
    author: "jamesonf",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vouvray_Rang%C3%A9es_de_vignes.jpg",
    focalX: 50,
    focalY: 55,
  },
  "menetou-salon": {
    file: "menetou-salon.webp",
    altFr: "Château de Menetou-Salon au bout d'une prairie, sous un ciel bleu",
    altEn: "Château de Menetou-Salon across a meadow under a blue sky",
    author: "Authueil",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_de_Menetou-Salon.jpg",
    focalX: 50,
    focalY: 45,
  },
  villandry: {
    file: "villandry.webp",
    altFr:
      "Château de Villandry et son donjon au-dessus des buis taillés du jardin d'ornement",
    altEn:
      "Château de Villandry and its keep above the clipped box of the ornamental garden",
    author: "Frédérique Voisin-Demery",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_de_Villandry_-_Le_jardin_d%27ornement_(4604397388).jpg",
    focalX: 45,
    focalY: 20,
  },
  "azay-le-rideau": {
    file: "azay-le-rideau.webp",
    altFr:
      "Château d'Azay-le-Rideau reflété dans son miroir d'eau, sous un ciel bleu",
    altEn: "Château d'Azay-le-Rideau mirrored in its water, under a blue sky",
    author: "Rolf Kranz",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Schloss_Azay-le-Rideau,_Parkseite.jpg",
    focalX: 50,
    focalY: 20,
  },
  "sully-sur-loire": {
    file: "sully-sur-loire.webp",
    altFr:
      "Château de Sully-sur-Loire, ses tours rondes et ses douves en eau sous un ciel bleu",
    altEn:
      "Château de Sully-sur-Loire, its round towers and water-filled moat under a blue sky",
    author: "Pline",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Chateau_de_Sully_sur_Loire_DSC_0188.JPG",
    focalX: 50,
    focalY: 15,
  },
  bouges: {
    file: "bouges.webp",
    altFr:
      "Façade classique en pierre blanche du château de Bouges, balcon en fer forgé",
    altEn:
      "White stone classical façade of the Château de Bouges with its wrought-iron balcony",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bouges-le-Ch%C3%A2teau_(Indre)._(9150338847).jpg",
    focalX: 60,
    focalY: 40,
  },
  "chateau-de-gien": {
    file: "chateau-de-gien.webp",
    altFr:
      "Château de Gien au-dessus des quais et du vieux pont, reflétés dans la Loire",
    altEn:
      "Château de Gien above the quays and the old bridge, mirrored in the Loire",
    author: "Gerd Eichmann",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_de_Gien-112-Loire-2008-gje.jpg",
    focalX: 60,
    focalY: 15,
  },
  "pagode-de-chanteloup": {
    file: "pagode-de-chanteloup.webp",
    altFr:
      "Pagode de Chanteloup à Amboise dressée au bord de sa pièce d'eau, sous un ciel de nuages",
    altEn:
      "The Chanteloup pagoda in Amboise rising beside its pond under a cloudy sky",
    author: "Manfred Heyde",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:ChanteloupPagode.jpg",
    focalX: 50,
    focalY: 20,
  },
  "mini-chateaux": {
    file: "mini-chateaux.webp",
    altFr:
      "Maquette du château d'Azay-le-Rideau entourée d'eau au parc Mini-Châteaux d'Amboise",
    altEn:
      "Scale model of the Château d'Azay-le-Rideau surrounded by water at the Mini-Châteaux park in Amboise",
    author: "René Cortin",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mini-Ch%C3%A2teaux_-_Ch%C3%A2teau_d%27Azay_Le_Rideau_2.jpg",
    focalX: 50,
    focalY: 40,
  },
  "parc-floral-de-la-source": {
    file: "parc-floral-de-la-source.webp",
    altFr:
      "Jet d'eau et grand cèdre au bord du bassin du Parc floral de la Source à Orléans",
    altEn:
      "Fountain and tall cedar beside the pond of the Parc floral de la Source in Orléans",
    author: "Gentil Hibou",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Parc_floral_de_La_Source_Fontaine.jpg",
    focalX: 45,
    focalY: 40,
  },
  tours: {
    file: "tours.webp",
    altFr:
      "Maisons à pans de bois et terrasses de la place Plumereau à Tours, sous un ciel bleu",
    altEn:
      "Half-timbered houses and café terraces on Place Plumereau in Tours under a blue sky",
    author: "Gerard Jalaudin",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Place_Plum_Tours_4598.jpg",
    focalX: 40,
    focalY: 15,
  },
  vendome: {
    file: "vendome.webp",
    altFr:
      "Porte Saint-Georges de Vendôme, ses mâchicoulis et ses toits d'ardoise sous un ciel bleu",
    altEn:
      "Porte Saint-Georges in Vendôme with its machicolations and slate roofs under a blue sky",
    author: "Benjamin Smith",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vend%C3%B4me_-_Porte_Saint-Georges_-_2.jpg",
    focalX: 50,
    focalY: 10,
  },
  chedigny: {
    file: "chedigny.webp",
    altFr:
      "Rosier grimpant en fleurs sur une maison de tuffeau dans une rue de Chédigny",
    altEn: "Climbing rose in bloom on a tufa house in a street of Chédigny",
    author: "GO69",
    license: "CC BY 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ch%C3%A9digny_(37)_Village_jardin_-_03.jpg",
    focalX: 60,
    focalY: 45,
  },
  "saint-benoit-sur-loire": {
    file: "saint-benoit-sur-loire.webp",
    altFr:
      "Arcades romanes de la tour-porche de l'abbatiale de Saint-Benoît-sur-Loire",
    altEn:
      "Romanesque arcades of the porch tower of the abbey church of Saint-Benoît-sur-Loire",
    author: "Fab5669",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Saint-Beno%C3%AEt-sur-Loire_-_%C3%A9glise_abbatiale,_ext%C3%A9rieur_(02).jpg",
    focalX: 50,
    focalY: 50,
  },
  issoudun: {
    file: "issoudun.webp",
    altFr:
      "Tour Blanche d'Issoudun au-dessus des buis taillés, sous un ciel bleu",
    altEn:
      "The Tour Blanche in Issoudun above clipped box hedges under a blue sky",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Issoudun_(Indre)._(35747813091).jpg",
    focalX: 50,
    focalY: 10,
  },
  "mehun-sur-yevre": {
    file: "mehun-sur-yevre.webp",
    altFr:
      "Tours du château de Mehun-sur-Yèvre dorées par le soleil sur un ciel bleu",
    altEn:
      "Towers of the Château de Mehun-sur-Yèvre gilded by the sun against a blue sky",
    author: "MaryDo",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mehun_sur_Y%C3%A8vre,_ch%C3%A2teau.jpg",
    focalX: 50,
    focalY: 40,
  },
  nohant: {
    file: "nohant.webp",
    altFr:
      "Façade de la maison de George Sand à Nohant, volets gris et massifs d'hortensias",
    altEn:
      "Façade of George Sand's house in Nohant, grey shutters and hydrangea beds",
    author: "Manfred Heyde",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Nohant_06_2009.jpg",
    focalX: 50,
    focalY: 20,
  },
  "clery-saint-andre": {
    file: "clery-saint-andre.webp",
    altFr:
      "Basilique Notre-Dame de Cléry-Saint-André, son flanc gothique et un arbre roux sous un ciel bleu",
    altEn:
      "Basilica of Notre-Dame in Cléry-Saint-André, its Gothic flank and a russet tree under a blue sky",
    author: "Fab5669",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cl%C3%A9ry-Saint-Andr%C3%A9_-_basilique_Notre-Dame_(18).jpg",
    focalX: 40,
    focalY: 20,
  },
  reuilly: {
    file: "reuilly.webp",
    altFr:
      "Le bourg de Reuilly et son clocher vus depuis les rangs de vigne au printemps",
    altEn:
      "The village of Reuilly and its church tower seen from the vine rows in spring",
    author: "Reuillois",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vue_de_Reuilly.jpg",
    focalX: 45,
    focalY: 35,
  },
  quincy: {
    file: "quincy.webp",
    altFr:
      "Château de Quincy, dans le Cher, au bout de son allée de gravier sous un ciel bleu",
    altEn:
      "Château de Quincy, in the Cher, at the end of its gravel drive under a blue sky",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl: "https://www.flickr.com/photos/26082117@N07/51945090702",
    focalX: 55,
    focalY: 45,
  },
  "maison-laudacius": {
    file: "maison-laudacius.webp",
    altFr:
      "Montlouis-sur-Loire sur son coteau, l'église et les jardins en fleurs au printemps",
    altEn:
      "Montlouis-sur-Loire on its hillside, the church and gardens in bloom in spring",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl: "https://www.flickr.com/photos/26082117@N07/51964426690",
    focalX: 50,
    focalY: 35,
  },
  nancay: {
    file: "nancay.webp",
    altFr:
      "Grand miroir à treillis du radiotélescope de Nançay, à la sortie du village, sous un ciel pommelé",
    altEn:
      "Great lattice mirror of the Nançay radio telescope, just outside the village, under a dappled sky",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl: "https://www.flickr.com/photos/26082117@N07/52084445589",
    focalX: 60,
    focalY: 35,
  },
  monmousseau: {
    file: "monmousseau.webp",
    altFr:
      "Montrichard et son donjon vus depuis les vignes jaunies du coteau, en automne",
    altEn:
      "Montrichard and its keep seen from the yellowing hillside vines in autumn",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl: "https://www.flickr.com/photos/26082117@N07/15615372269",
    focalX: 55,
    focalY: 45,
  },
  "piscine-romorantin": {
    file: "piscine-romorantin.webp",
    altFr:
      "La Sauldre à Romorantin-Lanthenay, son déversoir fleuri, le pont et le clocher de l'église Saint-Étienne",
    altEn:
      "The Sauldre in Romorantin-Lanthenay, its flowered weir, the bridge and the spire of Saint-Étienne church",
    author: "Vincent4145",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:RomorantinLanthenay.jpg",
    focalX: 65,
    focalY: 35,
  },
  marche: {
    file: "marche.webp",
    altFr:
      "Maison à pans de bois et commerces de la rue du Maréchal-de-Lattre-de-Tassigny, à Romorantin-Lanthenay",
    altEn:
      "Half-timbered house and shops on rue du Maréchal-de-Lattre-de-Tassigny in Romorantin-Lanthenay",
    author: "Croquant",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Romorantin_rue_du_Mar%C3%A9chal_de_Lattre_de_Tassigny_1.jpg",
    focalX: 65,
    focalY: 45,
  },
  leclerc: {
    file: "leclerc.webp",
    altFr:
      "Hôtel de ville de Romorantin-Lanthenay et son jardin, sous un ciel de nuages blancs",
    altEn:
      "Town hall of Romorantin-Lanthenay and its garden under white clouds",
    author: "François Garnier",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Romorantin_-_H%C3%B4tel_Lionel-Normant,_actuellement_h%C3%B4tel_de_ville.jpg",
    focalX: 60,
    focalY: 40,
  },
  "golf-cheverny": {
    file: "golf-cheverny.webp",
    altFr:
      "Jardins et allée menant à l'orangerie, dans le parc du château de Cheverny",
    altEn:
      "Gardens and path leading to the orangery in the park of the Château de Cheverny",
    author: "Zairon",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cheverny_Blick_auf_die_Orangerie.jpg",
    focalX: 50,
    focalY: 45,
  },
  "golf-des-etoiles": {
    file: "golf-des-etoiles.webp",
    altFr:
      "Étang de Sologne bordé de bouleaux et de roseaux à Chaumont-sur-Tharonne, en fin d'hiver",
    altEn:
      "Sologne pond edged with birches and reeds at Chaumont-sur-Tharonne in late winter",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Chaumont-sur-Tharonne_(Loir-et-Cher)_(12816269374).jpg",
    focalX: 50,
    focalY: 40,
  },
  "pierrefitte-sur-sauldre": {
    file: "pierrefitte-sur-sauldre.webp",
    altFr:
      "Église de Brinon-sur-Sauldre et sa galerie en bois (caquetoire), en Sologne",
    altEn:
      "Church of Brinon-sur-Sauldre and its timber porch gallery (caquetoire), in the Sologne",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Brinon-sur-Sauldre_(Cher)_(26496990212).jpg",
    focalX: 45,
    focalY: 50,
  },
  "a85-sortie-14": {
    file: "a85-sortie-14.webp",
    altFr:
      "Autoroute A71 à l'approche de la bifurcation vers l'A85, sous les panneaux Paris Orléans et Nantes Tours Blois",
    altEn:
      "A71 motorway approaching the fork to the A85, under the signs for Paris Orléans and Nantes Tours Blois",
    author: "Poudou99",
    license: "CC BY 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:A71-Bif_A85_-_2015-08-21_-_IMG-0716.jpg",
    focalX: 60,
    focalY: 45,
  },
  "maison-des-vins-cheverny": {
    file: "maison-des-vins-cheverny.webp",
    altFr:
      "Façade de la Maison des vins de Cheverny, volets rouges et escalier de pierre, au cœur du village",
    altEn:
      "Front of the Maison des vins de Cheverny, red shutters and stone staircase, in the heart of the village",
    author: "Chatsam",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cheverny_maison_aoc.JPG",
    focalX: 45,
    focalY: 50,
  },
  "reserve-de-beaumarchais": {
    file: "reserve-de-beaumarchais.webp",
    altFr:
      "Wallabies sur l'herbe devant leur abri de bois, à la réserve de Beaumarchais à Autrèche",
    altEn:
      "Wallabies on the grass in front of their wooden shelter at the Beaumarchais reserve in Autrèche",
    author: "GrandCelinien",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Groupe_de_wallabies.jpg",
    focalX: 55,
    focalY: 65,
  },
  "maison-de-la-bd": {
    file: "maison-de-la-bd.webp",
    altFr: "La rue Denis-Papin à Blois vue du haut des escaliers Denis-Papin",
    altEn:
      "Rue Denis-Papin in Blois seen from the top of the Denis-Papin steps",
    author: "Zairon",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Blois_Rue_Denis_Papin_von_den_Escaliers_Denis_Papin_5.jpg",
    focalX: 55,
    focalY: 55,
  },
  "palais-jacques-coeur": {
    file: "palais-jacques-coeur.webp",
    altFr:
      "Façade gothique du palais Jacques-Cœur à Bourges, avec la statue de Jacques Cœur au premier plan",
    altEn:
      "Gothic façade of the Jacques-Cœur Palace in Bourges, with the statue of Jacques Cœur in the foreground",
    author: "Benjamin Smith",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bourges_-_Palais_Jacques-C%C5%93ur_-_Ext%C3%A9rieur_-_08.jpg",
    focalX: 50,
    focalY: 35,
  },
  "halles-de-tours": {
    file: "halles-de-tours.webp",
    altFr:
      "Enseigne rouge « Les Halles » sur la façade du marché couvert de Tours",
    altEn:
      "Red « Les Halles » sign on the front of the covered market in Tours",
    author: "Guill37",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hallestours1.jpg",
    focalX: 75,
    focalY: 35,
  },
  "musee-compagnonnage-tours": {
    file: "musee-compagnonnage-tours.webp",
    altFr:
      "Grande salle du musée du Compagnonnage de Tours, vitrines sous une charpente de bois",
    altEn:
      "Main hall of the Musée du Compagnonnage in Tours, display cases under a timber roof",
    author: "AlSepPhoenix",
    license: "CC BY 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Musee_Compagnonnage_de_Tours_-_Grande_salle_02.jpg",
    focalX: 50,
    focalY: 50,
  },
  "la-ferte-imbault": {
    file: "la-ferte-imbault.webp",
    altFr:
      "Vue aérienne du château de La Ferté-Imbault, entouré de ses douves, au bord du village",
    altEn:
      "Aerial view of the Château de La Ferté-Imbault, ringed by its moat, on the edge of the village",
    author: "Carsten Steger",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Aerial_image_of_Ch%C3%A2teau_de_La_Fert%C3%A9-Imbault_(view_from_the_east).jpg",
    focalX: 55,
    focalY: 45,
  },
  "saint-viatre": {
    file: "saint-viatre.webp",
    altFr:
      "Clocher tors de l'église de Saint-Viâtre au bout d'une rue du village",
    altEn:
      "Twisted spire of the church of Saint-Viâtre at the end of a village lane",
    author: "Vincent4145",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:EcclesiamSantcusViatri.JPG",
    focalX: 60,
    focalY: 40,
  },
  "brinon-sur-sauldre": {
    file: "brinon-sur-sauldre.webp",
    altFr:
      "Église Saint-Barthélemy de Brinon-sur-Sauldre, son clocher de bois et son caquetoire",
    altEn:
      "Church of Saint-Barthélemy in Brinon-sur-Sauldre, with its timber bell tower and covered porch",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Brinon-sur-Sauldre_(Cher)_(25491489174).jpg",
    focalX: 45,
    focalY: 45,
  },
  "maison-tatin": {
    file: "maison-tatin.webp",
    altFr:
      "Façade de brique et de pierre de l'hôtel Tatin à Lamotte-Beuvron, à la tombée du jour",
    altEn:
      "Brick and stone front of the Hôtel Tatin in Lamotte-Beuvron at dusk",
    author: "Velvet",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Lamotte-beuvron_hotel_tatin.jpg",
    focalX: 45,
    focalY: 55,
  },
  "golf-des-aisses": {
    file: "golf-des-aisses.webp",
    altFr:
      "Fairway et bunkers de sable blanc du golf des Aisses, bordés de forêt",
    altEn:
      "Fairway and white sand bunkers at Les Aisses golf course, edged by forest",
    author: "Emiliesey",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:TROU_12.jpg",
    focalX: 50,
    focalY: 60,
  },
  "montgolfiere-au-gre-des-vents": {
    file: "montgolfiere-au-gre-des-vents.webp",
    altFr:
      "Montgolfière jaune d'Au Gré des Vents en vol dans le ciel bleu de Thésée, dans la vallée du Cher",
    altEn:
      "Yellow Au Gré des Vents hot-air balloon flying in the blue sky over Thésée, in the Cher valley",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Th%C3%A9s%C3%A9e-la-Romaine_(Loir-et-Cher)_(14613773922).jpg",
    focalX: 45,
    focalY: 50,
  },
  "villa-quincy": {
    file: "villa-quincy.webp",
    altFr:
      "La Villa Quincy et son enseigne au centre du bourg de Quincy, sous un ciel nuageux",
    altEn:
      "The Villa Quincy and its sign in the centre of the village of Quincy, under a cloudy sky",
    author: "Yzergues",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Quincy_-_centre_bourg.jpg",
    focalX: 40,
    focalY: 55,
  },
  "caves-du-pere-auguste": {
    file: "caves-du-pere-auguste.webp",
    altFr:
      "Rangs de vigne du vignoble de Thoré à Civray-de-Touraine, la vallée du Cher à l'horizon",
    altEn:
      "Vine rows of the Thoré vineyard in Civray-de-Touraine, with the Cher valley on the horizon",
    author: "Civray-de-touraine",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vignoble_%C3%A0_Civray_de_Touraine.jpg",
    focalX: 50,
    focalY: 65,
  },
  "etang-de-malzone": {
    file: "etang-de-malzone.webp",
    altFr:
      "Les Grands Étangs de Millançay bordés de pins et de saules, en fin d'été",
    altEn:
      "The Grands Étangs ponds in Millançay, edged with pines and willows in late summer",
    author: "Pierre André Leclercq",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Millan%C3%A7ay_Et%C3%A92016_Les_Grands_%C3%89tangs_(1).jpg",
    focalX: 50,
    focalY: 60,
  },
  "etang-le-mouet": {
    file: "etang-le-mouet.webp",
    altFr:
      "Étang de Theillay, entre Saint-Viâtre et Marcilly-en-Gault, sa berge de sable et ses bois sous un ciel bleu",
    altEn:
      "Theillay pond between Saint-Viâtre and Marcilly-en-Gault, its sandy shore and woods under a blue sky",
    author: "Olive Titus",
    license: "CC BY 2.0",
    sourceUrl: "https://www.flickr.com/photos/96064256@N04/47081756744",
    focalX: 50,
    focalY: 60,
  },
  "etang-de-beaumont": {
    file: "etang-de-beaumont.webp",
    altFr:
      "Étang de Sologne aux Courtais, à Courmemin, roseaux givrés au premier plan dans la lumière du matin",
    altEn:
      "Sologne pond at Les Courtais in Courmemin, frosted reeds in the foreground in the morning light",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl: "https://www.flickr.com/photos/26082117@N07/49425817872",
    focalX: 45,
    focalY: 55,
  },
  "velos-des-chateaux": {
    file: "velos-des-chateaux.webp",
    altFr:
      "Le Beuvron à Bracieux, eau calme sous les arbres et berge d'herbes hautes en été",
    altEn:
      "The Beuvron river in Bracieux, still water under the trees and a bank of tall grass in summer",
    author: "Krzysztof Golik",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Beuvron_River_in_Bracieux.jpg",
    focalX: 50,
    focalY: 60,
  },
  "max-vauche": {
    file: "max-vauche.webp",
    altFr:
      "Hôtel de ville de Bracieux, façade blanche fleurie et toit d'ardoise sous un ciel bleu",
    altEn:
      "Bracieux town hall, white front with window boxes and a slate roof under a blue sky",
    author: "F Ceragioli",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bracieux_hotel_de_ville.jpg",
    focalX: 50,
    focalY: 45,
  },
};

export const GUIDE_PHOTOS: Record<string, PlacePhoto> = {
  "brame-du-cerf-en-sologne": {
    file: "brame-du-cerf-en-sologne.webp",
    altFr:
      "Cerf en plein brame dans les herbes dorées au bord de l'eau, à la lumière du soir",
    altEn:
      "Red deer stag roaring in golden grass beside the water in the evening light",
    author: "Stagiairemarketingsaintecroix",
    license: "CC0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Brame_du_cerf.jpg",
    focalX: 40,
    focalY: 35,
  },
  "chateaux-de-la-loire-depuis-romorantin": {
    file: "chateaux-de-la-loire-depuis-romorantin.webp",
    altFr:
      "Château de Chenonceau et tour des Marques reflétés dans le Cher, à la lumière du matin",
    altEn:
      "Château de Chenonceau and the Marques tower mirrored in the river Cher in morning light",
    author: "Antoine Montulé",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_de_Chenonceau_-_Fa%C3%A7ade_Ouest_et_Tour_des_Marques_reflets.jpg",
    focalX: 55,
    focalY: 45,
  },
  "etangs-et-forets-de-sologne": {
    file: "etangs-et-forets-de-sologne.webp",
    altFr:
      "Étang de Sologne au lever du jour, arbres dorés et brume légère reflétés dans l'eau",
    altEn:
      "Sologne pond at daybreak, golden trees and light mist mirrored in the water",
    author: "Angelo Brathot from Sologne-France",
    license: "Public domain",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Pond_of_Sologne_(29758027838).jpg",
    focalX: 55,
    focalY: 45,
  },
  "gite-proche-chateau-de-chambord": {
    file: "gite-proche-chateau-de-chambord.webp",
    altFr:
      "Château de Chambord doré par le soleil, reflété dans l'eau calme du Cosson",
    altEn:
      "Château de Chambord in golden sunlight, mirrored in the still water of the Cosson",
    author: "Henneveux Marc",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_de_Chambord_et_plan_d%27eau.JPG",
    focalX: 60,
    focalY: 20,
  },
  "gite-proche-zooparc-de-beauval": {
    file: "gite-proche-zooparc-de-beauval.webp",
    altFr:
      "Panda géant endormi sur une branche dans son enclos du ZooParc de Beauval",
    altEn:
      "Giant panda sleeping on a branch in its enclosure at the ZooParc de Beauval",
    author: "Thesupermat",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Zooparc_de_Beauval_-_Panda_-_2016_-_012.jpg",
    focalX: 40,
    focalY: 35,
  },
  "sologne-a-velo": {
    file: "sologne-a-velo.webp",
    altFr:
      "Voie verte longeant le canal de Berry à Mennetou-sur-Cher, nuages reflétés dans l'eau",
    altEn:
      "Greenway along the Berry canal at Mennetou-sur-Cher, clouds mirrored in the water",
    author: "VVVCFFrance",
    license: "CC0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Voie_verte_du_canal_de_Berry_%C3%A0_Mennetou_vers_Langon.jpg",
    focalX: 50,
    focalY: 45,
  },
  "sologne-en-famille-avec-enfants": {
    file: "sologne-en-famille-avec-enfants.webp",
    altFr:
      "Aire de jeux et bâtiment du domaine des Hauts de Bruyères parmi les pins",
    altEn:
      "Playground and building of the Hauts de Bruyères estate among the pine trees",
    author: "Poudou99",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Les-Hauts-de-Bruy%C3%A8res_-_2017-11-15_-_IMG_1537.jpg",
    focalX: 60,
    focalY: 45,
  },
  "venir-a-romorantin-lanthenay": {
    file: "venir-a-romorantin-lanthenay.webp",
    altFr:
      "Bâtiment voyageurs de la gare de Romorantin-Lanthenay et son rond-point",
    altEn:
      "Passenger building of Romorantin-Lanthenay station and its roundabout",
    author: "Croquant",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Romorantin_gare_Blanc-Argent_1.jpg",
    focalX: 50,
    focalY: 50,
  },
  "week-end-en-sologne": {
    file: "week-end-en-sologne.webp",
    altFr:
      "Maison à colombages de Souvigny-en-Sologne, jardinières fleuries et massifs en été",
    altEn:
      "Half-timbered house in Souvigny-en-Sologne with flower boxes and summer borders",
    author: "Wouter Hagens",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Souvigny-en-Sologne_B.jpg",
    focalX: 50,
    focalY: 25,
  },
  "gite-sologne-avec-chien": {
    file: "gite-sologne-avec-chien.webp",
    altFr:
      "Chemin de promenade en Sologne longeant une prairie, sous des chênes aux feuilles rousses",
    altEn:
      "Walking path in the Sologne beside a meadow, under oaks with russet leaves",
    author: "Angelo Brathot from Sologne-France",
    license: "Public domain",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Sentiers_d%27hiver-_explore_22-01-21_(50866038291).jpg",
    focalX: 45,
    focalY: 60,
  },
  "tourisme-equestre-en-sologne": {
    file: "tourisme-equestre-en-sologne.webp",
    altFr:
      "Deux cavalières à cheval traversant le Beuvron à gué à Lamotte-Beuvron",
    altEn: "Two riders on horseback fording the Beuvron in Lamotte-Beuvron",
    author: "Maloq",
    license: "Public domain",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Lamotte_2008_beuvron.jpg",
    focalX: 45,
    focalY: 60,
  },
  "que-faire-a-romorantin-lanthenay": {
    file: "que-faire-a-romorantin-lanthenay.webp",
    altFr:
      "Pont de pierre, déversoir fleuri et clocher de Romorantin-Lanthenay sur la Sauldre",
    altEn:
      "Stone bridge, flowered weir and church spire of Romorantin-Lanthenay on the Sauldre",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Romorantin-Lanthenay_(Loir-et-Cher)_(32495542688).jpg",
    focalX: 65,
    focalY: 10,
  },
  "amboise-et-clos-luce-depuis-romorantin": {
    file: "amboise-et-clos-luce-depuis-romorantin.webp",
    altFr:
      "Château royal d'Amboise dominant la ville, reflété dans la Loire sous un ciel bleu",
    altEn:
      "Royal Château of Amboise above the town, mirrored in the Loire under a blue sky",
    author: "W. Bulach",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:00_1297_Ch%C3%A2teau_d%27Amboise.jpg",
    focalX: 50,
    focalY: 20,
  },
  "bourges-en-une-journee-depuis-romorantin": {
    file: "bourges-en-une-journee-depuis-romorantin.webp",
    altFr:
      "Cathédrale Saint-Étienne de Bourges illuminée à l'heure bleue, chevet et arcs-boutants",
    altEn:
      "Saint-Étienne Cathedral in Bourges lit up at blue hour, chevet and flying buttresses",
    author: "Wladyslaw Sojka",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Kathedrale_Bourges_v2.jpg",
    focalX: 50,
    focalY: 35,
  },
  "que-faire-en-sologne-quand-il-pleut": {
    file: "que-faire-en-sologne-quand-il-pleut.webp",
    altFr:
      "Escalier à double révolution du château de Chambord sous sa voûte à caissons",
    altEn:
      "Double-helix staircase of the Château de Chambord beneath its coffered vault",
    author: "Zairon",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Chambord_Ch%C3%A2teau_de_Chambord_Innen_Wendeltreppe_07.jpg",
    focalX: 45,
    focalY: 50,
  },
  "route-des-vins-cheverny-touraine-depuis-la-sologne": {
    file: "route-des-vins-cheverny-touraine-depuis-la-sologne.webp",
    altFr:
      "Loge de vigne en tuffeau au toit de tuiles, au milieu des vignes de Touraine",
    altEn: "Tufa vineyard hut with a tiled roof among the vines of Touraine",
    author: "Gerard Jalaudin",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Loge_de_vignes_5772.jpg",
    focalX: 55,
    focalY: 30,
  },
  "villages-de-sologne-a-voir": {
    file: "villages-de-sologne-a-voir.webp",
    altFr:
      "Église et place fleurie de Chaumont-sur-Tharonne, entourées de maisons de brique",
    altEn:
      "Church and flowered square of Chaumont-sur-Tharonne, ringed by brick houses",
    author: "Poudou99",
    license: "CC BY 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Chaumont-sur-Tharonne-Eglise_eIMG_9978.jpg",
    focalX: 35,
    focalY: 15,
  },
  "balade-en-bateau-sur-la-loire-depuis-la-sologne": {
    file: "balade-en-bateau-sur-la-loire-depuis-la-sologne.webp",
    altFr:
      "Toue cabanée naviguant sur la Loire, reflets dorés des arbres sur l'eau",
    altEn:
      "Cabin toue sailing on the Loire, golden reflections of trees on the water",
    author: "Mairie de Béhuard",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Toue_caban%C3%A9e_en_Guillemette.jpg",
    focalX: 45,
    focalY: 60,
  },
  "croisiere-sous-le-chateau-de-chenonceau": {
    file: "croisiere-sous-le-chateau-de-chenonceau.webp",
    altFr:
      "Bateau de croisière et ses passagers sur le Cher devant le château de Chenonceau",
    altEn:
      "Cruise boat and its passengers on the Cher in front of the Château de Chenonceau",
    author: "Daniel Jolivet",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Le_Ch%C3%A2teau_de_Chenonceau_(Indre-et-Loire)_(8445112642).jpg",
    focalX: 35,
    focalY: 60,
  },
  "tours-en-une-journee-depuis-romorantin": {
    file: "tours-en-une-journee-depuis-romorantin.webp",
    altFr:
      "Maisons à pans de bois et terrasses de la place Plumereau à Tours, sous un ciel bleu",
    altEn:
      "Half-timbered houses and café terraces on Place Plumereau in Tours under a blue sky",
    author: "Gerard Jalaudin",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Place_Plum_Tours_4598.jpg",
    focalX: 40,
    focalY: 15,
  },
  "vignobles-du-berry-quincy-reuilly-menetou-salon": {
    file: "vignobles-du-berry-quincy-reuilly-menetou-salon.webp",
    altFr:
      "Vignes de Menetou-Salon et loge de vigne, la campagne du Berry à l'horizon",
    altEn:
      "Vines of Menetou-Salon with a vineyard hut, the Berry countryside on the horizon",
    author: "jamesonf",
    license: "CC BY 2.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vignoble_de_Menetou-Salon.jpg",
    focalX: 50,
    focalY: 50,
  },
  "golf-en-sologne": {
    file: "golf-en-sologne.webp",
    altFr:
      "Green, bunkers et pièce d'eau du Golf national, à Saint-Quentin-en-Yvelines",
    altEn:
      "Green, bunkers and water hazard at the Golf national in Saint-Quentin-en-Yvelines",
    author: "Lionel Allorge",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Golf_national_2011_06.jpg",
    focalX: 50,
    focalY: 55,
  },
  "chateaux-de-la-loire-en-montgolfiere": {
    file: "chateaux-de-la-loire-en-montgolfiere.webp",
    altFr:
      "Montgolfière en cours de gonflage, brûleur allumé, devant le château de Chambord",
    altEn:
      "Hot-air balloon being inflated, burner lit, in front of the Château de Chambord",
    author: "Nathalie Seigne",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_de_Chambord,_lancement_de_montgolfi%C3%A8re_1.JPG",
    focalX: 35,
    focalY: 40,
  },
};
