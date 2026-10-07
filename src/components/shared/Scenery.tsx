import {
  BIRCHES,
  FAR_TREES,
  GLINTS,
  NEAR_TREES,
  REED_BED,
  type Reeds,
  RIPPLES,
} from "@/lib/scenery";

export function FarTrees() {
  return <path className="paysage-lointain" d={FAR_TREES} />;
}

export function NearTrees() {
  return (
    <g className="paysage-proche">
      <path d={NEAR_TREES} />
      {BIRCHES.map((birch) => (
        <path
          key={birch.d}
          className="paysage-bouleau"
          d={birch.d}
          strokeWidth={birch.width}
          strokeDasharray={birch.dashes}
        />
      ))}
    </g>
  );
}

export function ReedBed() {
  return <path className="paysage-roseliere" d={REED_BED} />;
}

export function Ripples() {
  return (
    <>
      {RIPPLES.map((ripple) => (
        <path key={ripple} className="paysage-ride" d={ripple} />
      ))}
      <path className="paysage-eclat" d={GLINTS} />
    </>
  );
}

interface ReedTuftsProps {
  reeds: Reeds;
}

export function ReedTufts({ reeds }: ReedTuftsProps) {
  return (
    <>
      {reeds.tufts.map((tuft) => (
        <g key={tuft.stems} className="paysage-touffe">
          <path className="paysage-feuille" d={tuft.leaves} />
          <path className="paysage-tige" d={tuft.stems} />
          <path className="paysage-massette" d={tuft.cattails} />
        </g>
      ))}
      <path
        className="paysage-bruyere"
        d={reeds.heather}
        transform={reeds.heatherOffset}
      />
    </>
  );
}
