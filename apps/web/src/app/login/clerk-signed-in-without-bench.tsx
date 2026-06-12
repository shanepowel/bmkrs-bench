"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { C, Kicker, mono } from "@/lib/bench-ui";
import { routes } from "@/lib/routes";

/** Shown when Clerk has a session but no bench user — breaks /dashboard ↔ /login loops. */
export function ClerkSignedInWithoutBench() {
  return (
    <main style={{ background: C.ink, color: C.inkText }} className="min-h-dvh px-6 py-16">
      <div className="mx-auto w-full max-w-[460px]">
        <Kicker surface="ink">member login</Kicker>
        <h1
          className="mt-4 font-medium"
          style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          signed in, but not on the bench.
        </h1>
        <p style={{ color: C.inkBody }} className="mt-6 max-w-[50ch] text-[15px] leading-relaxed">
          this account is not linked to the bench yet. if you applied recently, give us a day. if
          you meant to join, start there.
        </p>
        <p className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={routes.join}
            className="inline-block rounded-full px-6 py-3 text-[14px] font-medium"
            style={{ background: C.orange, color: C.ink }}
          >
            apply to the bench
          </Link>
          <SignOutButton redirectUrl={routes.login}>
            <button
              type="button"
              style={{ ...mono, color: C.inkBody }}
              className="text-[13px] underline underline-offset-4"
            >
              sign out →
            </button>
          </SignOutButton>
        </p>
        <p style={{ ...mono, color: C.inkFaint }} className="mt-6 text-[12px]">
          think this is wrong? hello@bmkrs.com
        </p>
      </div>
    </main>
  );
}
