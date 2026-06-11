import { NextResponse } from "next/server";
import { destroyBenchSession } from "@/lib/bench-session";
import { routes } from "@/lib/routes";

export async function POST(req: Request) {
  await destroyBenchSession();
  return NextResponse.redirect(new URL(routes.login, req.url), 303);
}
