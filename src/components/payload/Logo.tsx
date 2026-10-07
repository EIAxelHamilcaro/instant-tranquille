import { Heron } from "./Heron";

const POND_RINGS = [22, 40, 64, 96, 140, 200, 280];

export default function Logo() {
  return (
    <div className="lit-enseigne">
      <svg className="lit-etang" viewBox="-300 -80 600 160" aria-hidden="true">
        {POND_RINGS.map((radius) => (
          <ellipse key={radius} rx={radius} ry={radius / 4} />
        ))}
      </svg>
      <Heron className="lit-heron" />
      <p className="lit-nom">L&apos;Instant Tranquille</p>
    </div>
  );
}
