"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Health = {
  ok?: boolean;
  database?: string;
  databaseEnv?: string | null;
  databaseKeysFound?: string[];
  databaseError?: string;
  clerk?: string;
  clerkMissing?: string[];
  clerkKeysFound?: string[];
  clerkHint?: string;
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    console.error(error);
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-serif text-2xl text-slate-900">Something went wrong</h1>
      <p className="mt-3 text-sm text-slate-600">
        Check Vercel → Settings → Environment Variables, then redeploy.
      </p>

      {health && (
        <ul className="mt-6 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm">
          <li>
            Database:{" "}
            <strong className={health.database === "ok" ? "text-green-700" : "text-amber-700"}>
              {health.database ?? "unknown"}
            </strong>
            {health.databaseEnv && (
              <span className="block text-xs text-slate-500">Using env: {health.databaseEnv}</span>
            )}
            {health.databaseKeysFound && health.databaseKeysFound.length > 0 && (
              <span className="block text-xs text-slate-500">
                Keys found: {health.databaseKeysFound.join(", ")}
              </span>
            )}
            {health.database === "error" && health.databaseError && (
              <span className="block text-xs text-red-600">{health.databaseError}</span>
            )}
            {health.database !== "ok" && (
              <span className="block text-xs text-slate-500">
                Connect Neon to this Vercel project (Production) or set DATABASE_URL /
                DATABASE_URL_UNPOOLED, then redeploy.
              </span>
            )}
          </li>
          <li>
            Clerk:{" "}
            <strong
              className={health.clerk === "configured" ? "text-green-700" : "text-amber-700"}
            >
              {health.clerk ?? "unknown"}
            </strong>
            {health.clerkKeysFound && health.clerkKeysFound.length > 0 && (
              <span className="block text-xs text-slate-500">
                Keys found: {health.clerkKeysFound.join(", ")}
              </span>
            )}
            {health.clerkHint && (
              <span className="block text-xs text-amber-700">{health.clerkHint}</span>
            )}
            {health.clerk !== "configured" && (
              <span className="block text-xs text-slate-500">
                {health.clerkMissing?.length
                  ? `Missing: ${health.clerkMissing.join(", ")}`
                  : "Set both NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in Vercel → Production."}
              </span>
            )}
          </li>
        </ul>
      )}

      <p className="mt-4 text-xs text-slate-500">{error.message}</p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Home
        </Link>
        <Link
          href="/api/health"
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Health check
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-slate-400">Reference: {error.digest}</p>
      )}
    </div>
  );
}
