import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EntryChrome } from "@/components/entry-chrome";
import { C, mono, Kicker, PrimaryButton, Status, type StatusKind } from "@/lib/bench-ui";
import { getCurrentUser } from "@/lib/auth";
import { homeForRole } from "@/lib/bench";
import { getAppBaseUrl } from "@/lib/app-url";
import type { BenchPublicSlice } from "@/lib/bench-public-data";
import { getBenchPublicSlice } from "@/lib/bench-public-data";
import { isBenchDevAuth } from "@/lib/env";
import { marketingUrls } from "@/lib/marketing-urls";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "the bench | bmkrs.",
  description:
    "the bmkrs bench: a small network of trusted partners. apply to join, or hire from it. vetted by us, staffed by a human.",
  robots: { index: false, follow: false },
};

const TICKER = [
  "real briefs, real budgets",
  "a human reads every application",
  "no bidding, ever",
  "paid trials, never spec work",
  "history, not star ratings",
];

const PARTNER_STEPS = [
  {
    n: "01",
    t: "apply once, properly.",
    b: "your work, your disciplines, your rate band, two people who vouch for you. ten minutes, one time.",
  },
  {
    n: "02",
    t: "a human reads it.",
    b: "usually the same week, and you hear either way. sometimes a short paid trial brief comes first.",
  },
  {
    n: "03",
    t: "briefs find you.",
    b: "dates, rate, role. say yes, no, or ask a question. silence is a fine answer too.",
  },
  {
    n: "04",
    t: "the work becomes your record.",
    b: "completed projects build your track record. history, not stars.",
  },
];

const HIRER_STEPS = [
  {
    n: "01",
    t: "tell us the gap.",
    b: "discipline, dates, the shape of the work. a paragraph is plenty.",
  },
  {
    n: "02",
    t: "a human matches it.",
    b: "we know the bench personally. you get the right person, not a search result.",
  },
  {
    n: "03",
    t: "meet before you commit.",
    b: "a short call with the partner. if it is not right, we go again.",
  },
  {
    n: "04",
    t: "vetted, not vouched-for vaguely.",
    b: "every partner has references checked and a visible bmkrs track record.",
  },
];

