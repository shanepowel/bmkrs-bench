import Link from "next/link";
import { notFound } from "next/navigation";
import { JobStatus, UserRole } from "@bench/database";
import { getJobBySlug } from "@/actions/jobs";
import { PageShell } from "@/components/layout/page-shell";
import { ProposalForm } from "@/components/proposal-form";
import { ProposalInbox } from "@/components/proposal-inbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { formatBudgetRange } from "@/lib/format";
import { routes } from "@/lib/routes";

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const user = await getCurrentUser();
  const isOwner = user?.id === job.posterId;
  const canPropose =
    user?.role === UserRole.TALENT && job.status === JobStatus.OPEN && !isOwner;
  const alreadyProposed = job.proposals.some((p) => p.talentId === user?.id);

  return (
    <PageShell
      title={job.title}
      back={{ href: routes.jobs, label: "All jobs" }}
      width="xl"
      actions={
        isOwner ? (
          <Link href={routes.jobEdit(slug)}>
            <Button variant="secondary">Edit job</Button>
          </Link>
        ) : undefined
      }
    >
      {job.skills.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {job.skills.map((js) => (
            <Badge key={js.skillId} variant="info">
              {js.skill.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">
          {formatBudgetRange(job.budgetMin, job.budgetMax, job.billingMode)}
        </span>
        <span>·</span>
        <span className="capitalize">{job.environment.toLowerCase()}</span>
        <span>·</span>
        <span className="capitalize">{job.experienceLevel.toLowerCase()}</span>
        {(job.postcode || job.city) && (
          <>
            <span>·</span>
            <span>{[job.postcode, job.city, job.country].filter(Boolean).join(", ")}</span>
          </>
        )}
      </div>

      <p className="mt-8 whitespace-pre-wrap leading-relaxed text-slate-700">{job.description}</p>

      {canPropose && !alreadyProposed && (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Submit a proposal</h2>
          <div className="mt-4">
            <ProposalForm jobId={job.id} />
          </div>
        </div>
      )}

      {user?.role === UserRole.TALENT && alreadyProposed && (
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={routes.jobMessages(slug, user.id)}>
            <Button variant="secondary">Message client</Button>
          </Link>
        </div>
      )}

      {isOwner && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900">
            Proposals ({job.proposals.length})
          </h2>
          <div className="mt-6">
            <ProposalInbox proposals={job.proposals} jobSlug={slug} />
          </div>
        </section>
      )}
    </PageShell>
  );
}
