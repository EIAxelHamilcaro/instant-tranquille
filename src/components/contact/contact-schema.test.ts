import { describe, expect, test } from "bun:test";
import { contactSchema } from "@/components/contact/contact-schema";

const message = {
  name: "Claire Martin",
  email: "claire@example.com",
  phone: "",
  dates: "",
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
      "datesRequired",
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
      dates: "x".repeat(500),
    });

    expect(result.data).toMatchObject({ phone: "", dates: "" });
  });
});
