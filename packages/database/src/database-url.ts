/**
 * Resolve Postgres URL from standard or Vercel/Neon integration env names.
 * Neon on Vercel may inject DATABASE_URL, DATABASE_URL_UNPOOLED, POSTGRES_*, etc.
 */

/** Preferred order — first non-empty wins. */
export const DATABASE_URL_ENV_KEYS = [
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
  "NEON_DATABASE_URL",
  // Legacy prefixed names (if an old Neon link still injects them)
  "freelance_DATABASE_URL",
  "freelance_DATABASE_URL_UNPOOLED",
] as const;

const PLACEHOLDER_HOSTS = new Set(["127.0.0.1", "localhost", "placeholder"]);

function isPlaceholderUrl(raw: string): boolean {
  const v = raw.trim();
  if (!v || v.includes("placeholder@") || v.includes("user:password@")) return true;
  try {
    const url = new URL(v.replace(/^postgresql:/, "postgres:"));
    if (PLACEHOLDER_HOSTS.has(url.hostname)) return true;
  } catch {
    return false;
  }
  return false;
}

function looksLikePostgresUrl(value: string): boolean {
  const v = value.trim();
  return v.startsWith("postgres://") || v.startsWith("postgresql://");
}

/** Keys from the known list that are set to a non-placeholder URL. */
export function listConfiguredDatabaseEnvKeys(): string[] {
  const found: string[] = [];
  for (const key of DATABASE_URL_ENV_KEYS) {
    const value = process.env[key]?.trim();
    if (value && looksLikePostgresUrl(value) && !isPlaceholderUrl(value)) {
      found.push(key);
    }
  }
  return found;
}

/** Scan all env vars for Neon/Vercel-style postgres URLs (any naming). */
function scanEnvForDatabaseUrl(): { key: string; value: string } | undefined {
  for (const [key, value] of Object.entries(process.env)) {
    if (!value?.trim()) continue;
    const upper = key.toUpperCase();
    if (
      (upper.includes("DATABASE") || upper.includes("POSTGRES") || upper.includes("NEON")) &&
      looksLikePostgresUrl(value) &&
      !isPlaceholderUrl(value)
    ) {
      return { key, value: value.trim() };
    }
  }
  return undefined;
}

export function resolveDatabaseEnvKey(): string | undefined {
  for (const key of DATABASE_URL_ENV_KEYS) {
    const value = process.env[key]?.trim();
    if (value && looksLikePostgresUrl(value) && !isPlaceholderUrl(value)) {
      return key;
    }
  }
  return scanEnvForDatabaseUrl()?.key;
}

export function firstDatabaseEnvValue(): string | undefined {
  for (const key of DATABASE_URL_ENV_KEYS) {
    const value = process.env[key]?.trim();
    if (value && looksLikePostgresUrl(value) && !isPlaceholderUrl(value)) {
      return value;
    }
  }
  return scanEnvForDatabaseUrl()?.value;
}

export function isDatabaseUrlConfigured(): boolean {
  return Boolean(firstDatabaseEnvValue());
}

export function resolveDatabaseUrl(): string | undefined {
  const raw = firstDatabaseEnvValue();
  if (!raw) return undefined;

  try {
    const url = new URL(raw.replace(/^postgresql:/, "postgres:"));
    if (url.hostname.includes("-pooler") && !url.searchParams.has("pgbouncer")) {
      url.searchParams.set("pgbouncer", "true");
    }
    url.searchParams.delete("channel_binding");
    return url.toString().replace(/^postgres:/, "postgresql:");
  } catch {
    return raw;
  }
}
