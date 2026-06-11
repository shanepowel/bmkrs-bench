"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { routes } from "@/lib/routes";

const DISCIPLINES = [
  "brand + identity",
  "voice + copy",
  "pr + comms",
  "product design",
  "engineering",
  "motion + 3d",
  "growth",
  "photography",
];

const BANDS = [
  "£250–350/day",
  "£350–450/day",
  "£450–550/day",
  "£550–700/day",
  "£700+/day",
];

export default function ApplyPage() {
  const router = useRouter();
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [band, setBand] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disciplines.length === 0 || !band) {
      setState("error");
      return;
    }
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      sessionStorage.setItem(
        "bench.apply.draft",
        JSON.stringify({ ...data, disciplines, band })
      );
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <main style={{ background: C.paper, color: C.paperText }} className="min-h-dvh">
        <div className="mx-auto max-w-[640px] px-6 py-28">
          <Kicker>application received</Kicker>
          <h1
            className="font-medium"
            style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            in.
          </h1>
          <p style={{ color: C.paperBody }} className="mt-5 max-w-[55ch] text-lg leading-relaxed">
            create your account to track status and complete your profile. a human reads this within
            the week, and you will hear either way. we mean the either way part.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <PrimaryButton href={routes.signUp("applicant")}>create account</PrimaryButton>
            <button
              type="button"
              onClick={() => router.push(routes.home)}
              style={{ ...mono, color: C.paperFaint }}
              className="text-[12px] underline underline-offset-4"
            >
              back to the bench
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: C.paper, color: C.paperText }} className="min-h-dvh">
      <div className="mx-auto max-w-[720px] px-6 py-20">
        <Link
          href={routes.home}
          style={{ ...mono, color: C.paperFaint }}
          className="text-[12px] underline-offset-4 hover:underline"
        >
          ← the bench
        </Link>
        <div className="mt-10">
          <Kicker>join the bench</Kicker>
          <h1
            className="font-medium"
            style={{ fontSize: "clamp(2.25rem,5vw,3.75rem)", lineHeight: 1.0, letterSpacing: "-0.02em" }}
          >
            good at what you do?
          </h1>
          <p style={{ color: C.paperBody }} className="mt-5 max-w-[60ch] text-[15px] leading-relaxed">
            what we ask up front: your work, your disciplines, your day rate band, and two people who
            will vouch for you. a human reads every application, usually the same week. sometimes we
            will offer a short <strong className="font-medium">paid</strong> trial brief before
            anything bigger; we do not do unpaid spec work and will not ask you to.
          </p>
        </div>

        <form onSubmit={submit} className="mt-12 space-y-7">
          <div className="grid gap-7 sm:grid-cols-2">
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
            <Label>disciplines (pick what you&apos;d want briefs for)</Label>
            <PillSelect options={DISCIPLINES} value={disciplines} onChange={setDisciplines} />
          </div>
          <div>
            <Label>portfolio url</Label>
            <TextField name="portfolio" type="url" placeholder="https://" required />
          </div>
          <div>
            <Label>day rate band</Label>
            <PillSelect
              options={BANDS}
              value={band ? [band] : []}
              onChange={(v) => setBand(v.at(-1) ?? "")}
            />
            <p style={{ ...mono, color: C.paperFaint }} className="mt-2 text-[11px]">
              bands keep the first conversation honest; exact rates per brief.
            </p>
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <Label>reference one (name + contact)</Label>
              <TextField name="ref1" required />
            </div>
            <div>
              <Label>reference two (name + contact)</Label>
              <TextField name="ref2" required />
            </div>
          </div>
          <div>
            <Label>anything we should know</Label>
            <TextArea
              name="notes"
              placeholder="availability, the work you want more of, the work you never want again..."
            />
          </div>

          <div className="flex items-center gap-5 pt-2">
            <PrimaryButton type="submit">{state === "sending" ? "sending…" : "send it in"}</PrimaryButton>
            {state === "error" && (
              <p style={{ ...mono, color: C.paperBody }} className="text-[12px]">
                pick at least one discipline and a rate band, then try again.
              </p>
            )}
          </div>
          <p style={{ ...mono, color: C.paperFaint }} className="text-[11px]">
            we store this to assess your application, per the{" "}
            <a href="https://www.bmkrs.com/legal/privacy" className="underline underline-offset-4">
              privacy notice
            </a>
            . references contacted only if we get serious.
          </p>
        </form>
      </div>
    </main>
  );
}
