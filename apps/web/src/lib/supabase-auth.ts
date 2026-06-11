import { prisma } from "@bench/database";
import { benchRoleFromUserRole, createBenchSession } from "@/lib/bench-session";
import { getSupabaseEnv, isSupabaseAuth, isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export { getSupabaseEnv, isSupabaseAuth, isSupabaseConfigured };

export async function sendMagicLink(email: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "supabase env not configured" };
  }

  const normalized = email.toLowerCase().trim();
  const benchUser = await prisma.user.findUnique({ where: { email: normalized } });
  if (!benchUser) {
    return { ok: false, error: "email not on the bench" };
  }

  const { appUrl } = getSupabaseEnv();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function exchangeAuthCode(code: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "supabase env not configured" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user?.email) {
    return { ok: false, error: error?.message ?? "no session" };
  }

  const benchUser = await prisma.user.findUnique({ where: { email: data.user.email.toLowerCase() } });
  if (!benchUser) {
    return { ok: false, error: "email not on the bench" };
  }

  const name = `${benchUser.firstName} ${benchUser.lastName}`.toLowerCase();
  await createBenchSession(benchUser.email, benchRoleFromUserRole(benchUser.role), name);
  return { ok: true };
}
