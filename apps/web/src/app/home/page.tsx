import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@bench/database";
import { getAuthSession, getCurrentUser } from "@/lib/auth";
import { C, mono, NavRail, Status, StageStrip, PrimaryButton, Rule } from "@/lib/bench-ui";
import { isBenchDevAuth } from "@/lib/env";
import {
  clientNavItems,
  navRailFooter,
  partnerNavItems,
  studioNavItems,
} from "@/lib/nav-rail";
import { routes } from "@/lib/routes";

const PARTNER_SEED = {
  trustedSince: "march 2026",
  briefs: [
    {
      codename: "project copper",
      role: "motion design",
      dates: "6 to 17 jul",
      respondBy: "fri 19 jun",
    },
  ],
  projects: [
    {
      name: "project mercury",
      role: "voice + copy",
      stage: "make" as const,
      last: "sarah: hero options v2 are in files",
    },
  ],
  availability: "available" as const,
};

const CLIENT_SEED = {
  projects: [
    {
      name: "your rebrand",
      pkg: "rebrand",
      stage: "decide" as const,
      last: "positioning draft ready for sign-off",
    },
  ],
};

export default async function DashboardHomePage() {
  const benchSession = await getAuthSession();
  const user = await getCurrentUser();

  if (!benchSession && !user) {
    redirect(isBenchDevAuth() ? routes.login : routes.signIn);
  }

  const role =
    benchSession?.role ??
    (user?.role === UserRole.ADMIN
      ? "studio"
      : user?.role === UserRole.CLIENT
        ? "client"
        : "partner");
  const name =
    benchSession?.name ??
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").toLowerCase() ??
    "there";
  const footer = benchSession
    ? `${benchSession.name} · ${benchSession.role}`
    : user
      ? navRailFooter(user.firstName, role === "studio" ? "studio" : role)
      : "";

  const navByRole =
    role === "studio"
      ? [
          { label: "home", href: routes.dashboardHome },
          ...studioNavItems,
        ]
      : role === "client"
        ? [{ label: "home", href: routes.dashboardHome }, ...clientNavItems]
        : [{ label: "home", href: routes.dashboardHome }, ...partnerNavItems];

  return (
    <div className="flex" style={{ background: C.paper }}>
      <NavRail active={routes.dashboardHome} footer={footer} items={navByRole} />

      <main className="min-h-dvh flex-1 px-8 py-8" style={{ color: C.paperText }}>
        {role === "studio" && (
          <>
            <h1
              className="font-medium"
              style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", letterSpacing: "-0.02em" }}
            >
              morning, {name.split(" ")[0]}.
            </h1>
            <p style={{ color: C.paperBody }} className="mt-3 max-w-[55ch] text-[15px] leading-relaxed">
              the studio view lives in the rail: the pipeline for applications, the bench for staffing,
              projects and briefs for the work itself.
            </p>
            <div className="mt-8">
              <PrimaryButton href={routes.studioBench}>to the bench →</PrimaryButton>
            </div>
          </>
        )}

        {role === "partner" && (
          <>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <h1
                className="font-medium"
                style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", letterSpacing: "-0.02em" }}
              >
                hello, {name.split(" ")[0]}.
              </h1>
              <Status kind="trusted">trusted since {PARTNER_SEED.trustedSince}</Status>
            </div>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-medium">your briefs</h2>
              <Rule />
              {PARTNER_SEED.briefs.length === 0 ? (
                <p style={{ ...mono, color: C.paperFaint }} className="py-4 text-[12px]">
                  no open briefs right now. enjoy it; it never lasts.
                </p>
              ) : (
                PARTNER_SEED.briefs.map((b) => (
                  <div
                    key={b.codename}
                    className="grid grid-cols-1 items-center gap-2 py-4 sm:grid-cols-[1.2fr_1fr_1fr_auto]"
                    style={{ borderBottom: `1px solid ${C.paperRule}` }}
                  >
                    <span className="font-medium">{b.codename}</span>
                    <span style={{ ...mono, color: C.paperBody }} className="text-[12px]">
                      {b.role} · {b.dates}
                    </span>
                    <span style={{ ...mono, color: C.paperFaint }} className="text-[12px]">
                      respond by {b.respondBy}
                    </span>
                    <span className="flex gap-2">
                      <span
                        className="rounded-full px-4 py-1.5 text-[12px] font-medium"
                        style={{ background: C.orange, color: C.ink }}
                      >
                        i&apos;m in
                      </span>
                      <span
                        className="rounded-full border px-4 py-1.5 text-[12px]"
                        style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperBody }}
                      >
                        not this time
                      </span>
                    </span>
                  </div>
                ))
              )}
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-medium">your projects</h2>
              <Rule />
              {PARTNER_SEED.projects.map((p) => (
                <div
                  key={p.name}
                  className="grid grid-cols-1 items-center gap-2 py-4 sm:grid-cols-[1fr_2fr_1.4fr]"
                  style={{ borderBottom: `1px solid ${C.paperRule}` }}
                >
                  <span className="font-medium">
                    {p.name}{" "}
                    <span style={{ ...mono, color: C.paperFaint }} className="ml-1 text-[11px]">
                      {p.role}
                    </span>
                  </span>
                  <StageStrip current={p.stage} />
                  <span style={{ ...mono, color: C.paperFaint }} className="text-[12px]">
                    {p.last}
                  </span>
                </div>
              ))}
            </section>

            <section id="availability">
              <h2 className="mb-3 text-xl font-medium">availability</h2>
              <Rule />
              <div className="flex flex-wrap items-center gap-3 py-4">
                {(["available", "booked", "away"] as const).map((a) => (
                  <span
                    key={a}
                    className="rounded-full border px-4 py-2 text-[13px]"
                    style={
                      a === PARTNER_SEED.availability
                        ? { background: C.ink, color: C.paper, borderColor: C.ink }
                        : { color: C.paperBody, borderColor: "rgba(24,22,19,0.25)" }
                    }
                  >
                    · {a}
                  </span>
                ))}
              </div>
              <p style={{ ...mono, color: C.paperFaint }} className="text-[11px]">
                this is what the studio sees when staffing. keep it honest and you get briefs that
                actually fit.
              </p>
            </section>
          </>
        )}

        {role === "client" && (
          <>
            <h1
              className="mb-8 font-medium"
              style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", letterSpacing: "-0.02em" }}
            >
              your projects.
            </h1>
            {CLIENT_SEED.projects.map((p) => (
              <Link
                key={p.name}
                href={routes.client}
                className="block py-5 transition-transform hover:translate-x-1 motion-reduce:transform-none"
                style={{ borderTop: `1px solid ${C.paperRule}` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-lg font-medium">
                    {p.name}{" "}
                    <span style={{ ...mono, color: C.paperFaint }} className="ml-2 text-[11px]">
                      {p.pkg}
                    </span>
                  </span>
                  <StageStrip current={p.stage} />
                </div>
                <p style={{ ...mono, color: C.paperFaint }} className="mt-2 text-[12px]">
                  {p.last}
                </p>
              </Link>
            ))}
          </>
        )}

        {isBenchDevAuth() && (
          <form action="/api/logout" method="post" className="mt-16">
            <button
              type="submit"
              style={{ ...mono, color: C.paperFaint }}
              className="text-[12px] underline-offset-4 hover:underline"
            >
              sign out
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
