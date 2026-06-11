import { NextResponse } from "next/server";
import { getClerkDiagnostics, getDatabaseDiagnostics } from "@/lib/env";

export async function GET() {
  const dbDiag = getDatabaseDiagnostics();
  const clerkDiag = getClerkDiagnostics();

  let database = "not_configured" as "ok" | "error" | "not_configured";
  let databaseError: string | undefined;

  if (dbDiag.configured) {
    try {
      const { prisma } = await import("@bench/database");
      await prisma.$queryRaw`SELECT 1`;
      database = "ok";
    } catch (err) {
      database = "error";
      databaseError = err instanceof Error ? err.message : "connection failed";
    }
  }

  const ok = database === "ok" && clerkDiag.configured;

  return NextResponse.json(
    {
      ok,
      app: "freelancenearme-web",
      database,
      databaseEnv: dbDiag.activeKey ?? null,
      databaseKeysFound: dbDiag.keysFound,
      ...(databaseError ? { databaseError } : {}),
      clerk: clerkDiag.configured ? "configured" : "not_configured",
      clerkKeysFound: clerkDiag.keysFound,
      clerkMissing: clerkDiag.missing,
      ...(clerkDiag.hint ? { clerkHint: clerkDiag.hint } : {}),
    },
    { status: ok ? 200 : 503 }
  );
}
