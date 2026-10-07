import type { SeedGuide } from "../guides";
import { guide as amboiseEtClosLuceDepuisRomorantin } from "./guides/amboise-et-clos-luce-depuis-romorantin";
import { guide as baladeEnBateauSurLaLoireDepuisLaSologne } from "./guides/balade-en-bateau-sur-la-loire-depuis-la-sologne";
import { guide as bourgesEnUneJourneeDepuisRomorantin } from "./guides/bourges-en-une-journee-depuis-romorantin";
import { guide as brameDuCerfEnSologne } from "./guides/brame-du-cerf-en-sologne";
import { guide as chateauxDeLaLoireDepuisRomorantin } from "./guides/chateaux-de-la-loire-depuis-romorantin";
import { guide as chateauxDeLaLoireEnMontgolfiere } from "./guides/chateaux-de-la-loire-en-montgolfiere";
import { guide as croisiereSousLeChateauDeChenonceau } from "./guides/croisiere-sous-le-chateau-de-chenonceau";
import { guide as etangsEtForetsDeSologne } from "./guides/etangs-et-forets-de-sologne";
import { guide as giteProcheChateauDeChambord } from "./guides/gite-proche-chateau-de-chambord";
import { guide as giteProcheZooparcDeBeauval } from "./guides/gite-proche-zooparc-de-beauval";
import { guide as giteSologneAvecChien } from "./guides/gite-sologne-avec-chien";
import { guide as golfEnSologne } from "./guides/golf-en-sologne";
import { guide as queFaireARomorantinLanthenay } from "./guides/que-faire-a-romorantin-lanthenay";
import { guide as queFaireEnSologneQuandIlPleut } from "./guides/que-faire-en-sologne-quand-il-pleut";
import { guide as routeDesVinsChevernyTouraineDepuisLaSologne } from "./guides/route-des-vins-cheverny-touraine-depuis-la-sologne";
import { guide as sologneAVelo } from "./guides/sologne-a-velo";
import { guide as sologneEnFamilleAvecEnfants } from "./guides/sologne-en-famille-avec-enfants";
import { guide as tourismeEquestreEnSologne } from "./guides/tourisme-equestre-en-sologne";
import { guide as toursEnUneJourneeDepuisRomorantin } from "./guides/tours-en-une-journee-depuis-romorantin";
import { guide as venirARomorantinLanthenay } from "./guides/venir-a-romorantin-lanthenay";
import { guide as vignoblesDuBerryQuincyReuillyMenetouSalon } from "./guides/vignobles-du-berry-quincy-reuilly-menetou-salon";
import { guide as villagesDeSologneAVoir } from "./guides/villages-de-sologne-a-voir";
import { guide as weekEndEnSologne } from "./guides/week-end-en-sologne";

export const GUIDES: SeedGuide[] = [
  brameDuCerfEnSologne,
  chateauxDeLaLoireDepuisRomorantin,
  etangsEtForetsDeSologne,
  giteProcheChateauDeChambord,
  giteProcheZooparcDeBeauval,
  giteSologneAvecChien,
  golfEnSologne,
  queFaireARomorantinLanthenay,
  sologneAVelo,
  sologneEnFamilleAvecEnfants,
  tourismeEquestreEnSologne,
  venirARomorantinLanthenay,
  weekEndEnSologne,
  amboiseEtClosLuceDepuisRomorantin,
  bourgesEnUneJourneeDepuisRomorantin,
  queFaireEnSologneQuandIlPleut,
  routeDesVinsChevernyTouraineDepuisLaSologne,
  villagesDeSologneAVoir,
  baladeEnBateauSurLaLoireDepuisLaSologne,
  croisiereSousLeChateauDeChenonceau,
  toursEnUneJourneeDepuisRomorantin,
  vignoblesDuBerryQuincyReuillyMenetouSalon,
  chateauxDeLaLoireEnMontgolfiere,
];

export const RETIRED_GUIDES: Record<string, string> = {
  "hebergement-cavaliers-lamotte-beuvron": "tourisme-equestre-en-sologne",
  "generali-open-de-france-ou-dormir": "tourisme-equestre-en-sologne",
  "game-fair-lamotte-beuvron-hebergement": "tourisme-equestre-en-sologne",
  "coucher-de-soleil-et-apero-sur-la-loire-en-bateau":
    "balade-en-bateau-sur-la-loire-depuis-la-sologne",
  "vouvray-et-montlouis-caves-a-visiter-depuis-romorantin":
    "route-des-vins-cheverny-touraine-depuis-la-sologne",
  "incontournables-centre-val-de-loire-depuis-romorantin":
    "chateaux-de-la-loire-depuis-romorantin",
};
