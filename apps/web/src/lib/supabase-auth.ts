/**
 * Supabase magic-link auth scaffold for AUTH_MODE=supabase.
 * Wire @supabase/ssr when the bench database moves off clerk + prisma.
 */

export function isSupabaseAuth(): boolean {
  return process.env.AUTH_MODE === "supabase";
}

export function getSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
    appUrl: process.env.APP_URL?.trim() ?? process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseEnv();
  return Boolean(url && anonKey);
}

export async function sendMagicLink(email: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "supabase env not configured" };
  }

  // TODO: createServerClient + auth.signInWithOtp after @supabase/ssr is added
  // existence check against partners/clients tables before sending
  void email;
  return { ok: false, error: "supabase auth not wired yet" };
}

export async function exchangeAuthCode(code: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "supabase env not configured" };
  }

  void code;
  return { ok: false, error: "supabase callback not wired yet" };
}
