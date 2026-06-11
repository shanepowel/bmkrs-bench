import { isDatabaseConfigured } from "@/lib/env";

/** Run a Prisma query; return fallback when DB is missing or unreachable. */
export async function safeDbQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDatabaseConfigured()) return fallback;
  try {
    return await fn();
  } catch (error) {
    console.error("[db]", error);
    return fallback;
  }
}
