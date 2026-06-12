import Link from "next/link";
import { notFound } from "next/navigation";
import { listOpenJobs } from "@/actions/jobs";
import { prisma } from "@bench/database";
import { getTalentsBySkillSlug } from "@/actions/talents";
import { JobCard } from "@/components/job-card";
import { TalentCard } from "@/components/talent-card";
import { PageShell } from "@/components/layout/page-shell";
import { routes } from "@/lib/routes";
import { safeDbQuery } from "@/lib/db-safe";

export default async function HireBySkillPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill: skillSlug } = await params;

  const skill = await safeDbQuery(
    () => prisma.skill.findUnique({ where: { slug: skillSlug }, include: { category: true } }),
    null
  );
  if (!skill) notFound();

  const [talents, jobs] = await Promise.all([
    getTalentsBySkillSlug(skillSlug),
    listOpenJobs({ skill: skillSlug }),
  ]);

  return (
    <PageShell
      title={`Hire ${skill.name} freelancers`}
      description={
        skill.category
          ? `${skill.name} · ${skill.category.name}`
          : `Find talent and projects for ${skill.name}`
      }
      width="full"
    >
      <section>
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-2xl text-slate-900">Talent</h2>
          <Link href={routes.talents} className="text-sm font-medium text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        {talents.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No verified freelancers with this skill yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {talents.map((t) => {
              const reviewCount = t.reviewsReceived.length;
              const averageRating =
                reviewCount > 0
                  ? t.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / reviewCount
                  : 0;
              return (
                <TalentCard
                  key={t.id}
                  username={t.username}
                  firstName={t.firstName}
                  lastName={t.lastName}
                  headline={t.talentProfile?.headline}
                  hourlyRate={t.talentProfile?.hourlyRate}
                  availability={t.talentProfile?.availability}
                  verified={t.talentProfile?.verified}
                  skills={t.talentProfile?.skills}
                  averageRating={averageRating}
                  reviewCount={reviewCount}
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-2xl text-slate-900">Open jobs</h2>
          <Link href={routes.jobs} className="text-sm font-medium text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        {jobs.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No open jobs tagged with this skill.</p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                slug={job.slug}
                title={job.title}
                description={job.description}
                budgetMin={job.budgetMin}
                budgetMax={job.budgetMax}
                billingMode={job.billingMode}
                environment={job.environment}
                featured={job.featured}
                urgent={job.urgent}
                category={job.category}
                poster={job.poster}
                proposalCount={job._count.proposals}
              />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
