/** Canonical app origin for server-side self-fetch (e.g. /api/bench-public on Vercel). */
export function getAppBaseUrl(): string {
  const explicit = process.env.APP_URL?.trim() ?? process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3001";
}
