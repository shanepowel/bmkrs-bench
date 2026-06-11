import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/actions/categories";
import { listOpenJobs } from "@/actions/jobs";
import { JobCard } from "@/components/job-card";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };

  const description =
    category.description ??
    `Find freelancers and open jobs in ${category.name} on Freelance Near Me.`;

  return {
    title: `${category.name} freelancers and jobs`,
    description,
    openGraph: { title: category.name, description },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const jobs = await listOpenJobs({ category: slug });

  return (
    <PageShell
      title={category.name}
      description={category.description ?? `Open projects in ${category.name.toLowerCase()}`}
      back={{ href: routes.categories, label: "All categories" }}
      width="full"
    >
      {category.isLocal && (
        <Badge variant="info" className="mb-6">
          Often delivered in person near you
        </Badge>
      )}
      {category.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-700">Popular skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <Link
                key={skill.id}
                href={routes.hire(skill.slug)}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {skill.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {jobs.length === 0 ? (
        <EmptyState
          title="No open jobs in this category"
          description="Check back soon or browse all projects."
          action={{ label: "Browse all jobs", href: routes.jobs }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
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
    </PageShell>
  );
}
