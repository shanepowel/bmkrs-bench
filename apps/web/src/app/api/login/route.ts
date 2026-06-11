import { NextResponse } from "next/server";
import { createBenchSession } from "@/lib/bench-session";
import { isBenchDevAuth } from "@/lib/env-clerk";
import { routes } from "@/lib/routes";
import { isSupabaseAuth, sendMagicLink } from "@/lib/supabase-auth";

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "no email" }, { status: 400 });
  }

  if (isSupabaseAuth()) {
    const result = await sendMagicLink(email.toLowerCase());
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.error.includes("not on") ? 404 : 503 });
    }
    return NextResponse.json({ ok: true, mode: "supabase" });
  }

  if (!isBenchDevAuth()) {
    return NextResponse.json({ error: "clerk auth is configured" }, { status: 403 });
  }

  await createBenchSession(email.toLowerCase());
  return NextResponse.json({ ok: true, mode: "dev", redirect: routes.dashboardHome });
}
