import Link from "next/link";
import { UserRole } from "@bench/database";
import { getMyJobs } from "@/actions/jobs";
import { getMyProposals, getReceivedProposals } from "@/actions/proposals";
import { getMyContracts } from "@/actions/contracts";
import { getProfileForEdit } from "@/actions/profile";
import { JobCard } from "@/components/job-card";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { contractStatusLabel, proposalStatusLabel } from "@/lib/labels";
import { formatMoney } from "@/lib/format";
import {
  getClientProfileCompleteness,
  getTalentProfileCompleteness,
} from "@/lib/profile-completeness";
import { routes } from "@/lib/routes";

export default async function DashboardPage() {
  const user = await requireUser();
  const isClient = user.role === UserRole.CLIENT;

  return (
    <PageShell
      title={`Welcome back, ${user.firstName}`}
      description={`${isClient ? "Client" : "Talent"} · @${user.username}`}
      width="full"
      actions={
        <>
          <Link href={routes.profile}>
            <Button variant="secondary">Edit profile</Button>
          </Link>
          {isClient ? (
            <Link href={routes.postJob}>
              <Button>Post a job</Button>
            </Link>
          ) : (
            <>
              <Link href={routes.jobs}>
                <Button>Browse jobs</Button>
              </Link>
              <Link href={routes.payouts}>
                <Button variant="secondary">Payouts</Button>
              </Link>
            </>
          )}
        </>
      }
    >
      <ProfileCompletenessBanner />
      {isClient ? <ClientDashboard /> : <TalentDashboard />}
    </PageShell>
  );
}

async function ProfileCompletenessBanner() {
  const profile = await getProfileForEdit();
  if (!profile) return null;

  const completeness =
    profile.role === UserRole.TALENT
      ? getTalentProfileCompleteness({
          ...profile,
          talentProfile: profile.talentProfile
            ? { ...profile.talentProfile, skills: profile.talentProfile.skills }
            : null,
        })
      : getClientProfileCompleteness(profile);

  if (completeness.percent >= 100) return null;

  return (
    <Card className="mb-8 border-amber-200 bg-amber-50">
      <CardBody>
        <p className="font-medium text-amber-900">Complete your profile ({completeness.percent}%)</p>
        <p className="mt-1 text-sm text-amber-800">
          Still needed: {completeness.missing.join(", ")}.
        </p>
        <Link href={routes.profile} className="mt-3 inline-block text-sm font-medium text-amber-900 underline">
          Finish profile
        </Link>
      </CardBody>
    </Card>
  );
}

async function ClientDashboard() {
  const [jobs, contracts, received] = await Promise.all([
    getMyJobs(),
    getMyContracts(true),
    getReceivedProposals(),
  ]);

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Proposals received</h2>
        </div>
        {received.length === 0 ? (
          <EmptyState
            title="No new proposals"
            description="Proposals from freelancers will appear here."
          />
        ) : (
          <ul className="space-y-3">
            {received.map((p) => (
              <li key={p.id}>
                <Card>
                  <CardBody className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <Link href={routes.job(p.job.slug)} className="font-medium text-blue-600 hover:underline">
                        {p.job.title}
                      </Link>
                      <p className="mt-1 text-sm text-slate-600">
                        {p.talent.firstName} {p.talent.lastName} · {formatMoney(Number(p.bidAmount))}
                      </p>
                    </div>
                    <Badge>{proposalStatusLabel(p.status)}</Badge>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Your jobs</h2>
          <Link href={routes.postJob} className="text-sm font-medium text-blue-600">
            Post new
          </Link>
        </div>
        {jobs.length === 0 ? (
          <EmptyState
            title="No jobs yet"
            description="Post your first project to start receiving proposals."
            action={{ label: "Post a job", href: routes.postJob }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <div key={job.id}>
                {job.status === "DRAFT" && (
                  <Badge variant="muted" className="mb-2">
                    Draft
                  </Badge>
                )}
                <JobCard
                  slug={job.slug}
                  title={job.title}
                  description={job.description}
                  budgetMin={job.budgetMin}
                  budgetMax={job.budgetMax}
                  billingMode={job.billingMode}
                  environment={job.environment}
                  proposalCount={job._count.proposals}
                  location={{ city: job.city, country: job.country, postcode: job.postcode }}
                />
                <Link href={routes.jobEdit(job.slug)} className="mt-2 inline-block text-sm font-medium text-blue-600">
                  Edit job
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
      <ContractsSection contracts={contracts} title="Active contracts" />
    </div>
  );
}

async function TalentDashboard() {
  const [proposals, contracts, profile] = await Promise.all([
    getMyProposals(),
    getMyContracts(true),
    getProfileForEdit(),
  ]);

  const stripeReady = profile?.talentProfile?.stripePayoutsEnabled;

  return (
    <div className="space-y-10">
      {!stripeReady && (
        <Card className="border-amber-200 bg-amber-50">
          <CardBody>
            <p className="font-medium text-amber-900">Set up payouts to get paid</p>
            <p className="mt-1 text-sm text-amber-800">
              Complete Stripe Connect onboarding before clients can fund milestones.
            </p>
            <Link href={routes.payouts} className="mt-3 inline-block text-sm font-medium text-amber-900 underline">
              Go to payouts
            </Link>
          </CardBody>
        </Card>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Your proposals</h2>
        {proposals.length === 0 ? (
          <EmptyState
            title="No proposals yet"
            description="Browse open jobs and submit your first proposal."
            action={{ label: "Find jobs", href: routes.jobs }}
          />
        ) : (
          <ul className="space-y-3">
            {proposals.map((p) => (
              <li key={p.id}>
                <Card>
                  <CardBody className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <Link href={routes.job(p.job.slug)} className="font-medium text-blue-600 hover:underline">
                        {p.job.title}
                      </Link>
                      <p className="mt-1 text-sm text-slate-600">
                        {formatMoney(Number(p.bidAmount))} · {p.deliveryDays} days
                      </p>
                    </div>
                    <Badge variant={p.status === "ACCEPTED" ? "success" : "default"}>
                      {proposalStatusLabel(p.status)}
                    </Badge>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
      <ContractsSection contracts={contracts} title="Active contracts" />
    </div>
  );
}

function ContractsSection({
  contracts,
  title,
}: {
  contracts: Awaited<ReturnType<typeof getMyContracts>>;
  title: string;
}) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
      {contracts.length === 0 ? (
        <EmptyState title="No active contracts" description="Contracts appear after you send or accept an offer." />
      ) : (
        <ul className="space-y-3">
          {contracts.map((c) => (
            <li key={c.id}>
              <Link href={routes.contract(c.id)}>
                <Card className="transition hover:border-blue-200 hover:shadow-md">
                  <CardBody className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{c.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{formatMoney(Number(c.amount))}</p>
                    </div>
                    <Badge variant={c.status === "ACTIVE" ? "success" : "info"}>
                      {contractStatusLabel(c.status)}
                    </Badge>
                  </CardBody>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
