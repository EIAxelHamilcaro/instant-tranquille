interface GuestFavouriteProps {
  label: string;
  compact?: boolean;
}

const LEAVES = [
  { x: 4.3, y: 15.6, turn: -58 },
  { x: 2.6, y: 12.1, turn: -42 },
  { x: 2, y: 8.3, turn: -24 },
  { x: 2.5, y: 4.7, turn: -6 },
  { x: 4.5, y: 1.9, turn: 22 },
  { x: 7.3, y: 14.6, turn: 18 },
  { x: 6.3, y: 10.9, turn: 30 },
  { x: 6.2, y: 7.2, turn: 40 },
];

function Laurel() {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 20">
      <path d="M8.6 19.6C4.6 16.6 3.2 10.6 5.2 3.4" />
      {LEAVES.map(({ x, y, turn }) => (
        <ellipse
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          rx="0.95"
          ry="2.15"
          transform={`rotate(${turn} ${x} ${y})`}
        />
      ))}
    </svg>
  );
}

export function GuestFavourite({
  label,
  compact = false,
}: GuestFavouriteProps) {
  return (
    <span className="coup-de-coeur">
      <Laurel />
      <span className={compact ? "sr-only" : undefined}>{label}</span>
      <Laurel />
    </span>
  );
}
