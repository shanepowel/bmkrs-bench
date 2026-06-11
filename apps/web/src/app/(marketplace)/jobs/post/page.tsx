import { UserRole } from "@bench/database";
import { listCategories } from "@/actions/categories";
import { createJob } from "@/actions/jobs";
import { listSkills } from "@/actions/skills";
import { PageShell } from "@/components/layout/page-shell";
import { JobForm } from "@/components/job-form";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export default async function PostJobPage() {
  await requireRole(UserRole.CLIENT);
  const [skills, categories] = await Promise.all([listSkills(), listCategories()]);

  return (
    <PageShell
      title="Post a job"
      description="Describe your project so talent can submit proposals"
      back={{ href: routes.dashboard, label: "Dashboard" }}
      width="lg"
    >
      <JobForm skills={skills} categories={categories} action={createJob} />
    </PageShell>
  );
}
