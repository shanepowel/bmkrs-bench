import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";
import { resolveDatabaseUrl } from "./src/database-url";

const root = path.dirname(fileURLToPath(import.meta.url));

// Local monorepo: apps/web/.env or packages/database/.env
loadEnv({ path: path.join(root, ".env") });
loadEnv({ path: path.join(root, "../../apps/web/.env") });

/**
 * Vercel/CI run `prisma generate` during `npm install` before DATABASE_URL exists.
 * A placeholder is enough — generate only reads the schema, not the database.
 */
const databaseUrl =
  resolveDatabaseUrl() ??
  "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder?schema=public";

export default defineConfig({
  schema: path.join(root, "prisma/schema.prisma"),
  migrations: {
    path: path.join(root, "prisma/migrations"),
  },
  datasource: {
    url: databaseUrl,
  },
});
