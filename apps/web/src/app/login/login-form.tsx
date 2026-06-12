"use client";

import { useState } from "react";
import { C, mono, Kicker, PrimaryButton } from "@/lib/bench-ui";

export function LoginForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "unknown">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const email = new FormData(e.currentTarget).get("email");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.redirect) {
        window.location.assign(data.redirect);
        return;
      }
      setState("sent");
    } else {
      setState("unknown");
    }
  }

  return (
    <main style={{ background: C.ink, color: C.inkText }} className="grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-[460px]">
        <p className="mb-6 text-4xl font-medium" style={{ letterSpacing: "-0.02em" }}>
          bmkrs
          <span
            aria-hidden
            className="ml-[2px] inline-block h-[0.13em] w-[0.13em] rounded-full align-baseline"
            style={{ background: C.orange }}
          />
        </p>
        <Kicker surface="ink">member login</Kicker>
        <h1
          className="font-medium"
          style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          trusted partners, real projects, no theatre.
        </h1>

        {state === "sent" ? (
          <p style={{ color: C.inkBody }} className="mt-8 text-[15px] leading-relaxed">
            link sent. check your inbox, and the spam folder it definitely is not in.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8">
            <label htmlFor="email" style={{ ...mono, color: C.inkFaint }} className="mb-1.5 block text-[12px]">
              email
            </label>
            <div className="flex gap-3">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-md px-3.5 py-2.5 text-[15px] outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(255,77,0,0.25)]"
                style={{
                  background: "#221F1B",
                  border: "1px solid rgba(241,239,232,0.22)",
                  color: C.inkText,
                }}
              />
              <PrimaryButton type="submit">{state === "sending" ? "…" : "send me a link"}</PrimaryButton>
            </div>
            {state === "unknown" && (
              <p style={{ ...mono, color: C.inkBody }} className="mt-3 text-[12px]">
                that email is not on the bench. think it should be?{" "}
                <a href="mailto:hello@bmkrs.com" className="underline underline-offset-4">
                  hello@bmkrs.com
                </a>
              </p>
            )}
            <p style={{ ...mono, color: C.inkFaint }} className="mt-4 text-[12px]">
              no passwords here. we email you a link, you click it, you are in.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
