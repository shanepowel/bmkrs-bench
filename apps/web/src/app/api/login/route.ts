import { NextResponse } from "next/server";
import { createBenchSession } from "@/lib/bench-session";
import { isBenchDevAuth } from "@/lib/env-clerk";
import { routes } from "@/lib/routes";

export async function POST(req: Request) {
  if (!isBenchDevAuth()) {
    return NextResponse.json({ error: "clerk auth is configured" }, { status: 403 });
  }

  const { email } = await req.json().catch(() => ({}));
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "no email" }, { status: 400 });
  }

  await createBenchSession(email.toLowerCase());
  return NextResponse.json({ ok: true, mode: "dev", redirect: routes.dashboardHome });
}
