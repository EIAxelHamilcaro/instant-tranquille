import { Emblem } from "@/components/shared/Logo";
import {
  FarTrees,
  NearTrees,
  ReedBed,
  ReedTufts,
  Ripples,
} from "@/components/shared/Scenery";
import { Stag, type StagSequence } from "@/components/shared/Stag";
import {
  DRAGONFLY_BODY,
  DRAGONFLY_WINGS,
  FERN_BED,
  FERNS,
  FLOCK,
  HEATH,
  HEATH_BED,
  LEFT_REEDS,
  LILY_BLOOMS,
  LILY_PADS,
  PINES,
  RIGHT_REEDS,
  STARS,
  TRUNK_BRANCHES,
  TRUNKS,
} from "@/lib/scenery";
import { cn } from "@/lib/utils";

const BARK_SHARE = 0.55;

interface PondSceneProps {
  heron?: boolean;
}

interface ForestSceneProps {
  stag?: StagSequence;
}

interface CornerProps {
  className?: string;
}

function Sky() {
  return (
    <>
      <span className="berge-ciel">
        <span className="berge-soleil" />
      </span>
      <svg
        className="berge-vol"
        aria-hidden="true"
        viewBox="0 0 190 50"
        fill="none"
        strokeLinecap="round"
      >
        <path d={FLOCK} />
      </svg>
    </>
  );
}

function ReedCorner({ className }: CornerProps) {
  const right = Boolean(className);

  return (
    <svg
      className={cn("berge-coin", className)}
      aria-hidden="true"
      viewBox={right ? "0 0 240 420" : "0 0 300 520"}
      fill="none"
      strokeLinecap="round"
    >
      <ReedTufts reeds={right ? RIGHT_REEDS : LEFT_REEDS} />
    </svg>
  );
}

function FernCorner({ className }: CornerProps) {
  return (
    <svg
      className={cn("berge-coin berge-coin-fougere", className)}
      aria-hidden="true"
      viewBox="0 0 300 300"
      fill="none"
      strokeLinecap="round"
    >
      {FERNS.map((frond) => (
        <path key={frond} className="paysage-fronde" d={frond} />
      ))}
      <path className="paysage-bruyere" d={HEATH} />
    </svg>
  );
}

function Dragonfly() {
  return (
    <span className="berge-libellule">
      <svg
        aria-hidden="true"
        viewBox="0 0 40 24"
        fill="none"
        strokeLinecap="round"
      >
        {DRAGONFLY_WINGS.map((wing) => (
          <path key={wing} className="paysage-aile" d={wing} />
        ))}
        <path className="paysage-abdomen" d={DRAGONFLY_BODY} />
      </svg>
    </span>
  );
}

export function PondScene({ heron = false }: PondSceneProps) {
  return (
    <div className="berge berge-etang" aria-hidden="true">
      <div className="berge-horizon">
        <Sky />
        <svg
          className="berge-lisiere"
          aria-hidden="true"
          viewBox="0 0 1600 460"
        >
          <FarTrees />
          <NearTrees />
          <ReedBed />
          <g className="paysage-reflet">
            <FarTrees />
            <NearTrees />
            <ReedBed />
          </g>
        </svg>
        <svg
          className="berge-eau"
          aria-hidden="true"
          viewBox="0 0 1000 400"
          preserveAspectRatio="none"
          fill="none"
          strokeLinecap="round"
        >
          <Ripples />
        </svg>
        <svg
          className="berge-nenuphars"
          aria-hidden="true"
          viewBox="0 0 220 50"
        >
          <path className="paysage-nenuphar" d={LILY_PADS} />
          <path className="paysage-fleur" d={LILY_BLOOMS} />
        </svg>
        <span className="berge-brume" />
        <span className="berge-brume" />
        {heron ? (
          <Emblem
            className="heron-vif heron-vivant berge-heron"
            entrance="visible"
            scene="tableau"
          />
        ) : (
          <Dragonfly />
        )}
      </div>
      <ReedCorner />
      <ReedCorner className="berge-coin-droit" />
    </div>
  );
}

export function ForestScene({ stag }: ForestSceneProps) {
  return (
    <div className="berge berge-foret" aria-hidden="true">
      <div className="berge-horizon">
        <Sky />
        <svg
          className="berge-lisiere"
          aria-hidden="true"
          viewBox="0 0 1600 460"
        >
          <FarTrees />
          <path className="paysage-pins" d={PINES} />
        </svg>
        <span className="berge-brume" />
        {stag && <Stag className="berge-cerf" sequence={stag} />}
        <svg
          className="berge-lisiere"
          aria-hidden="true"
          viewBox="0 0 1600 460"
          fill="none"
          strokeLinecap="round"
        >
          <g className="paysage-futaie">
            {TRUNKS.map((trunk) => (
              <g key={trunk.d}>
                <path
                  className="paysage-tronc"
                  d={trunk.d}
                  strokeWidth={trunk.width}
                />
                <path
                  className="paysage-ecorce"
                  d={trunk.d}
                  strokeWidth={Number(trunk.width) * BARK_SHARE}
                  strokeDasharray={trunk.dashes}
                />
              </g>
            ))}
            <path className="paysage-branche" d={TRUNK_BRANCHES} />
          </g>
          <g className="paysage-sous-bois">
            <path className="paysage-fronde" d={FERN_BED} />
            <path className="paysage-bruyere" d={HEATH_BED} />
          </g>
        </svg>
        <span className="berge-brume" />
      </div>
      <FernCorner />
      <FernCorner className="berge-coin-droit" />
    </div>
  );
}

export function NightTreeline() {
  return (
    <div className="pied-lisiere" aria-hidden="true">
      <svg aria-hidden="true" viewBox="0 170 1600 130">
        <FarTrees />
        <NearTrees />
      </svg>
    </div>
  );
}

export function NightSky() {
  return (
    <div className="berge berge-nuit" aria-hidden="true">
      <svg
        className="berge-etoiles"
        aria-hidden="true"
        viewBox="0 0 1000 300"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
        strokeLinecap="round"
      >
        {STARS.map((stars) => (
          <path key={stars} className="paysage-etoile" d={stars} />
        ))}
      </svg>
      <span className="berge-lune" />
    </div>
  );
}