async function getBench(): Promise<BenchPublicSlice | null> {
  try {
    const base = getAppBaseUrl();
    const res = await fetch(`${base}/api/bench-public`, { next: { revalidate: 3600 } });
    if (res.ok) return res.json() as Promise<BenchPublicSlice>;
  } catch {
    // self-fetch can fail locally without APP_URL
  }
  return getBenchPublicSlice();
}

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(isBenchDevAuth() ? routes.dashboardHome : homeForRole(user.role));
  }

  const bench = await getBench();

  return (
    <EntryChrome>
      <main>
      <section style={{ background: C.ink, color: C.inkText }}>
        <div className="mx-auto max-w-[1120px] px-6 pb-16 pt-16 md:px-10">
          <Kicker surface="ink">the bmkrs partner network</Kicker>
          <h1
            className="max-w-[16ch] font-medium"
            style={{ fontSize: "clamp(2.5rem,6vw,5.5rem)", lineHeight: 0.98, letterSpacing: "-0.02em" }}
          >
            one bench. two ways to sit at it.
          </h1>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl p-6" style={{ border: `1px solid ${C.inkRule}` }}>
              <p style={{ ...mono, color: C.inkFaint }} className="mb-3 text-[12px]">
                for partners
              </p>
              <h2 className="text-2xl font-medium">good at what you do?</h2>
              <p style={{ color: C.inkBody }} className="mt-2 mb-6 text-[15px] leading-relaxed">
                real briefs with real budgets when a project needs your discipline. no bidding, no
                race to the bottom, no being treated like inventory.
              </p>
              <PrimaryButton href={routes.join}>apply to the bench</PrimaryButton>
            </div>
            <div className="rounded-xl p-6" style={{ border: `1px solid ${C.inkRule}` }}>
              <p style={{ ...mono, color: C.inkFaint }} className="mb-3 text-[12px]">
                for studios + teams
              </p>
              <h2 className="text-2xl font-medium">need someone scary-good?</h2>
              <p style={{ color: C.inkBody }} className="mt-2 mb-6 text-[15px] leading-relaxed">
                hire from a small bench we actually know. references checked, track records visible,
                matched by a human, not an algorithm.
              </p>
              <Link
                href={routes.hire}
                className="inline-block rounded-full border px-6 py-3 text-[14px] font-medium transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none"
                style={{ borderColor: "rgba(241,239,232,0.4)", color: C.inkText }}
              >
                hire from the bench
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div
        aria-hidden
        className="overflow-hidden py-3"
        style={{
          background: C.ink,
          borderTop: `1px solid ${C.inkRule}`,
          borderBottom: `1px solid ${C.inkRule}`,
        }}
      >
        <div className="bench-ticker flex w-max gap-10 whitespace-nowrap">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} style={{ ...mono, color: C.inkFaint }} className="text-[12px]">
              {t} <span style={{ color: C.orange }}>·</span>
            </span>
          ))}
        </div>
      </div>

      <section style={{ background: C.paper, color: C.paperText }}>
        <div className="mx-auto max-w-[1120px] px-6 py-16 md:px-10">
          <Kicker>the bench, live</Kicker>
          <h2
            className="font-medium"
            style={{ fontSize: "clamp(1.75rem,3.2vw,2.75rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            this is the actual product. names off, everything else real.
          </h2>

          <div
            className="mt-8 grid grid-cols-[1.4fr_1fr_0.7fr] py-2 text-[11px]"
            style={{ ...mono, color: C.paperFaint, borderTop: "1px solid rgba(24,22,19,0.15)" }}
          >
            <span>discipline</span>
            <span>availability</span>
            <span>projects</span>
          </div>
          {(bench?.rows ?? []).map((r) => (
            <div
              key={r.discipline}
              className="grid grid-cols-[1.4fr_1fr_0.7fr] items-center py-3"
              style={{ borderTop: "1px solid rgba(24,22,19,0.15)" }}
            >
              <span className="text-[15px] font-medium">
                {r.discipline}{" "}
                <Status kind={r.status as StatusKind}>{r.status}</Status>
              </span>
              <Status kind={r.availability as StatusKind}>{r.note}</Status>
              <span style={{ ...mono, color: C.paperBody }} className="text-[12px]">
                {r.projects}
              </span>
            </div>
          ))}
          <p
            className="mt-3 pt-3 text-[11px]"
            style={{ ...mono, color: C.paperFaint, borderTop: "1px solid rgba(24,22,19,0.15)" }}
          >
            {bench
              ? `${bench.totals.partners} partners · ${bench.totals.disciplines} disciplines · availability moves weekly`
              : "the bench is loading; availability moves weekly"}
          </p>
        </div>
      </section>

      {bench?.pulse && (
        <section style={{ background: C.orange, color: "#181613" }}>
          <div className="mx-auto max-w-[1120px] px-6 py-12 md:px-10">
            <p style={{ ...mono, letterSpacing: "0.08em" }} className="mb-3 text-[13px]">
              this week on the bench
            </p>
            <p
              className="font-medium"
              style={{
                fontSize: "clamp(1.4rem,2.8vw,2.25rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              {bench.pulse.line}
            </p>
            <p style={{ ...mono, color: "#4A1B0C" }} className="mt-4 text-[12px]">
              updated {bench.pulse.updated}. if this is stale, tell us off: hello@bmkrs.com
            </p>
          </div>
        </section>
      )}

      <section style={{ background: C.paper, color: C.paperText }}>
        <div className="mx-auto max-w-[1120px] px-6 py-16 md:px-10">
          <Kicker>how it works</Kicker>
          <h2
            className="font-medium"
            style={{ fontSize: "clamp(1.75rem,3.2vw,2.75rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            two journeys, one standard.
          </h2>
          <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {[
              {
                title: "if you're joining",
                steps: PARTNER_STEPS,
                cta: { href: routes.join, label: "apply to the bench →" },
              },
              {
                title: "if you're hiring",
                steps: HIRER_STEPS,
                cta: { href: routes.hire, label: "hire from the bench →" },
              },
            ].map((col) => (
              <div key={col.title}>
                <p style={{ ...mono, color: C.paperFaint }} className="mb-5 text-[12px]">
                  {col.title}
                </p>
                <div className="space-y-7">
                  {col.steps.map((s) => (
                    <div
                      key={s.n}
                      className="pt-4"
                      style={{ borderTop: "1px solid rgba(24,22,19,0.15)" }}
                    >
                      <p style={{ ...mono, color: C.orange }} className="mb-1.5 text-[12px]">
                        {s.n}
                      </p>
                      <h3 className="mb-1.5 text-lg font-medium">{s.t}</h3>
                      <p
                        style={{ color: C.paperBody }}
                        className="max-w-[48ch] text-[14px] leading-relaxed"
                      >
                        {s.b}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-6">
                  <Link
                    href={col.cta.href}
                    style={{ ...mono, color: C.paperText }}
                    className="text-[13px] underline underline-offset-4"
                  >
                    {col.cta.label}
                  </Link>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: C.ink, color: C.inkText }}>
        <div className="mx-auto grid max-w-[1120px] gap-12 px-6 py-16 md:grid-cols-2 md:px-10">
          <div>
            <Kicker surface="ink">who&apos;s on it</Kicker>
            <h2
              className="font-medium"
              style={{ fontSize: "clamp(1.75rem,3.2vw,2.75rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
            >
              senior, multiskilled, and scary-good at one thing.
            </h2>
          </div>
          <div className="space-y-5 self-end text-[15px] leading-relaxed" style={{ color: C.inkBody }}>
            <p>
              brand and identity. voice and copy. pr. motion and 3d. product design. engineering.
              growth. if the discipline ships work a client can point at, the bench has a seat for
              it.
            </p>
            <p>
              we are fussy on purpose: a small bench the studio actually knows beats a large one it
              doesn&apos;t. that is the whole reason hirers trust the people we send.
            </p>
            <p style={{ ...mono, color: C.inkFaint }} className="text-[12px]">
              already on the bench?{" "}
              <Link
                href={routes.login}
                style={{ color: C.inkBody }}
                className="underline underline-offset-4"
              >
                sign in
              </Link>{" "}
              · questions? hello@bmkrs.com
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: C.ink, borderTop: `1px solid ${C.inkRule}` }}>
        <a href={marketingUrls.studio} className="group block">
          <div className="mx-auto flex max-w-[1120px] items-end justify-between gap-8 px-6 py-12 md:px-10">
            <div>
              <p style={{ ...mono, color: C.orange, letterSpacing: "0.08em" }} className="mb-3 text-[12px]">
                next
              </p>
              <p
                className="font-medium transition-transform group-hover:translate-x-2 motion-reduce:transform-none"
                style={{
                  color: C.inkText,
                  fontSize: "clamp(1.4rem,2.8vw,2.25rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                the studio behind the bench → bmkrs.com
              </p>
            </div>
            <span
              aria-hidden
              style={{ color: C.orange }}
              className="text-3xl transition-transform group-hover:translate-x-2 motion-reduce:transform-none"
            >
              →
            </span>
          </div>
        </a>
        <div className="mx-auto max-w-[1120px] px-6 pb-6 md:px-10">
          <p style={{ ...mono, color: "#888780" }} className="text-[11px]">
            b makers ltd · registered in england and wales ·{" "}
            <a href={`${marketingUrls.studio}/legal/privacy`} className="underline underline-offset-4">
              privacy
            </a>{" "}
            ·{" "}
            <a href={`${marketingUrls.studio}/legal/cookies`} className="underline underline-offset-4">
              cookies
            </a>
          </p>
        </div>
      </section>
    </main>
    </EntryChrome>
  );
}
