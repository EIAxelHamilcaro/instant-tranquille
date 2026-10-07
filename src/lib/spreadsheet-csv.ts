const QUOTE = '"';
const NEEDS_QUOTES = /[;"\r\n]/;

function parseCsv(csv: string) {
  const rows: string[][] = [[]];
  let field = "";
  let isQuoted = false;

  const endField = () => {
    rows.at(-1)?.push(field);
    field = "";
  };

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (isQuoted) {
      if (character !== QUOTE) field += character;
      else if (csv[index + 1] === QUOTE) {
        field += QUOTE;
        index += 1;
      } else isQuoted = false;
    } else if (character === QUOTE) isQuoted = true;
    else if (character === ",") endField();
    else if (character === "\n") {
      endField();
      rows.push([]);
    } else if (character !== "\r") field += character;
  }

  if (field || rows.at(-1)?.length) endField();

  return rows.filter((row) => row.length > 0);
}

const cell = (value: string) =>
  NEEDS_QUOTES.test(value)
    ? `${QUOTE}${value.replaceAll(QUOTE, QUOTE + QUOTE)}${QUOTE}`
    : value;

export const withSemicolons = (csv: string) =>
  parseCsv(csv)
    .map((row) => row.map(cell).join(";"))
    .join("\r\n");
