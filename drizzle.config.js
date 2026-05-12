import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_JRalp4nz0DSt@ep-noisy-night-apt340ir.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require",
  },
});
