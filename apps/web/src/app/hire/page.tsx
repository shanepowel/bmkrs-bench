import type { Metadata } from "next";
import Link from "next/link";
import { BenchEntryNav } from "@/components/bench-entry-nav";
import { C, Kicker, mono, PrimaryButton } from "@/lib/bench-ui";
import { marketingUrls } from "@/lib/marketing-urls";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "find talent | bmkrs.",
  description:
    "bring senior bmkrs people into your team — brand, voice, product and delivery, on tap, with no recruitment ramp-up.",
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    n: "01",
    t: "tell us what you need.",
    b: "a short conversation about the work, the team shape, and how embedded you want the bench to be.",
  },
  {
    n: "02",
    t: "we staff from the bench.",
    b: "the same senior people who deliver bmkrs client work — vetted, known, and already working in our voice.",
  },
  {
    n: "03",
    t: "they plug into your team.",
    b: "brand, voice, pr, product, engineering — agreed capacity, rolling terms, no lock-in theatre.",
  },
];

export default function HireLandingPage() {
  return (
    <main style={{ background: C.paper, color: C.paperText }} className="min-h-dvh">
      <div className="mx-auto max-w-[720px] px-6 py-20">
        <BenchEntryNav context="hire" />

        <Kicker>for companies</Kicker>
        <h1
          className="font-medium"
          style={{ fontSize: "clamp(2.25rem,5vw,3.75rem)", lineHeight: 1.0, letterSpacing: "-0.02em" }}
        >
          find talent from the bench.
        </h1>
        <p style={{ color: C.paperBody }} className="mt-5 max-w-[60ch] text-[15px] leading-relaxed">
          need more than a project? bring senior bmkrs people in to build alongside your team. brand,
          voice, pr, product, on tap — with no recruitment and no ramp-up. the same people who do our
          client work, working as part of yours.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <PrimaryButton href={marketingUrls.contactHire}>let&apos;s talk ↗</PrimaryButton>
          <Link
            href={routes.login}
            className="inline-block rounded-full border px-6 py-3 text-[14px] font-medium"
            style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperText }}
          >
            already a client? log in
          </Link>
        </div>

        <section className="mt-16">
          <Kicker>how it works</Kicker>
          <div className="mt-8 space-y-8">
            {STEPS.map((s) => (
              <div key={s.n} className="pt-5" style={{ borderTop: `1px solid ${C.paperRule}` }}>
                <p style={{ ...mono, color: C.orange }} className="mb-2 text-[12px]">
                  {s.n}
                </p>
                <h2 className="mb-2 text-xl font-medium">{s.t}</h2>
                <p style={{ color: C.paperBody }} className="max-w-[55ch] text-[15px] leading-relaxed">
                  {s.b}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="mt-16 rounded-md p-6"
          style={{ border: `1px solid ${C.paperRule}`, background: "rgba(24,22,19,0.02)" }}
        >
          <p style={{ ...mono, color: C.paperFaint }} className="mb-2 text-[11px] uppercase tracking-[0.08em]">
            motion embedded
          </p>
          <p style={{ color: C.paperBody }} className="text-[15px] leading-relaxed">
            already a motion client? the network is what powers{" "}
            <a href={marketingUrls.motion} className="underline underline-offset-4">
              motion embedded
            </a>
            : the same bench, whether we run the work or you do.
          </p>
        </section>

        <p style={{ ...mono, color: C.paperFaint }} className="mt-12 text-[12px]">
          looking to join as a specialist?{" "}
          <Link href={routes.join} className="underline underline-offset-4" style={{ color: C.paperBody }}>
            apply to the bench
          </Link>
          . this is not a job board — we only staff people we would stake our name on.
        </p>
      </div>
    </main>
  );
}
