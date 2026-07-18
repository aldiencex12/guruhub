import { migrate } from "drizzle-orm/mysql2/migrator";
import { db } from "./index";

console.log("Starting database migration programmatically...");

try {
  await migrate(db, { migrationsFolder: "./migrations" });
  console.log("Database migration completed successfully!");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
}

process.exit(0);
