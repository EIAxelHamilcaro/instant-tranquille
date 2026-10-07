import type { Payload } from "payload";

export async function seedAdmin(payload: Payload) {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const { totalDocs } = await payload.count({ collection: "users" });

  if (totalDocs > 0) return;
  if (!email || !password) {
    console.warn(
      "No admin created: set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD, or create the first user at /admin.",
    );
    return;
  }

  await payload.create({ collection: "users", data: { email, password } });
  console.log(`Admin created: ${email}`);
}
