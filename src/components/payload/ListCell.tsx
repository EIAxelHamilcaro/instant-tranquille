interface ListCellProps {
  cellData?: unknown;
  yes?: string;
  no?: string;
  suffix?: string;
}

export default function ListCell({ cellData, yes, no, suffix }: ListCellProps) {
  if (suffix)
    return typeof cellData === "number" ? `${cellData} ${suffix}` : null;

  const label = cellData === true ? yes : no;
  if (!label) return null;

  return (
    <span className="lit-etat" data-etat={cellData === true ? "oui" : "non"}>
      {label}
    </span>
  );
}
