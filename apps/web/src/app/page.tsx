import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { C, mono, Kicker, PrimaryButton } from "@/lib/bench-ui";
import { getCurrentUser } from "@/lib/auth";
import { homeForRole } from "@/lib/bench";
import { isBenchDevAuth } from "@/lib/env";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "the bench | bmkrs.",
  description:
    "the bmkrs bench: a small network of trusted partners who get real briefs with real budgets. no bidding, no race to the bottom.",
  robots: { index: false, follow: false },
};

const TICKER = [
  "real briefs, real budgets",
  "a human reads every application",
  "no bidding, ever",
  "paid trials, never spec work",
  "history, not star ratings",
];

const HOW = [
  {
    n: "01",
    t: "apply once, properly.",
    b: "your work, your disciplines, your rate band, two people who vouch for you. ten minutes, one time.",
  },
  {
    n: "02",
    t: "a human reads it.",
    b: "usually the same week, and you hear either way. sometimes we offer a short paid trial brief before anything bigger.",
  },
  {
    n: "03",
    t: "you're on the bench.",
    b: "when a project needs your discipline, you get a brief: dates, rate, role. say yes, no, or ask a question. silence is a fine answer too.",
  },
  {
    n: "04",
    t: "the work becomes your record.",
    b: "completed projects build your track record on the bench. history, not stars. nobody rates anybody out of five.",
  },
];

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(isBenchDevAuth() ? routes.dashboardHome : homeForRole(user.role));
  }

  const signInHref = isBenchDevAuth() ? routes.login : routes.signIn;

  return (
    <main>
      <section style={{ background: C.ink, color: C.inkText }}>
        <div className="mx-auto max-w-[1120px] px-6 pb-20 pt-24 md:px-10">
          <div className="mb-16 flex items-center justify-between">
            <span className="text-xl font-medium">
              bmkrs
              <span
                aria-hidden
                className="ml-[2px] inline-block h-[0.13em] w-[0.13em] rounded-full align-baseline"
                style={{ background: C.orange }}
              />
              <span style={{ ...mono, color: C.inkFaint }} className="ml-3 text-[12px]">
                the bench
              </span>
            </span>
            <Link
              href={signInHref}
              style={{ ...mono, color: C.inkBody }}
              className="text-[13px] underline-offset-4 hover:underline"
            >
              sign in →
            </Link>
          </div>
          <Kicker surface="ink">the bmkrs partner network</Kicker>
          <h1
            className="max-w-[14ch] font-medium"
            style={{ fontSize: "clamp(2.75rem,6.5vw,6rem)", lineHeight: 0.98, letterSpacing: "-0.02em" }}
          >
            good at what you do? sit with us.
          </h1>
          <p style={{ color: C.inkBody }} className="mt-7 max-w-[60ch] text-lg leading-relaxed">
            the bench is a small network of trusted partners: designers, writers, strategists,
            builders. when a bmkrs project needs your discipline, you hear from a human, with a
            real brief and a real budget. no bidding. no race to the bottom. no being treated like
            inventory.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <PrimaryButton href={routes.apply}>apply to the bench</PrimaryButton>
            <span style={{ ...mono, color: C.inkFaint }} className="text-[12px]">
              ten minutes · a human reads it · you hear either way
            </span>
          </div>
        </div>
      </section>

      <div
        aria-hidden
        className="bench-ticker overflow-hidden py-3"
        style={{ background: C.ink, borderTop: `1px solid ${C.inkRule}`, borderBottom: `1px solid ${C.inkRule}` }}
      >
        <div className="flex w-max gap-10 whitespace-nowrap">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} style={{ ...mono, color: C.inkFaint }} className="text-[12px]">
              {t} <span style={{ color: C.orange }}>·</span>
            </span>
          ))}
        </div>
      </div>

      <section style={{ background: C.paper, color: C.paperText }}>
        <div className="mx-auto max-w-[1120px] px-6 py-20 md:px-10">
          <Kicker>how it works</Kicker>
          <h2
            className="font-medium"
            style={{ fontSize: "clamp(1.9rem,3.5vw,3rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            four steps. the first one is yours.
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2">
            {HOW.map((s) => (
              <div key={s.n} className="pt-5" style={{ borderTop: "1px solid rgba(24,22,19,0.15)" }}>
                <p style={{ ...mono, color: C.orange }} className="mb-2 text-[12px]">
                  {s.n}
                </p>
                <h3 className="mb-2 text-xl font-medium">{s.t}</h3>
                <p style={{ color: C.paperBody }} className="max-w-[50ch] text-[15px] leading-relaxed">
                  {s.b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: C.ink, color: C.inkText }}>
        <div className="mx-auto grid max-w-[1120px] gap-12 px-6 py-20 md:grid-cols-2 md:px-10">
          <div>
            <Kicker surface="ink">who we&apos;re looking for</Kicker>
            <h2
              className="font-medium"
              style={{ fontSize: "clamp(1.9rem,3.5vw,3rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
            >
              senior, multiskilled, and scary-good at one thing.
            </h2>
          </div>
          <div className="space-y-5 self-end text-[15px] leading-relaxed" style={{ color: C.inkBody }}>
            <p>
              brand and identity. voice and copy. pr. motion and 3d. product design. engineering.
              growth. if your discipline ships work a client can point at, the bench has a seat for
              it.
            </p>
            <p>
              we are fussy on purpose: a small bench the studio actually knows beats a large one it
              doesn&apos;t. that is the whole reason clients trust the people we send.
            </p>
            <p style={{ ...mono, color: C.inkFaint }} className="text-[12px]">
              already on the bench?{" "}
              <Link href={signInHref} style={{ color: C.inkBody }} className="underline underline-offset-4">
                sign in
              </Link>{" "}
              · client of the studio? your link is in your inbox · questions? hello@bmkrs.com
            </p>
          </div>
        </div>
      </section>

      <footer style={{ background: C.ink, borderTop: `1px solid ${C.inkRule}` }}>
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-6 py-6 md:px-10">
          <span style={{ ...mono, color: "#888780" }} className="text-[11px]">
            b makers ltd · registered in england and wales ·{" "}
            <a href="https://www.bmkrs.com/legal/privacy" className="underline underline-offset-4">
              privacy
            </a>{" "}
            ·{" "}
            <a href="https://www.bmkrs.com/legal/cookies" className="underline underline-offset-4">
              cookies
            </a>
          </span>
          <a
            href="https://www.bmkrs.com"
            style={{ ...mono, color: "#888780" }}
            className="text-[11px] underline-offset-4 hover:underline"
          >
            the studio → bmkrs.com
          </a>
        </div>
      </footer>
    </main>
  );
}
