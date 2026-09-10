// app/page.tsx — the bench home, the mix.
// shared bmkrs header (cross-property nav) + a hero where the live bench is the
// centrepiece, with the two doors beside it as a response to the product, not a
// gate before it. below: how-it-works (two journeys), who's on it, bridge.
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import BenchPanel, { type BenchRow } from "@/components/BenchPanel";
import SiteHeader from "@/components/SiteHeader";
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

const C = {
  ink: "#181613", paper: "#F1EFE8", body: "#D3D1C7", faint: "#888780",
  meta: "#B4B2A9", orange: "#FF4D00", rule: "rgba(241,239,232,0.16)",
};
const mono = { fontFamily: "var(--font-mono, ui-monospace, monospace)" } as const;

const TICKER = [
  "real briefs, real budgets", "a human reads every application", "no bidding, ever",
  "paid trials, never spec work", "history, not star ratings",
];
const PARTNER_STEPS = [
  { n: "01", t: "apply once, properly.", b: "your work, your disciplines, your rate band, two people who vouch for you. ten minutes, one time." },
  { n: "02", t: "a human reads it.", b: "usually the same week, and you hear either way. sometimes a short paid trial brief comes first." },
  { n: "03", t: "briefs find you.", b: "dates, rate, role. say yes, no, or ask a question. silence is a fine answer too." },
  { n: "04", t: "the work becomes your record.", b: "completed projects build your track record. history, not stars." },
];
const HIRER_STEPS = [
  { n: "01", t: "tell us the gap.", b: "discipline, dates, the shape of the work. a paragraph is plenty." },
  { n: "02", t: "a human matches it.", b: "we know the bench personally. you get the right person, not a search result." },
  { n: "03", t: "meet before you commit.", b: "a short call with the partner. if it is not right, we go again." },
  { n: "04", t: "vetted, not vouched-for vaguely.", b: "every partner has references checked and a visible bmkrs track record." },
];

