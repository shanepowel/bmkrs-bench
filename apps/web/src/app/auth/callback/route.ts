import { NextResponse } from "next/server";
import { routes } from "@/lib/routes";
import { exchangeAuthCode, isSupabaseAuth } from "@/lib/supabase-auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (code && isSupabaseAuth()) {
    const result = await exchangeAuthCode(code);
    if (!result.ok) {
      return NextResponse.redirect(new URL(routes.login, url.origin));
    }
  }

  return NextResponse.redirect(new URL(routes.dashboardHome, url.origin));
}
