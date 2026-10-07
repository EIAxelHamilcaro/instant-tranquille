import { describe, expect, test } from "bun:test";
import { withSemicolons } from "@/lib/spreadsheet-csv";

describe("withSemicolons", () => {
  test("turns the comma file into the one a French spreadsheet opens in columns", () => {
    const mark = String.fromCharCode(0xfeff);
    const csv = `${mark}Nom,E-mail,Lu\nClaire Martin,claire@example.com,Oui\n`;

    expect(withSemicolons(csv)).toBe(
      `${mark}Nom;E-mail;Lu\r\nClaire Martin;claire@example.com;Oui`,
    );
  });

  test("keeps a message whole when it holds commas, quotes, semicolons and line breaks", () => {
    const csv =
      'Nom,Message\n"Martin, Claire","Bonjour ; nous serions ""quatre"",\navec un chien."\n';

    expect(withSemicolons(csv)).toBe(
      'Nom;Message\r\nMartin, Claire;"Bonjour ; nous serions ""quatre"",\navec un chien."',
    );
  });

  test("keeps empty cells in their column", () => {
    expect(withSemicolons("Nom,Téléphone,Dates\nClaire,,juillet\n")).toBe(
      "Nom;Téléphone;Dates\r\nClaire;;juillet",
    );
  });
});
