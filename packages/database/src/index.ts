import { PrismaPg } from "@prisma/adapter-pg";
import type { PoolConfig } from "pg";
import { PrismaClient } from "../generated/client";
import { DATABASE_URL_ENV_KEYS, resolveDatabaseUrl } from "./database-url";

export {
  DATABASE_URL_ENV_KEYS,
  isDatabaseUrlConfigured,
  listConfiguredDatabaseEnvKeys,
  resolveDatabaseEnvKey,
  resolveDatabaseUrl,
} from "./database-url";

function isLocalPostgresHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function normalizeDatabaseUrl(raw: string): string {
  try {
    const url = new URL(raw.replace(/^postgresql:/, "postgres:"));
    const isLocalPostgres =
      isLocalPostgresHost(url.hostname) &&
      (url.port === "5432" || url.port === "");
    // pgbouncer=true is for Prisma dev / Neon pooler — not plain Docker Postgres
    if (isLocalPostgres && url.searchParams.get("pgbouncer") === "true") {
      url.searchParams.delete("pgbouncer");
      return url.toString().replace(/^postgres:/, "postgresql:");
    }
  } catch {
    /* keep raw */
  }
  return raw;
}

function poolConfig(): PoolConfig {
  const raw = resolveDatabaseUrl();
  if (!raw) {
    throw new Error(
      `Database URL is not set (set one of: ${DATABASE_URL_ENV_KEYS.join(", ")})`
    );
  }
  const connectionString = normalizeDatabaseUrl(raw);
  const url = new URL(connectionString.replace(/^postgresql:/, "postgres:"));
  const usesPooler = url.searchParams.get("pgbouncer") === "true";
  const isLocal = isLocalPostgresHost(url.hostname);

  const config: PoolConfig = {
    connectionString,
    // Prisma v7 pg defaults idleTimeout to 10s — too aggressive for Next.js dev
    idleTimeoutMillis: 300_000,
    connectionTimeoutMillis: 5_000,
    keepAlive: true,
    max: usesPooler ? 5 : 10,
  };

  // Prisma 7 @prisma/adapter-pg uses node-pg with stricter TLS than the old Rust engine.
  // Neon on Vercel (POSTGRES_PRISMA_URL) otherwise fails: self-signed certificate in chain.
  if (!isLocal) {
    config.ssl =
      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true"
        ? { rejectUnauthorized: true }
        : { rejectUnauthorized: false };
  }

  return config;
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg(poolConfig(), {
    onPoolError: (err) => {
      console.error("[@bench/database] pg pool error:", err);
    },
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/** Singleton Prisma client (survives Next.js hot reload via globalThis). */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
});

export * from "../generated/client";
