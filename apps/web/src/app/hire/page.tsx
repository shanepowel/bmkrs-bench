"use client";

import { useState } from "react";
import Link from "next/link";
import {
  C,
  mono,
  Kicker,
  Label,
  TextField,
  TextArea,
  PillSelect,
  PrimaryButton,
} from "@/lib/bench-ui";
import { marketingUrls } from "@/lib/marketing-urls";
import { routes } from "@/lib/routes";

const DISCIPLINES = [
  "brand + identity",
  "voice + copy",
  "pr + comms",
  "product design",
  "engineering",
  "motion + 3d",
  "growth",
  "not sure yet",
];

const VETTING = [
  {
    n: "01",
    t: "references, actually checked.",
    b: "two per partner, contacted by us, before anyone reaches the bench.",
  },
  {
    n: "02",
    t: "trials, always paid.",
    b: "where we want proof beyond the portfolio, we commission a short paid brief. how someone works on a real job is the only test that counts.",
  },
  {
    n: "03",
    t: "track records, not star ratings.",
    b: "every partner's profile carries their completed bmkrs projects: what, when, what role. history you can ask us about, not scores anyone can game.",
  },
  {
    n: "04",
    t: "matched by a human.",
    b: "you do not search a directory. you tell us the gap, and someone who knows the bench personally puts the right person in front of you.",
  },
];

export default function HirePage() {
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, disciplines }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <main>
      <section style={{ background: C.ink, color: C.inkText }}>
        <div className="mx-auto max-w-[1120px] px-6 pb-16 pt-16 md:px-10">
          <div className="mt-10">
            <Kicker surface="ink">hire from the bench</Kicker>
            <h1
              className="max-w-[16ch] font-medium"
              style={{ fontSize: "clamp(2.5rem,5.5vw,5rem)", lineHeight: 0.98, letterSpacing: "-0.02em" }}
            >
              the right person, vouched for properly.
            </h1>
            <p style={{ color: C.inkBody }} className="mt-6 max-w-[60ch] text-lg leading-relaxed">
              the bench is the small network of partners we staff bmkrs projects from, and it is open
              to teams who need the same calibre. every person on it has been vetted by us, has a
              visible track record, and is matched to your gap by a human who knows them.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: C.paper, color: C.paperText }}>
        <div className="mx-auto max-w-[1120px] px-6 py-16 md:px-10">
          <Kicker>what trusted means here</Kicker>
          <h2
            className="font-medium"
            style={{ fontSize: "clamp(1.75rem,3.2vw,2.75rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            &quot;vetted&quot; is a process, not an adjective.
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-9 md:grid-cols-2">
            {VETTING.map((v) => (
              <div
                key={v.n}
                className="pt-4"
                style={{ borderTop: "1px solid rgba(24,22,19,0.15)" }}
              >
                <p style={{ ...mono, color: C.orange }} className="mb-1.5 text-[12px]">
                  {v.n}
                </p>
                <h3 className="mb-1.5 text-lg font-medium">{v.t}</h3>
                <p style={{ color: C.paperBody }} className="max-w-[50ch] text-[14px] leading-relaxed">
                  {v.b}
                </p>
              </div>
            ))}
          </div>
          <p style={{ ...mono, color: C.paperFaint }} className="mt-8 text-[12px]">
            rates: each partner has a day rate band; you see the exact rate with the match, before
            any commitment. our coordination fee is included in the rate you are quoted. no
            surprises after.
          </p>
        </div>
      </section>

      <section style={{ background: C.ink }}>
        <div className="mx-auto max-w-[1120px] px-6 py-16 md:px-10">
          <div
            className="mx-auto max-w-[720px] rounded-2xl p-8 md:p-10"
            style={{ background: C.paper, color: C.paperText }}
          >
            {state === "done" ? (
              <>
                <Kicker>got it</Kicker>
                <h2
                  className="font-medium"
                  style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", letterSpacing: "-0.02em" }}
                >
                  a human is on it.
                </h2>
                <p style={{ color: C.paperBody }} className="mt-4 max-w-[50ch] text-[15px] leading-relaxed">
                  you will hear within one working day with either a match, a question, or an honest
                  &quot;we do not have that person right now&quot;.
                </p>
              </>
            ) : (
              <>
                <Kicker>tell us the gap</Kicker>
                <h2
                  className="font-medium"
                  style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", letterSpacing: "-0.02em" }}
                >
                  a paragraph is plenty.
                </h2>
                <form onSubmit={submit} className="mt-8 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label>name</Label>
                      <TextField name="name" required autoComplete="name" />
                    </div>
                    <div>
                      <Label>email</Label>
                      <TextField name="email" type="email" required autoComplete="email" />
                    </div>
                  </div>
                  <div>
                    <Label>company / studio</Label>
                    <TextField name="company" />
                  </div>
                  <div>
                    <Label>discipline you need</Label>
                    <PillSelect options={DISCIPLINES} value={disciplines} onChange={setDisciplines} />
                  </div>
                  <div>
                    <Label>the gap (dates, shape of the work, anything useful)</Label>
                    <TextArea
                      name="need"
                      required
                      placeholder="e.g. we need a motion designer for 3 weeks from mid july to bring a brand launch to life..."
                    />
                  </div>
                  <div className="flex items-center gap-5">
                    <PrimaryButton type="submit">
                      {state === "sending" ? "sending…" : "find me the person"}
                    </PrimaryButton>
                    {state === "error" && (
                      <p style={{ ...mono, color: C.paperBody }} className="text-[12px]">
                        that didn&apos;t send. nothing lost, try again.
                      </p>
                    )}
                  </div>
                  <p style={{ ...mono, color: C.paperFaint }} className="text-[11px]">
                    handled per the{" "}
                    <a
                      href={`${marketingUrls.studio}/legal/privacy`}
                      className="underline underline-offset-4"
                    >
                      privacy notice
                    </a>
                    . no obligation until you say yes to a named person and a rate.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <section style={{ background: C.ink, borderTop: `1px solid ${C.inkRule}` }}>
        <Link href={routes.home} className="group block">
          <div className="mx-auto flex max-w-[1120px] items-end justify-between gap-8 px-6 py-10 md:px-10">
            <div>
              <p style={{ ...mono, color: C.orange, letterSpacing: "0.08em" }} className="mb-2 text-[12px]">
                next
              </p>
              <p
                className="font-medium transition-transform group-hover:translate-x-2 motion-reduce:transform-none"
                style={{
                  color: C.inkText,
                  fontSize: "clamp(1.25rem,2.5vw,2rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                see the bench, live →
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
        </Link>
      </section>
    </main>
  );
}
