import { FAR_TREES, NEAR_TREES, PINES, REED_BED } from "@/lib/scenery";

type SeamKind = "arbres" | "rive" | "pins";

interface SeamShape {
  viewBox: string;
  far: string;
  near: string;
  tiles: number;
}

const TILE_WIDTH = 1600;

const SHAPES: Record<SeamKind, SeamShape> = {
  arbres: {
    viewBox: "0 170 2400 130",
    far: FAR_TREES,
    near: NEAR_TREES,
    tiles: 2,
  },
  rive: {
    viewBox: "0 170 1600 130",
    far: FAR_TREES,
    near: REED_BED,
    tiles: 1,
  },
  pins: {
    viewBox: "0 110 3200 190",
    far: PINES,
    near: REED_BED,
    tiles: 2,
  },
};

interface SeamProps {
  kind: SeamKind;
}

export function Seam({ kind }: SeamProps) {
  const { viewBox, far, near, tiles } = SHAPES[kind];
  const offsets = Array.from(
    { length: tiles },
    (_, tile) => `translate(${tile * TILE_WIDTH} 0)`,
  );

  return (
    <div className={`raccord raccord-${kind}`} aria-hidden="true">
      <svg aria-hidden="true" viewBox={viewBox}>
        <g className="raccord-lointain">
          {offsets.map((offset) => (
            <path key={offset} d={far} transform={offset} />
          ))}
        </g>
        {offsets.map((offset) => (
          <path key={offset} d={near} transform={offset} />
        ))}
      </svg>
    </div>
  );
}
