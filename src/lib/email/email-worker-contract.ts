import { z } from "zod";

export const EMAIL_WORKER_SECRET_MIN_LENGTH = 32;

const singleLine = z
  .string()
  .trim()
  .min(1)
  .regex(/^[^\p{Cc}\p{Zl}\p{Zp}]*$/u, "must not contain control characters");

const address = z.email().max(320);

export const emailWorkerRequestSchema = z
  .strictObject({
    to: z.array(address).min(1).max(5).optional(),
    replyTo: address.optional(),
    subject: singleLine.max(400),
    text: z.string().min(1).max(20_000).optional(),
    html: z.string().min(1).max(100_000).optional(),
  })
  .refine(({ text, html }) => text !== undefined || html !== undefined, {
    message: "text or html is required",
    path: ["text"],
  });

export type EmailWorkerRequest = z.infer<typeof emailWorkerRequestSchema>;

export const emailWorkerResponseSchema = z.object({
  accepted: z.number().int().nonnegative(),
  rejected: z.array(z.object({ code: z.string(), message: z.string() })),
});

export type EmailWorkerResponse = z.infer<typeof emailWorkerResponseSchema>;

export const emailWorkerErrorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});
