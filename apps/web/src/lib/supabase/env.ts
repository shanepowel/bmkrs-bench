export function isSupabaseAuth(): boolean {
  return process.env.AUTH_MODE === "supabase";
}

export function getSupabaseEnv() {
  const vercelUrl = process.env.VERCEL_URL?.trim();
  const appUrl = process.env.APP_URL?.trim();
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
    appUrl: appUrl ?? (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3001"),
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseEnv();
  return Boolean(url && anonKey);
}
