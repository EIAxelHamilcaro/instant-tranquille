import { FarTrees, NearTrees, ReedTufts } from "@/components/shared/Scenery";
import { FLOCK, LEFT_REEDS } from "@/lib/scenery";
import { cn } from "@/lib/utils";

type SketchKind = "rive" | "vol" | "brin";
type SketchSide = "left" | "right";

const SIDE_CLASS: Record<SketchSide, string> = {
  left: "esquisse-gauche",
  right: "esquisse-droite",
};

interface SketchProps {
  kind: SketchKind;
  side?: SketchSide;
  above?: boolean;
}

export function Sketch({ kind, side = "right", above = false }: SketchProps) {
  return (
    <div
      className={cn(
        "esquisse",
        `esquisse-${kind}`,
        SIDE_CLASS[side],
        above && "esquisse-haut",
      )}
      aria-hidden="true"
    >
      {kind === "rive" && (
        <svg aria-hidden="true" viewBox="0 170 3200 130">
          <FarTrees />
          <NearTrees />
          <g transform="translate(1600 0)">
            <FarTrees />
            <NearTrees />
          </g>
        </svg>
      )}
      {kind === "vol" && (
        <svg
          aria-hidden="true"
          viewBox="0 0 190 50"
          fill="none"
          strokeLinecap="round"
        >
          <path d={FLOCK} />
        </svg>
      )}
      {kind === "brin" && (
        <svg
          aria-hidden="true"
          viewBox="0 0 300 520"
          fill="none"
          strokeLinecap="round"
        >
          <ReedTufts reeds={LEFT_REEDS} />
        </svg>
      )}
    </div>
  );
}
