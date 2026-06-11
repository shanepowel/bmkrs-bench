import { cookies } from "next/headers";

export type BenchRole = "partner" | "client" | "studio";
export type BenchSession = { email: string; role: BenchRole; name: string };

export const BENCH_SESSION_COOKIE = "bench-session";

export function inferDevRole(email: string): BenchRole {
  const lower = email.toLowerCase();
  if (lower.includes("studio") || lower.includes("shane")) return "studio";
  if (lower.includes("client")) return "client";
  return "partner";
}

export async function createBenchSession(email: string) {
  const role = inferDevRole(email);
  const name = email.split("@")[0].replace(/[._]/g, " ");
  const session: BenchSession = { email: email.toLowerCase(), role, name };
  (await cookies()).set(BENCH_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getBenchSession(): Promise<BenchSession | null> {
  try {
    const raw = (await cookies()).get(BENCH_SESSION_COOKIE)?.value;
    return raw ? (JSON.parse(raw) as BenchSession) : null;
  } catch {
    return null;
  }
}

export async function destroyBenchSession() {
  (await cookies()).delete(BENCH_SESSION_COOKIE);
}
