import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { readEmailConfig } from "@/lib/email/email-config";
import { sendEmail } from "@/lib/email/send-email";

const config = {
  workerUrl: "https://email.example.workers.dev",
  workerSecret: "s".repeat(40),
};
const message = { subject: "Bonjour", text: "Un message" };

const fetchSpy = spyOn(globalThis, "fetch");

afterEach(() => fetchSpy.mockReset());

describe("sendEmail", () => {
  test("given an accepting worker, when an email is sent, then the secret travels as a bearer and the outcome is returned", async () => {
    fetchSpy.mockResolvedValue(Response.json({ accepted: 1, rejected: [] }));

    const outcome = await sendEmail(message, config);

    const [url, init] = fetchSpy.mock.calls[0] ?? [];
    expect(url).toBe(config.workerUrl);
    expect(new Headers(init?.headers).get("authorization")).toBe(
      `Bearer ${config.workerSecret}`,
    );
    expect(outcome).toEqual({ accepted: 1, rejected: [] });
  });

  test("given a refusing worker, when an email is sent, then the failure carries the status and the worker's reason", async () => {
    fetchSpy.mockResolvedValue(
      Response.json(
        {
          error: { code: "UNAUTHORIZED", message: "A valid secret is needed" },
        },
        { status: 401 },
      ),
    );

    await expect(sendEmail(message, config)).rejects.toThrow(
      "Email worker answered 401 (UNAUTHORIZED: A valid secret is needed)",
    );
  });

  test("given a subject with a line break, when an email is sent, then nothing leaves the server", async () => {
    await expect(
      sendEmail({ ...message, subject: "Bonjour\nBcc: x@example.org" }, config),
    ).rejects.toThrow();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("readEmailConfig", () => {
  test("given no email variable, when the config is read, then email is simply off", () => {
    expect(readEmailConfig({})).toBeNull();
  });

  test("given a URL without its secret, when the config is read, then the misconfiguration is reported", () => {
    expect(() =>
      readEmailConfig({ EMAIL_WORKER_URL: config.workerUrl }),
    ).toThrow("Email is misconfigured");
  });
});
