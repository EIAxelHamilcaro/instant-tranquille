import "dotenv/config";
import pg from "pg";

async function main() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log("Connected to database");
  await client.query("DROP SCHEMA public CASCADE");
  await client.query("CREATE SCHEMA public");
  console.log("Database reset — all tables dropped");
  await client.end();
}

main().catch((err) => {
  console.error("Reset failed:", err);
  process.exit(1);
});
