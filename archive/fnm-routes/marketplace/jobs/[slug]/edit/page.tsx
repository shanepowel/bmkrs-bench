import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { JobStatus } from "@bench/database";
import { listCategories } from "@/actions/categories";
import { getJobBySlug, updateJob, publishJob } from "@/actions/jobs";
import { listSkills } from "@/actions/skills";
import { getCurrentUser } from "@/lib/auth";
import { routes } from "@/lib/routes";
import { JobForm } from "@/components/job-form";
import { Button } from "@/components/ui/button";

export default async function EditJobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(routes.login);

  const job = await getJobBySlug(slug);
  if (!job || job.posterId !== user.id) notFound();

  const [skills, categories] = await Promise.all([listSkills(), listCategories()]);
  const selectedSkillIds = job.skills.map((s) => s.skillId);
  const update = updateJob.bind(null, slug);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link href={`/jobs/${slug}`} className="text-sm text-blue-600">
        ← Back to job
      </Link>
      <h1 className="mt-6 font-serif text-4xl text-slate-900">Edit job</h1>
      <p className="mt-2 capitalize text-slate-600">Status: {job.status.toLowerCase()}</p>

      {job.status === JobStatus.DRAFT && (
        <form action={publishJob.bind(null, slug)} className="mt-4">
          <Button type="submit">Publish now</Button>
        </form>
      )}

      <div className="mt-8">
        <JobForm
          skills={skills}
          categories={categories}
          selectedSkillIds={selectedSkillIds}
          action={update}
          isDraft={job.status === JobStatus.DRAFT}
          defaultValues={{
            title: job.title,
            description: job.description,
            budgetMin: Number(job.budgetMin),
            budgetMax: Number(job.budgetMax),
            billingMode: job.billingMode,
            environment: job.environment,
            experienceLevel: job.experienceLevel,
            country: job.country ?? undefined,
            city: job.city ?? undefined,
            categoryId: job.categoryId ?? undefined,
            featured: job.featured,
            urgent: job.urgent,
          }}
        />
      </div>
    </div>
  );
}
