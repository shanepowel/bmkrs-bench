import Link from "next/link";
import { notFound } from "next/navigation";
import { JobStatus, ProposalStatus } from "@bench/database";
import { getStudioBrief } from "@/actions/briefs";
import { BenchAppShell } from "@/components/bench-app-shell";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { C, mono, Status } from "@/lib/bench-ui";
import { requireStudio } from "@/lib/auth";
import { formatBudgetRange } from "@/lib/format";
import { navRailFooter, studioNavItems } from "@/lib/nav-rail";
import { routes } from "@/lib/routes";

function responseLabel(coverLetter: string, status: ProposalStatus) {
  const lower = coverLetter.toLowerCase();
  if (status === ProposalStatus.DECLINED || lower.includes("not this time")) {
    return { kind: "away" as const, text: "not this time" };
  }
  if (lower.startsWith("when:")) {
    return { kind: "reviewed" as const, text: coverLetter.toLowerCase() };
  }
  if (lower.includes("i'm in") || lower.includes("i’m in")) {
    return { kind: "available" as const, text: "i'm in" };
  }
  if (lower.includes("awaiting your response")) {
    return { kind: "applied" as const, text: "awaiting response" };
  }
  return { kind: "reviewed" as const, text: coverLetter.toLowerCase() };
}

export default async function StudioBriefDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const studio = await requireStudio();
  const { slug } = await params;
  const brief = await getStudioBrief(slug);
  if (!brief) notFound();

  const disciplines = brief.skills.map((s) => s.skill.name.toLowerCase()).join(" · ");
  const budget = formatBudgetRange(
    Number(brief.budgetMin),
    Number(brief.budgetMax),
    brief.billingMode
  );

  return (
    <BenchAppShell
      active={routes.studioBriefs}
      footer={navRailFooter(studio.firstName, "studio")}
      items={studioNavItems}
      title={`${brief.title.toLowerCase()}.`}
      lead="invited partners only. responses land here; no open listing, no bidding."
      action={
        <Link
          href={routes.studioBriefs}
          className="inline-block rounded-full border px-6 py-3 text-[14px] font-medium"
          style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperText }}
        >
          all briefs
        </Link>
      }
    >
      <div className="max-w-3xl space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <Status kind={brief.status === JobStatus.OPEN ? "available" : "booked"}>
            {brief.status.toLowerCase()}
          </Status>
          <Badge variant="outline" className="font-mono text-[11px] lowercase tracking-[0.06em]">
            {brief.proposals.length} invited
          </Badge>
          {disciplines ? (
            <span className="text-[12px]" style={{ ...mono, color: C.paperFaint }}>
              {disciplines}
            </span>
          ) : null}
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-medium">brief</h2>
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed" style={{ color: C.paperBody }}>
            {brief.description}
          </p>
          <div
            className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[12px]"
            style={{ ...mono, color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}
          >
            <span>budget · {budget}</span>
            {brief.publishedAt ? (
              <span>
                published ·{" "}
                {brief.publishedAt.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            ) : null}
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="mb-3 text-lg font-medium">responses</h2>
          <div
            className="grid grid-cols-[1.2fr_1fr_1.4fr] py-2 text-[11px]"
            style={{ ...mono, color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}
          >
            <span>partner</span>
            <span>status</span>
            <span>note</span>
          </div>
          {brief.proposals.length === 0 ? (
            <p className="py-4 text-[14px]" style={{ color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}>
              no invites yet.
            </p>
          ) : (
            brief.proposals.map((proposal) => {
              const response = responseLabel(proposal.coverLetter, proposal.status);
              const name = `${proposal.talent.firstName} ${proposal.talent.lastName}`.toLowerCase();
              return (
                <div
                  key={proposal.id}
                  className="grid grid-cols-[1.2fr_1fr_1.4fr] items-start gap-2 py-3"
                  style={{ borderTop: `1px solid ${C.paperRule}` }}
                >
                  <div>
                    <p className="font-medium">{name}</p>
                    <Link
                      href={routes.partnerProfile(proposal.talent.username)}
                      className="text-[12px] underline-offset-4 hover:underline"
                      style={{ ...mono, color: C.paperFaint }}
                    >
                      @{proposal.talent.username}
                    </Link>
                  </div>
                  <Status kind={response.kind}>{response.text.split(":")[0]}</Status>
                  <span className="text-[13px]" style={{ color: C.paperBody }}>
                    {response.text.includes(":") ? response.text.split(":").slice(1).join(":").trim() : "—"}
                  </span>
                </div>
              );
            })
          )}
        </section>
      </div>
    </BenchAppShell>
  );
}
