import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env or .env.local for Drizzle CLI."
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
