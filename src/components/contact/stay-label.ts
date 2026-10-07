const DAY_MS = 86_400_000;

const monthOf = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  timeZone: "UTC",
});

function partsOf(day: string) {
  const date = new Date(`${day}T00:00:00Z`);
  const dayOfMonth = date.getUTCDate();

  return {
    time: date.getTime(),
    day: dayOfMonth === 1 ? "1er" : String(dayOfMonth),
    month: monthOf.format(date),
    year: date.getUTCFullYear(),
  };
}

export function stayLabel(arrival: string, departure: string) {
  if (!arrival || !departure) return "";

  const from = partsOf(arrival);
  const to = partsOf(departure);
  const nights = Math.round((to.time - from.time) / DAY_MS);
  const length = nights > 1 ? `${nights} nuits` : "1 nuit";
  const end = `${to.day} ${to.month} ${to.year}`;

  if (from.year !== to.year)
    return `du ${from.day} ${from.month} ${from.year} au ${end} (${length})`;
  if (from.month !== to.month)
    return `du ${from.day} ${from.month} au ${end} (${length})`;

  return `du ${from.day} au ${end} (${length})`;
}
