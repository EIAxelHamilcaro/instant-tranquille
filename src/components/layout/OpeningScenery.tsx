import {
  FarTrees,
  NearTrees,
  ReedBed,
  ReedTufts,
  Ripples,
} from "@/components/shared/Scenery";
import { BIRD, LEFT_REEDS, RIGHT_REEDS } from "@/lib/scenery";

export function OpeningScenery() {
  return (
    <div className="paysage" aria-hidden="true">
      <span className="paysage-soleil" />
      <svg
        className="paysage-oiseau"
        aria-hidden="true"
        viewBox="0 0 24 10"
        fill="none"
      >
        <path d={BIRD} />
      </svg>
      <svg className="paysage-rive" aria-hidden="true" viewBox="0 0 1600 460">
        <g id="paysage-lisiere">
          <FarTrees />
          <NearTrees />
          <ReedBed />
        </g>
        <use className="paysage-reflet" href="#paysage-lisiere" />
      </svg>
      <svg
        className="paysage-eau"
        aria-hidden="true"
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
        fill="none"
        strokeLinecap="round"
      >
        <Ripples />
      </svg>
      <span className="paysage-brume" />
      <span className="paysage-brume" />
      <span className="paysage-brume" />
      <span className="paysage-rond" />
      <svg
        className="paysage-roseaux paysage-roseaux-gauche"
        aria-hidden="true"
        viewBox="0 0 300 520"
        fill="none"
        strokeLinecap="round"
      >
        <ReedTufts reeds={LEFT_REEDS} />
      </svg>
      <svg
        className="paysage-roseaux paysage-roseaux-droite"
        aria-hidden="true"
        viewBox="0 0 240 420"
        fill="none"
        strokeLinecap="round"
      >
        <ReedTufts reeds={RIGHT_REEDS} />
      </svg>
      <span className="paysage-grain" />
    </div>
  );
}
