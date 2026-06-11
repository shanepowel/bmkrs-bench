import { NextResponse } from "next/server";
import { routes } from "@/lib/routes";

/** Supabase magic-link landing. Inert until AUTH_MODE=supabase is wired. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (code) {
    // TODO supabase: exchangeCodeForSession(code)
  }
  return NextResponse.redirect(new URL(routes.dashboardHome, url.origin));
}
