import type { OfficialSiteGroup } from "../../../src/lib/official-sites";
import type { PlaceCategory } from "../../../src/lib/places";

interface SiteText {
  name: string;
  detail?: string;
}

export interface SeedOfficialSite {
  key: string;
  group: OfficialSiteGroup;
  url: string;
  showInFooter?: boolean;
  fr: SiteText;
  en: SiteText;
}

export const OFFICIAL_SITES: SeedOfficialSite[] = [
  {
    key: "romorantin",
    group: "venir",
    url: "https://www.romorantin.com/",
    showInFooter: true,
    fr: {
      name: "Ville de Romorantin-Lanthenay",
      detail:
        "Le site de la mairie : marchés, musées, piscine et agenda de la ville.",
    },
    en: {
      name: "Town of Romorantin-Lanthenay",
      detail:
        "The town hall website: markets, museums, swimming pool and what's on.",
    },
  },
  {
    key: "ccrm",
    group: "venir",
    url: "https://ccrm41.fr/",
    fr: {
      name: "Communauté de communes du Romorantinais et du Monestois",
      detail:
        "L'intercommunalité de Romorantin : équipements, déchetteries et services autour de la ville.",
    },
    en: {
      name: "Romorantinais et Monestois community of communes",
      detail:
        "Romorantin's local authority: facilities and services around the town.",
    },
  },
  {
    key: "remi",
    group: "venir",
    url: "https://www.remi-centrevaldeloire.fr/",
    fr: {
      name: "Rémi Centre-Val de Loire",
      detail:
        "Le réseau régional de trains et de cars : horaires vers Romorantin, Salbris et Vierzon.",
    },
    en: {
      name: "Rémi Centre-Val de Loire",
      detail:
        "The regional train and coach network: timetables to Romorantin, Salbris and Vierzon.",
    },
  },
  {
    key: "sncf",
    group: "venir",
    url: "https://www.sncf-connect.com/",
    fr: {
      name: "SNCF Connect",
      detail: "Billets et horaires de train jusqu'à Vierzon, Salbris ou Blois.",
    },
    en: {
      name: "SNCF Connect",
      detail: "Train tickets and timetables to Vierzon, Salbris or Blois.",
    },
  },
  {
    key: "sologne",
    group: "sologne",
    url: "https://www.sologne-tourisme.fr/",
    showInFooter: true,
    fr: {
      name: "Sologne Tourisme",
      detail:
        "L'office de tourisme de la Sologne : étangs, sentiers, villages et agenda des sorties.",
    },
    en: {
      name: "Sologne Tourisme",
      detail:
        "The Sologne tourist office: ponds, trails, villages and what's on.",
    },
  },
  {
    key: "loirEtCher",
    group: "sologne",
    url: "https://www.val-de-loire-41.com/",
    showInFooter: true,
    fr: {
      name: "Val de Loire Loir-et-Cher",
      detail:
        "L'agence de tourisme du département : châteaux, Beauval, idées de séjour dans le Loir-et-Cher.",
    },
    en: {
      name: "Val de Loire Loir-et-Cher",
      detail:
        "The tourism agency of the Loir-et-Cher department: châteaux, Beauval and trip ideas.",
    },
  },
  {
    key: "bloisChambord",
    group: "sologne",
    url: "https://www.bloischambord.com/",
    fr: {
      name: "Blois Chambord Val de Loire",
      detail:
        "L'office de tourisme de Blois, Chambord, Cheverny et Chaumont-sur-Loire.",
    },
    en: {
      name: "Blois Chambord Val de Loire",
      detail:
        "The tourist office for Blois, Chambord, Cheverny and Chaumont-sur-Loire.",
    },
  },
  {
    key: "sudValDeLoire",
    group: "sologne",
    url: "https://www.sudvaldeloire.fr/",
    fr: {
      name: "Sud Val de Loire",
      detail:
        "L'office de tourisme de la vallée du Cher : Saint-Aignan, Beauval, Montrichard, Selles-sur-Cher.",
    },
    en: {
      name: "Sud Val de Loire",
      detail:
        "The Cher valley tourist office: Saint-Aignan, Beauval, Montrichard, Selles-sur-Cher.",
    },
  },
  {
    key: "natura2000",
    group: "sologne",
    url: "https://sologne.n2000.fr/",
    fr: {
      name: "Natura 2000 Sologne",
      detail:
        "Le site du réseau européen Natura 2000 en Sologne : milieux, espèces et gestion des étangs et des landes.",
    },
    en: {
      name: "Natura 2000 Sologne",
      detail:
        "The European Natura 2000 network in the Sologne: habitats, species and how ponds and heaths are managed.",
    },
  },
  {
    key: "ffe",
    group: "sologne",
    url: "https://www.ffe.com/parc-equestre",
    fr: {
      name: "Parc équestre fédéral, FFE",
      detail:
        "Le site de la Fédération française d'équitation à Lamotte-Beuvron : calendrier des concours et accès.",
    },
    en: {
      name: "Federal Equestrian Park, FFE",
      detail:
        "The French Equestrian Federation site in Lamotte-Beuvron: competition calendar and access.",
    },
  },
  {
    key: "vendomeTourisme",
    group: "sologne",
    url: "https://www.vendome-tourisme.fr/",
    fr: {
      name: "Vendôme Tourisme",
      detail: "L'office de tourisme de Vendôme et de la vallée du Loir.",
    },
    en: {
      name: "Vendôme Tourisme",
      detail: "The tourist office for Vendôme and the Loir valley.",
    },
  },
  {
    key: "beauval",
    group: "sologne",
    url: "https://www.zoobeauval.com/",
    fr: {
      name: "ZooParc de Beauval",
      detail:
        "Le site officiel du zoo de Saint-Aignan : horaires, billetterie et plan du parc.",
    },
    en: {
      name: "ZooParc de Beauval",
      detail:
        "The official site of the zoo in Saint-Aignan: opening hours, tickets and park map.",
    },
  },
  {
    key: "chateaux",
    group: "chateaux",
    url: "https://www.chateaux-de-la-loire.fr/",
    showInFooter: true,
    fr: {
      name: "Châteaux de la Loire",
      detail:
        "La liste et la carte des châteaux ouverts à la visite, avec leurs horaires.",
    },
    en: {
      name: "Châteaux de la Loire",
      detail:
        "The list and map of châteaux open to visitors, with opening hours.",
    },
  },
  {
    key: "unesco",
    group: "chateaux",
    url: "https://valdeloire.org/",
    fr: {
      name: "Val de Loire patrimoine mondial",
      detail:
        "La Mission Val de Loire, qui anime l'inscription du Val de Loire au patrimoine mondial de l'UNESCO.",
    },
    en: {
      name: "Val de Loire World Heritage",
      detail:
        "Mission Val de Loire, which looks after the Loire Valley's UNESCO World Heritage listing.",
    },
  },
  {
    key: "valDeLoire",
    group: "chateaux",
    url: "https://www.valdeloire-france.com/",
    fr: {
      name: "Val de Loire",
      detail:
        "Le portail touristique du Val de Loire : châteaux, jardins, vins et itinéraires.",
    },
    en: {
      name: "Val de Loire",
      detail:
        "The Loire Valley tourism portal: châteaux, gardens, wines and itineraries.",
    },
  },
  {
    key: "amboise",
    group: "chateaux",
    url: "https://amboise-valdeloire.com/",
    fr: {
      name: "Amboise Val de Loire",
      detail:
        "L'office de tourisme d'Amboise : château royal, Clos Lucé et bords de Loire.",
    },
    en: {
      name: "Amboise Val de Loire",
      detail:
        "The Amboise tourist office: royal château, Clos Lucé and the banks of the Loire.",
    },
  },
  {
    key: "loches",
    group: "chateaux",
    url: "https://loches-valdeloire.com/",
    fr: {
      name: "Loches Touraine Châteaux de la Loire",
      detail:
        "L'office de tourisme de Loches, Montrésor et de la vallée de l'Indre.",
    },
    en: {
      name: "Loches Touraine Châteaux de la Loire",
      detail: "The tourist office for Loches, Montrésor and the Indre valley.",
    },
  },
  {
    key: "touraine",
    group: "chateaux",
    url: "https://www.tourainevaldeloire.com/",
    fr: {
      name: "Touraine Val de Loire",
      detail:
        "L'agence de tourisme de l'Indre-et-Loire : Amboise, Chenonceau, Loches.",
    },
    en: {
      name: "Touraine Val de Loire",
      detail:
        "The tourism agency of the Indre-et-Loire department: Amboise, Chenonceau, Loches.",
    },
  },
  {
    key: "toursTourisme",
    group: "chateaux",
    url: "https://www.tours-tourisme.fr/",
    fr: {
      name: "Tours Val de Loire Tourisme",
      detail:
        "L'office de tourisme de Tours : vieux Tours, cathédrale, Vouvray et balades sur la Loire.",
    },
    en: {
      name: "Tours Val de Loire Tourisme",
      detail:
        "The Tours tourist office: old town, cathedral, Vouvray and trips on the Loire.",
    },
  },
  {
    key: "monumentsNationaux",
    group: "chateaux",
    url: "https://www.monuments-nationaux.fr/",
    fr: {
      name: "Centre des monuments nationaux",
      detail:
        "L'établissement public qui ouvre Azay-le-Rideau, Talcy, Bouges, le palais Jacques-Cœur et la maison de George Sand.",
    },
    en: {
      name: "Centre des monuments nationaux",
      detail:
        "The public body that runs Azay-le-Rideau, Talcy, Bouges, the Jacques-Cœur palace and George Sand's house.",
    },
  },
  {
    key: "region",
    group: "chateaux",
    url: "https://www.centre-valdeloire.fr/",
    fr: {
      name: "Région Centre-Val de Loire",
      detail:
        "Le site de la Région : patrimoine, grands sites et actualité du Centre-Val de Loire.",
    },
    en: {
      name: "Centre-Val de Loire Region",
      detail:
        "The regional council site: heritage, major sites and news from Centre-Val de Loire.",
    },
  },
  {
    key: "berryProvince",
    group: "berry",
    url: "https://www.berryprovince.com/",
    fr: {
      name: "Berry Province",
      detail:
        "Le tourisme dans le Cher et l'Indre : Bourges, Valençay, Sologne berrichonne.",
    },
    en: {
      name: "Berry Province",
      detail:
        "Tourism in the Cher and Indre departments: Bourges, Valençay and the Berry side of the Sologne.",
    },
  },
  {
    key: "bourges",
    group: "berry",
    url: "https://www.bourgesberrytourisme.com/",
    fr: {
      name: "Bourges Berry Tourisme",
      detail:
        "L'office de tourisme de Bourges : cathédrale, palais Jacques-Cœur, marais.",
    },
    en: {
      name: "Bourges Berry Tourisme",
      detail:
        "The Bourges tourist office: cathedral, Jacques-Cœur palace, marshes.",
    },
  },
  {
    key: "berrySologne",
    group: "berry",
    url: "https://www.berrysolognetourisme.com/",
    fr: {
      name: "Berry-Sologne Tourisme",
      detail:
        "L'office de tourisme de Vierzon et de la Sologne berrichonne, dont Nançay.",
    },
    en: {
      name: "Berry-Sologne Tourisme",
      detail:
        "The tourist office for Vierzon and the Berry side of the Sologne, including Nançay.",
    },
  },
  {
    key: "loiret",
    group: "berry",
    url: "https://www.tourismeloiret.com/fr",
    fr: {
      name: "Tourisme Loiret",
      detail:
        "L'agence de tourisme du Loiret : Orléans, Beaugency, Meung-sur-Loire, Sologne du nord.",
    },
    en: {
      name: "Tourisme Loiret",
      detail:
        "The tourism agency of the Loiret department: Orléans, Beaugency, Meung-sur-Loire, northern Sologne.",
    },
  },
  {
    key: "orleans",
    group: "berry",
    url: "https://www.tourisme-orleansmetropole.com/",
    fr: {
      name: "Orléans Val de Loire Tourisme",
      detail:
        "L'office de tourisme d'Orléans Métropole : cathédrale, centre ancien, quais de Loire.",
    },
    en: {
      name: "Orléans Val de Loire Tourisme",
      detail: "The Orléans tourist office: cathedral, old centre, Loire quays.",
    },
  },
  {
    key: "valencayTourisme",
    group: "berry",
    url: "https://www.valencay-tourisme.fr/",
    fr: {
      name: "Valençay Tourisme",
      detail:
        "L'office de tourisme du pays de Valençay : château, vins et fromages.",
    },
    en: {
      name: "Valençay Tourisme",
      detail:
        "The tourist office for the Valençay area: château, wines and cheeses.",
    },
  },
  {
    key: "gienTourisme",
    group: "berry",
    url: "https://www.gien-tourisme.fr/",
    fr: {
      name: "Gien Tourisme",
      detail:
        "L'office de tourisme de Gien : château-musée, faïencerie et bords de Loire.",
    },
    en: {
      name: "Gien Tourisme",
      detail:
        "The Gien tourist office: château museum, earthenware factory and the banks of the Loire.",
    },
  },
  {
    key: "valDeSully",
    group: "berry",
    url: "https://www.tourisme-valdesully.fr/",
    fr: {
      name: "Val de Sully Tourisme",
      detail:
        "L'office de tourisme de Sully-sur-Loire et de Saint-Benoît-sur-Loire.",
    },
    en: {
      name: "Val de Sully Tourisme",
      detail:
        "The tourist office for Sully-sur-Loire and Saint-Benoît-sur-Loire.",
    },
  },
  {
    key: "chateaurouxTourisme",
    group: "berry",
    url: "https://www.chateauroux-tourisme.com/",
    fr: {
      name: "Châteauroux Berry Tourisme",
      detail:
        "L'office de tourisme de Châteauroux, porte d'entrée du Berry de George Sand.",
    },
    en: {
      name: "Châteauroux Berry Tourisme",
      detail: "The Châteauroux tourist office, gateway to George Sand's Berry.",
    },
  },
  {
    key: "loireVelo",
    group: "velo",
    url: "https://www.loireavelo.fr/",
    showInFooter: true,
    fr: {
      name: "La Loire à Vélo",
      detail:
        "L'itinéraire cyclable le long de la Loire, étape par étape, avec les loueurs de vélos.",
    },
    en: {
      name: "La Loire à Vélo",
      detail:
        "The cycle route along the Loire, stage by stage, with bike hire points.",
    },
  },
  {
    key: "canalDeBerry",
    group: "velo",
    url: "https://www.canaldeberryavelo.fr/",
    fr: {
      name: "Canal de Berry à Vélo",
      detail:
        "La véloroute du canal de Berry et du Cher (V46), qui passe à Mennetou-sur-Cher et Selles-sur-Cher.",
    },
    en: {
      name: "Canal de Berry à Vélo",
      detail:
        "The cycle route along the Berry canal and the Cher (V46), through Mennetou-sur-Cher and Selles-sur-Cher.",
    },
  },
  {
    key: "coeurDeFrance",
    group: "velo",
    url: "https://www.francevelotourisme.com/itineraire/coeur-de-france-a-velo",
    fr: {
      name: "Cœur de France à vélo",
      detail:
        "Les étapes et les cartes de la véloroute sur France Vélo Tourisme.",
    },
    en: {
      name: "Cœur de France à vélo",
      detail: "Stages and maps of the cycle route on France Vélo Tourisme.",
    },
  },
  {
    key: "sologneVelo",
    group: "velo",
    url: "https://www.sologne-tourisme.fr/decouvrir/nature-randonnees/a-velo/",
    fr: {
      name: "La Sologne à vélo",
      detail:
        "Les boucles cyclables balisées de Sologne, présentées par Sologne Tourisme.",
    },
    en: {
      name: "The Sologne by bike",
      detail:
        "The signposted cycle loops of the Sologne, presented by Sologne Tourisme.",
    },
  },
  {
    key: "vinsCheverny",
    group: "terroir",
    url: "https://www.vins-cheverny.com/",
    fr: {
      name: "Vins de Cheverny et Cour-Cheverny",
      detail:
        "Le site des deux appellations : vignerons, cépages et caves ouvertes.",
    },
    en: {
      name: "Cheverny and Cour-Cheverny wines",
      detail:
        "The website of both appellations: growers, grape varieties and cellars open to visitors.",
    },
  },
  {
    key: "vinsDeLoire",
    group: "terroir",
    url: "https://www.vinsdeloire.fr/fr",
    fr: {
      name: "Vins de Loire",
      detail:
        "L'interprofession des vins du Val de Loire : appellations de Touraine et caves à visiter.",
    },
    en: {
      name: "Vins de Loire",
      detail:
        "The Loire Valley wine board: Touraine appellations and cellars to visit.",
    },
  },
  {
    key: "sellesAop",
    group: "terroir",
    url: "https://www.aop-sellessurcher.com/",
    fr: {
      name: "AOP Selles-sur-Cher",
      detail:
        "Le syndicat du fromage de chèvre Selles-sur-Cher : producteurs et fabrication.",
    },
    en: {
      name: "Selles-sur-Cher PDO",
      detail:
        "The Selles-sur-Cher goat's cheese association: producers and how it is made.",
    },
  },
  {
    key: "vinsVouvray",
    group: "terroir",
    url: "https://www.vinsdevouvray.com/",
    fr: {
      name: "Vins de Vouvray",
      detail:
        "Le syndicat des vignerons de l'AOC Vouvray : terroirs, vignerons et caves.",
    },
    en: {
      name: "Vins de Vouvray",
      detail:
        "The Vouvray appellation growers' association: terroirs, growers and cellars.",
    },
  },
  {
    key: "vinsMontlouis",
    group: "terroir",
    url: "https://www.vinsmontlouissurloire.fr/",
    fr: {
      name: "AOC Montlouis-sur-Loire",
      detail:
        "Le site de l'appellation Montlouis-sur-Loire et de ses vignerons.",
    },
    en: {
      name: "AOC Montlouis-sur-Loire",
      detail:
        "The website of the Montlouis-sur-Loire appellation and its growers.",
    },
  },
  {
    key: "vinsCentreLoire",
    group: "terroir",
    url: "https://www.vins-centre-loire.com/fr/",
    fr: {
      name: "Vins du Centre-Loire",
      detail:
        "L'interprofession des vignobles du Berry : Quincy, Reuilly, Menetou-Salon, Sancerre.",
    },
    en: {
      name: "Vins du Centre-Loire",
      detail:
        "The wine board for the Berry vineyards: Quincy, Reuilly, Menetou-Salon, Sancerre.",
    },
  },
  {
    key: "maisonDesEtangs",
    group: "sologne",
    url: "https://www.maison-des-etangs.fr/",
    fr: {
      name: "Maison des Étangs, Saint-Viâtre",
      detail:
        "Horaires, tarifs et sorties nature de la maison thématique des étangs de Sologne.",
    },
    en: {
      name: "Maison des Étangs, Saint-Viâtre",
      detail:
        "Opening times, prices and nature outings of the Sologne ponds centre.",
    },
  },
  {
    key: "gameFair",
    group: "sologne",
    url: "https://www.gamefair.fr/",
    fr: {
      name: "Game Fair",
      detail:
        "Le site du salon de la chasse et de la nature de Lamotte-Beuvron : dates, billets et accès.",
    },
    en: {
      name: "Game Fair",
      detail:
        "The website of the hunting and countryside fair in Lamotte-Beuvron: dates, tickets and access.",
    },
  },
  {
    key: "chambordSpectacle",
    group: "chateaux",
    url: "https://www.chambord.org/fr/les-ecuries-de-chambord/spectacle-equestre/",
    fr: {
      name: "Spectacle équestre de Chambord",
      detail:
        "Dates, horaires et tarifs du spectacle des écuries du domaine national de Chambord.",
    },
    en: {
      name: "Chambord horse show",
      detail:
        "Dates, times and prices of the show at the stables of the Chambord national estate.",
    },
  },
  {
    key: "villandry",
    group: "chateaux",
    url: "https://www.chateauvillandry.fr/",
    fr: {
      name: "Château et jardins de Villandry",
      detail: "Horaires et tarifs du château et de ses jardins.",
    },
    en: {
      name: "Château and gardens of Villandry",
      detail: "Opening times and prices of the château and its gardens.",
    },
  },
  {
    key: "azayLeRideau",
    group: "chateaux",
    url: "https://www.azay-le-rideau.fr/",
    fr: {
      name: "Château d'Azay-le-Rideau",
      detail:
        "Le site du monument, géré par le Centre des monuments nationaux.",
    },
    en: {
      name: "Château d'Azay-le-Rideau",
      detail:
        "The monument's website, run by the Centre des monuments nationaux.",
    },
  },
  {
    key: "museesTours",
    group: "chateaux",
    url: "https://musees.tours.fr/",
    fr: {
      name: "Musées de Tours",
      detail:
        "Musée des Beaux-Arts, musée du Compagnonnage : horaires, tarifs et jours de fermeture.",
    },
    en: {
      name: "Museums of Tours",
      detail:
        "Fine arts museum, Musée du Compagnonnage: opening times, prices and closing days.",
    },
  },
  {
    key: "cathedraleBourges",
    group: "berry",
    url: "https://www.bourges-cathedrale.fr/",
    fr: {
      name: "Cathédrale de Bourges",
      detail: "Tour, crypte et horaires de la cathédrale Saint-Étienne.",
    },
    en: {
      name: "Bourges cathedral",
      detail: "Tower, crypt and opening times of Saint-Étienne cathedral.",
    },
  },
  {
    key: "palaisJacquesCoeur",
    group: "berry",
    url: "https://www.palais-jacques-coeur.fr/",
    fr: {
      name: "Palais Jacques-Cœur, Bourges",
      detail:
        "Horaires et tarifs du palais du XVe siècle, au centre de Bourges.",
    },
    en: {
      name: "Jacques-Cœur Palace, Bourges",
      detail:
        "Opening times and prices of the 15th-century palace in the centre of Bourges.",
    },
  },
  {
    key: "sauldreSologne",
    group: "berry",
    url: "https://www.aubigny-sologne.com/",
    fr: {
      name: "Office de tourisme Sauldre et Sologne",
      detail:
        "Aubigny-sur-Nère, Brinon-sur-Sauldre, Nançay : marchés, visites et villages du Cher.",
    },
    en: {
      name: "Sauldre et Sologne tourist office",
      detail:
        "Aubigny-sur-Nère, Brinon-sur-Sauldre, Nançay: markets, visits and villages of the Cher.",
    },
  },
  {
    key: "chateauSully",
    group: "berry",
    url: "https://www.chateausully.fr/",
    fr: {
      name: "Château de Sully-sur-Loire",
      detail: "Horaires, tarifs et visites du château, dans le Loiret.",
    },
    en: {
      name: "Château de Sully-sur-Loire",
      detail: "Opening times, prices and tours of the château, in the Loiret.",
    },
  },
  {
    key: "maisonVinsCheverny",
    group: "terroir",
    url: "https://maisondesvinsdecheverny.fr/",
    fr: {
      name: "Maison des vins de Cheverny",
      detail:
        "Horaires et formules de dégustation de la maison des vins, face au château.",
    },
    en: {
      name: "Maison des vins de Cheverny",
      detail:
        "Opening times and tasting options at the wine centre opposite the château.",
    },
  },
  {
    key: "caveVouvray",
    group: "terroir",
    url: "https://cavedevouvray.com/",
    fr: {
      name: "Cave des Producteurs de Vouvray",
      detail: "Visites des caves et dégustations de la coopérative de Vouvray.",
    },
    en: {
      name: "Vouvray growers' cellar",
      detail: "Cellar tours and tastings at the Vouvray cooperative.",
    },
  },
  {
    key: "alcoolAuVolant",
    group: "terroir",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2881",
    fr: {
      name: "Alcool au volant, Service-Public.fr",
      detail:
        "Les taux autorisés et les sanctions, à lire avant une route des vins.",
    },
    en: {
      name: "Drink-driving rules, Service-Public.fr",
      detail:
        "Legal limits and penalties in France, worth reading before a wine route.",
    },
  },
  {
    key: "mairie-selles-sur-cher",
    group: "mairies",
    url: "https://www.selles-sur-cher.fr/",
    fr: {
      name: "Mairie de Selles-sur-Cher",
    },
    en: {
      name: "Selles-sur-Cher town hall",
    },
  },
  {
    key: "mairie-villefranche-sur-cher",
    group: "mairies",
    url: "https://www.villefranchesurcher.fr/",
    fr: {
      name: "Mairie de Villefranche-sur-Cher",
    },
    en: {
      name: "Villefranche-sur-Cher town hall",
    },
  },
  {
    key: "mairie-mennetou-sur-cher",
    group: "mairies",
    url: "https://www.mennetou.fr/",
    fr: {
      name: "Mairie de Mennetou-sur-Cher",
    },
    en: {
      name: "Mennetou-sur-Cher town hall",
    },
  },
  {
    key: "mairie-saint-aignan",
    group: "mairies",
    url: "https://www.ville-staignan.fr/",
    fr: {
      name: "Mairie de Saint-Aignan",
    },
    en: {
      name: "Saint-Aignan town hall",
    },
  },
  {
    key: "mairie-montrichard-val-de-cher",
    group: "mairies",
    url: "https://www.montrichardvaldecher.com/",
    fr: {
      name: "Mairie de Montrichard Val de Cher",
    },
    en: {
      name: "Montrichard Val de Cher town hall",
    },
  },
  {
    key: "mairie-cheverny",
    group: "mairies",
    url: "https://mairie-cheverny.com/",
    fr: {
      name: "Mairie de Cheverny",
    },
    en: {
      name: "Cheverny town hall",
    },
  },
  {
    key: "mairie-bracieux",
    group: "mairies",
    url: "https://www.bracieux.fr/",
    fr: {
      name: "Mairie de Bracieux",
    },
    en: {
      name: "Bracieux town hall",
    },
  },
  {
    key: "mairie-blois",
    group: "mairies",
    url: "https://www.blois.fr/",
    fr: {
      name: "Mairie de Blois",
    },
    en: {
      name: "Blois town hall",
    },
  },
  {
    key: "mairie-neung-sur-beuvron",
    group: "mairies",
    url: "https://www.neung-sur-beuvron.fr/",
    fr: {
      name: "Mairie de Neung-sur-Beuvron",
    },
    en: {
      name: "Neung-sur-Beuvron town hall",
    },
  },
  {
    key: "mairie-saint-viatre",
    group: "mairies",
    url: "https://www.saint-viatre.fr/",
    fr: {
      name: "Mairie de Saint-Viâtre",
    },
    en: {
      name: "Saint-Viâtre town hall",
    },
  },
  {
    key: "mairie-chaumont-sur-tharonne",
    group: "mairies",
    url: "https://chaumont-sur-tharonne.fr/",
    fr: {
      name: "Mairie de Chaumont-sur-Tharonne",
    },
    en: {
      name: "Chaumont-sur-Tharonne town hall",
    },
  },
  {
    key: "mairie-nouan-le-fuzelier",
    group: "mairies",
    url: "https://www.nouan-le-fuzelier.fr/",
    fr: {
      name: "Mairie de Nouan-le-Fuzelier",
    },
    en: {
      name: "Nouan-le-Fuzelier town hall",
    },
  },
  {
    key: "mairie-lamotte-beuvron",
    group: "mairies",
    url: "https://www.lamotte-beuvron.fr/",
    fr: {
      name: "Mairie de Lamotte-Beuvron",
    },
    en: {
      name: "Lamotte-Beuvron town hall",
    },
  },
  {
    key: "mairie-pierrefitte-sur-sauldre",
    group: "mairies",
    url: "https://www.pierrefitte-sur-sauldre.fr/",
    fr: {
      name: "Mairie de Pierrefitte-sur-Sauldre",
    },
    en: {
      name: "Pierrefitte-sur-Sauldre town hall",
    },
  },
  {
    key: "mairie-souvigny-en-sologne",
    group: "mairies",
    url: "https://www.souvigny-en-sologne.fr/",
    fr: {
      name: "Mairie de Souvigny-en-Sologne",
    },
    en: {
      name: "Souvigny-en-Sologne town hall",
    },
  },
  {
    key: "mairie-villeny",
    group: "mairies",
    url: "https://www.villeny.fr/",
    fr: {
      name: "Mairie de Villeny",
    },
    en: {
      name: "Villeny town hall",
    },
  },
  {
    key: "mairie-valencay",
    group: "mairies",
    url: "https://www.valencay.fr/",
    fr: {
      name: "Mairie de Valençay",
    },
    en: {
      name: "Valençay town hall",
    },
  },
  {
    key: "mairie-vierzon",
    group: "mairies",
    url: "https://www.ville-vierzon.fr/",
    fr: {
      name: "Mairie de Vierzon",
    },
    en: {
      name: "Vierzon town hall",
    },
  },
  {
    key: "mairie-bourges",
    group: "mairies",
    url: "https://www.ville-bourges.fr/",
    fr: {
      name: "Mairie de Bourges",
    },
    en: {
      name: "Bourges town hall",
    },
  },
  {
    key: "mairie-aubigny-sur-nere",
    group: "mairies",
    url: "https://www.aubigny.net/",
    fr: {
      name: "Mairie de Aubigny-sur-Nère",
    },
    en: {
      name: "Aubigny-sur-Nère town hall",
    },
  },
  {
    key: "mairie-beaugency",
    group: "mairies",
    url: "https://beaugency.fr/",
    fr: {
      name: "Mairie de Beaugency",
    },
    en: {
      name: "Beaugency town hall",
    },
  },
  {
    key: "mairie-meung-sur-loire",
    group: "mairies",
    url: "https://meung-sur-loire.com/",
    fr: {
      name: "Mairie de Meung-sur-Loire",
    },
    en: {
      name: "Meung-sur-Loire town hall",
    },
  },
  {
    key: "mairie-amboise",
    group: "mairies",
    url: "https://www.ville-amboise.fr/",
    fr: {
      name: "Mairie de Amboise",
    },
    en: {
      name: "Amboise town hall",
    },
  },
  {
    key: "mairie-loches",
    group: "mairies",
    url: "https://www.ville-loches.fr/",
    fr: {
      name: "Mairie de Loches",
    },
    en: {
      name: "Loches town hall",
    },
  },
  {
    key: "mairie-tours",
    group: "mairies",
    url: "https://www.tours.fr/",
    fr: {
      name: "Mairie de Tours",
    },
    en: {
      name: "Tours town hall",
    },
  },
  {
    key: "mairie-vouvray",
    group: "mairies",
    url: "https://www.vouvray.fr/fr/",
    fr: {
      name: "Mairie de Vouvray",
    },
    en: {
      name: "Vouvray town hall",
    },
  },
  {
    key: "mairie-montlouis-sur-loire",
    group: "mairies",
    url: "https://www.ville-montlouis-loire.fr/",
    fr: {
      name: "Mairie de Montlouis-sur-Loire",
    },
    en: {
      name: "Montlouis-sur-Loire town hall",
    },
  },
  {
    key: "mairie-rochecorbon",
    group: "mairies",
    url: "https://www.mairie-rochecorbon.fr/",
    fr: {
      name: "Mairie de Rochecorbon",
    },
    en: {
      name: "Rochecorbon town hall",
    },
  },
  {
    key: "mairie-chenonceaux",
    group: "mairies",
    url: "https://www.chenonceaux.fr/",
    fr: {
      name: "Mairie de Chenonceaux",
    },
    en: {
      name: "Chenonceaux town hall",
    },
  },
  {
    key: "mairie-civray-de-touraine",
    group: "mairies",
    url: "https://www.civraydetouraine.fr/",
    fr: {
      name: "Mairie de Civray-de-Touraine",
    },
    en: {
      name: "Civray-de-Touraine town hall",
    },
  },
  {
    key: "mairie-chedigny",
    group: "mairies",
    url: "https://www.chedigny.fr/fr/",
    fr: {
      name: "Mairie de Chédigny",
    },
    en: {
      name: "Chédigny town hall",
    },
  },
  {
    key: "mairie-saint-dye-sur-loire",
    group: "mairies",
    url: "https://www.saint-dye-sur-loire.fr/",
    fr: {
      name: "Mairie de Saint-Dyé-sur-Loire",
    },
    en: {
      name: "Saint-Dyé-sur-Loire town hall",
    },
  },
  {
    key: "mairie-vineuil",
    group: "mairies",
    url: "https://www.vineuil41.fr/",
    fr: {
      name: "Mairie de Vineuil",
    },
    en: {
      name: "Vineuil town hall",
    },
  },
  {
    key: "mairie-vendome",
    group: "mairies",
    url: "https://www.vendome.eu/",
    fr: {
      name: "Mairie de Vendôme",
    },
    en: {
      name: "Vendôme town hall",
    },
  },
  {
    key: "mairie-sigloy",
    group: "mairies",
    url: "https://www.sigloy.fr/",
    fr: {
      name: "Mairie de Sigloy",
    },
    en: {
      name: "Sigloy town hall",
    },
  },
  {
    key: "mairie-sully-sur-loire",
    group: "mairies",
    url: "https://www.sully-sur-loire.fr/",
    fr: {
      name: "Mairie de Sully-sur-Loire",
    },
    en: {
      name: "Sully-sur-Loire town hall",
    },
  },
  {
    key: "mairie-reuilly",
    group: "mairies",
    url: "https://www.reuilly.fr/",
    fr: {
      name: "Mairie de Reuilly",
    },
    en: {
      name: "Reuilly town hall",
    },
  },
  {
    key: "mairie-issoudun",
    group: "mairies",
    url: "https://www.issoudun.fr/",
    fr: {
      name: "Mairie de Issoudun",
    },
    en: {
      name: "Issoudun town hall",
    },
  },
  {
    key: "mairie-mehun-sur-yevre",
    group: "mairies",
    url: "https://www.ville-mehun-sur-yevre.fr/",
    fr: {
      name: "Mairie de Mehun-sur-Yèvre",
    },
    en: {
      name: "Mehun-sur-Yèvre town hall",
    },
  },
  {
    key: "mairie-menetou-salon",
    group: "mairies",
    url: "https://www.menetou-salon.fr/",
    fr: {
      name: "Mairie de Menetou-Salon",
    },
    en: {
      name: "Menetou-Salon town hall",
    },
  },
  {
    key: "mairie-clery-saint-andre",
    group: "mairies",
    url: "https://www.clery-saint-andre.com/",
    fr: {
      name: "Mairie de Cléry-Saint-André",
    },
    en: {
      name: "Cléry-Saint-André town hall",
    },
  },
];

export const THEME_OFFICIAL_SITES: Record<
  Exclude<PlaceCategory, "pratique">,
  string[]
> = {
  chateaux: ["chateaux", "loirEtCher", "bloisChambord", "unesco"],
  equestre: ["ffe", "sologne", "loirEtCher"],
  famille: ["loirEtCher", "sudValDeLoire", "sologne"],
  nature: ["sologne", "natura2000", "sologneVelo", "canalDeBerry"],
  villages: ["sologne", "loirEtCher", "berryProvince", "loiret"],
  terroir: ["vinsCheverny", "vinsDeLoire", "vinsVouvray", "vinsCentreLoire"],
  loire: ["bloisChambord", "toursTourisme", "loiret", "unesco"],
  romorantin: ["romorantin", "sologne", "ccrm", "remi"],
};
