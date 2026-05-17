import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING;

if (!connectionString) {
  throw new Error(
    "Database URL missing. Set DATABASE_URL (recommended) or NEXT_PUBLIC_DATABASE_CONNECTION_STRING in .env or .env.local"
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: connectionString,
  },
});
