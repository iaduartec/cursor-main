import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

async function main() {
  const connectionString = process.env.DATABASE_URL!;
  const sql = neon(connectionString);
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("✅ Migraciones aplicadas");
}

main().catch((err) => {
  console.error("❌ Error migrando:", err);
  process.exit(1);
});