function toBenchRows(rows: BenchPublicSlice["rows"]): BenchRow[] {
  return rows.map((row) => ({
    discipline: row.discipline,
    specialism: row.specialism,
    status: row.status,
    availability: row.availability,
    availNote: row.note,
    projects: row.projects,
    group: row.group,
  }));
}

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
  const rows = bench ? toBenchRows(bench.rows) : [];

  return (
    <main style={{ background: C.ink }}>
      <SiteHeader active="network" />

      <section style={{ color: C.paper }}>
        <div className="mx-auto max-w-[1240px] px-6 pb-10 pt-12 md:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p style={{ ...mono, color: C.orange, letterSpacing: "0.08em" }} className="mb-3 flex items-center gap-2 text-[12px]">
                <span className="ld inline-block h-1.5 w-1.5 rounded-full" style={{ background: C.orange }} />
                the bmkrs partner network, live
              </p>
              <h1 className="max-w-[18ch] font-medium" style={{ fontSize: "clamp(2.25rem,5vw,4rem)", lineHeight: 1.0, letterSpacing: "-0.02em" }}>
                this is the bench. the people we build with.
              </h1>
            </div>
            {bench && (
              <p style={{ ...mono, color: C.faint }} className="text-[11px] leading-relaxed sm:text-right">
                {bench.totals.partners} partners<br />{bench.totals.disciplines} disciplines<br />names off, real otherwise
              </p>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            {bench ? (
              <BenchPanel rows={rows} totals={bench.totals} pulse={bench.pulse?.line} />
            ) : (
              <div className="rounded-2xl p-8 text-center" style={{ border: `1px solid ${C.rule}` }}>
                <p style={{ ...mono, color: C.faint }} className="text-[12px]">the bench is loading…</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Link href={routes.join} className="group flex items-center justify-between rounded-xl p-5 transition-transform hover:scale-[1.02] motion-reduce:transform-none" style={{ background: C.orange, color: C.ink }}>
                <span>
                  <span style={{ ...mono }} className="block text-[10px]">see yourself on it?</span>
                  <span className="text-lg font-medium">apply to the bench</span>
                  <span className="mt-1 block text-[12px]">real briefs, real budgets. no bidding.</span>
                </span>
                <span aria-hidden className="text-xl transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link href={routes.hire} className="group flex items-center justify-between rounded-xl p-5 transition-transform hover:scale-[1.02] motion-reduce:transform-none" style={{ border: `1px solid ${C.rule}`, color: C.paper }}>
                <span>
                  <span style={{ ...mono, color: C.faint }} className="block text-[10px]">need one of them?</span>
                  <span className="text-lg font-medium" style={{ color: C.orange }}>hire from the bench</span>
                  <span className="mt-1 block text-[12px]" style={{ color: C.body }}>matched by a human, not a search box.</span>
                </span>
                <span aria-hidden className="text-xl transition-transform group-hover:translate-x-1" style={{ color: C.orange }}>→</span>
              </Link>
              <p style={{ ...mono, color: C.faint }} className="px-1 text-[11px] leading-relaxed">
                already on the bench? <Link href={routes.login} style={{ color: C.body }} className="underline underline-offset-4">sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div aria-hidden className="overflow-hidden py-3" style={{ borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}` }}>
        <div className="bench-ticker flex w-max gap-10 whitespace-nowrap">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} style={{ ...mono, color: C.faint }} className="text-[12px]">{t} <span style={{ color: C.orange }}>·</span></span>
          ))}
        </div>
      </div>

      <section style={{ background: C.paper, color: C.ink }}>
        <div className="mx-auto max-w-[1240px] px-6 py-16 md:px-10">
          <p style={{ ...mono, color: C.orange, letterSpacing: "0.08em" }} className="mb-4 text-[13px]">how it works</p>
          <h2 className="font-medium" style={{ fontSize: "clamp(1.75rem,3.2vw,2.75rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>two journeys, one standard.</h2>
          <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {[
              { title: "if you're joining", steps: PARTNER_STEPS, cta: { href: routes.join, label: "apply to the bench →" } },
              { title: "if you're hiring", steps: HIRER_STEPS, cta: { href: routes.hire, label: "hire from the bench →" } },
            ].map((col) => (
              <div key={col.title}>
                <p style={{ ...mono, color: "#5F5E5A" }} className="mb-5 text-[12px]">{col.title}</p>
                <div className="space-y-7">
                  {col.steps.map((s) => (
                    <div key={s.n} className="pt-4" style={{ borderTop: "1px solid rgba(24,22,19,0.15)" }}>
                      <p style={{ ...mono, color: C.orange }} className="mb-1.5 text-[12px]">{s.n}</p>
                      <h3 className="mb-1.5 text-lg font-medium">{s.t}</h3>
                      <p style={{ color: "#444441" }} className="max-w-[48ch] text-[14px] leading-relaxed">{s.b}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6"><Link href={col.cta.href} className="text-[13px] underline underline-offset-4" style={{ color: C.ink }}>{col.cta.label}</Link></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ color: C.paper }}>
        <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-16 md:grid-cols-2 md:px-10">
          <div>
            <p style={{ ...mono, color: C.orange, letterSpacing: "0.08em" }} className="mb-4 text-[13px]">who&apos;s on it</p>
            <h2 className="font-medium" style={{ fontSize: "clamp(1.75rem,3.2vw,2.75rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>senior, multiskilled, and scary-good at one thing.</h2>
          </div>
          <div className="space-y-5 self-end text-[15px] leading-relaxed" style={{ color: C.body }}>
            <p>brand and identity. voice and copy. pr. motion and 3d. product design. engineering. growth. if the discipline ships work a client can point at, the bench has a seat for it.</p>
            <p>we are fussy on purpose: a small bench the studio actually knows beats a large one it doesn&apos;t. that is the whole reason hirers trust the people we send.</p>
          </div>
        </div>
      </section>

      <section style={{ borderTop: `1px solid ${C.rule}` }}>
        <a href={marketingUrls.studio} className="group block">
          <div className="mx-auto flex max-w-[1240px] items-end justify-between gap-8 px-6 py-12 md:px-10">
            <div>
              <p style={{ ...mono, color: C.orange, letterSpacing: "0.08em" }} className="mb-3 text-[12px]">next</p>
              <p className="font-medium transition-transform group-hover:translate-x-2 motion-reduce:transform-none" style={{ color: C.paper, fontSize: "clamp(1.4rem,2.8vw,2.25rem)", letterSpacing: "-0.02em" }}>the studio behind the bench → bmkrs.com</p>
            </div>
            <span aria-hidden style={{ color: C.orange }} className="text-3xl transition-transform group-hover:translate-x-2 motion-reduce:transform-none">→</span>
          </div>
        </a>
        <div className="mx-auto max-w-[1240px] px-6 pb-6 md:px-10">
          <p style={{ ...mono, color: C.faint }} className="text-[11px]">
            b makers ltd · registered in england and wales ·{" "}
            <a href={`${marketingUrls.studio}/legal/privacy`} className="underline underline-offset-4">privacy</a> ·{" "}
            <a href={`${marketingUrls.studio}/legal/cookies`} className="underline underline-offset-4">cookies</a>
          </p>
        </div>
      </section>

      <style>{`
        .ld { animation: bench-live 2s ease-in-out infinite; }
        @keyframes bench-live { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        a:focus-visible, button:focus-visible { outline: 2px solid #FF4D00; outline-offset: 3px; }
      `}</style>
    </main>
  );
}
