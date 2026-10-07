import { describe, expect, test } from "bun:test";
import { contactSchema } from "@/components/contact/contact-schema";

const message = {
  name: "Claire Martin",
  email: "claire@example.com",
  phone: "",
  arrival: "",
  departure: "",
  message: "Bonjour, le gîte est-il libre en juillet ?",
};

describe("contactSchema", () => {
  test("accepts a message without phone or dates when both are optional", () => {
    const schema = contactSchema({ phone: "optional", dates: "optional" });

    expect(schema.safeParse(message).success).toBe(true);
  });

  test("refuses a message without the fields the hosts made mandatory", () => {
    const schema = contactSchema({ phone: "required", dates: "required" });
    const result = schema.safeParse(message);

    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "phoneRequired",
      "arrivalRequired",
      "departureRequired",
    ]);
  });

  test("still checks the format of a mandatory phone number", () => {
    const schema = contactSchema({ phone: "required", dates: "optional" });
    const result = schema.safeParse({ ...message, phone: "appelez-moi" });

    expect(result.error?.issues[0]?.message).toBe("phoneInvalid");
  });

  test("drops whatever is posted in a field the hosts no longer ask for", () => {
    const schema = contactSchema({ phone: "hidden", dates: "hidden" });
    const result = schema.safeParse({
      ...message,
      phone: "not a phone",
      arrival: "x".repeat(500),
      departure: "yesterday",
    });

    expect(result.data).toMatchObject({
      phone: "",
      arrival: "",
      departure: "",
    });
  });

  test.each([
    ["2026-10-06", "2026-10-09", "arrival", "arrivalPast"],
    ["2026-10-12", "", "departure", "departureRequired"],
    ["", "2026-10-15", "arrival", "arrivalRequired"],
    ["2026-10-12", "2026-10-12", "departure", "departureBeforeArrival"],
    ["2026-02-31", "2026-03-02", "arrival", "dateInvalid"],
    ["12 au 15 juillet", "", "arrival", "dateInvalid"],
  ])("refuses the stay %s to %s on %s", (arrival, departure, field, code) => {
    const schema = contactSchema(
      { phone: "optional", dates: "optional" },
      "2026-10-07",
    );
    const result = schema.safeParse({ ...message, arrival, departure });

    expect(result.error?.issues).toMatchObject([
      { path: [field], message: code },
    ]);
  });

  test("accepts a stay that starts today", () => {
    const schema = contactSchema(
      { phone: "optional", dates: "required" },
      "2026-10-07",
    );
    const stay = { arrival: "2026-10-07", departure: "2026-10-09" };

    expect(schema.safeParse({ ...message, ...stay }).success).toBe(true);
  });
});
