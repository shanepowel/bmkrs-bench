"use client";

import { SignIn } from "@clerk/nextjs";
import { BenchEntryNavInk } from "@/components/bench-entry-nav";
import { C, Kicker, mono } from "@/lib/bench-ui";
import { routes } from "@/lib/routes";

export function ClerkLoginPanel() {
  return (
    <main style={{ background: C.ink, color: C.inkText }} className="min-h-dvh px-6 py-16">
      <div className="mx-auto w-full max-w-[460px]">
        <BenchEntryNavInk context="login" />
        <p className="mb-6 text-4xl font-medium" style={{ letterSpacing: "-0.02em" }}>
          bmkrs
          <span
            aria-hidden
            className="ml-[2px] inline-block h-[0.13em] w-[0.13em] rounded-full align-baseline"
            style={{ background: C.orange }}
          />
        </p>
        <Kicker surface="ink">member login</Kicker>
        <p style={{ ...mono, color: C.inkFaint }} className="mb-8 text-[12px]">
          partners, clients and studio — sign in to the bench.
        </p>
        <SignIn routing="path" path={routes.login} signUpUrl={routes.signUp()} />
      </div>
    </main>
  );
}
