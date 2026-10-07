import { describe, expect, test } from "bun:test";
import { stayLabel } from "@/components/contact/stay-label";

describe("stayLabel", () => {
  test.each([
    ["2027-03-12", "2027-03-15", "du 12 au 15 mars 2027 (3 nuits)"],
    ["2027-03-28", "2027-04-02", "du 28 mars au 2 avril 2027 (5 nuits)"],
    [
      "2027-12-30",
      "2028-01-01",
      "du 30 décembre 2027 au 1er janvier 2028 (2 nuits)",
    ],
    ["2027-05-01", "2027-05-02", "du 1er au 2 mai 2027 (1 nuit)"],
  ])(
    "writes %s to %s the way the hosts read it",
    (arrival, departure, label) => {
      expect(stayLabel(arrival, departure)).toBe(label);
    },
  );

  test("stays empty when the traveller gave no dates", () => {
    expect(stayLabel("", "")).toBe("");
  });
});
