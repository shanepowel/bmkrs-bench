import { listCategories } from "@/actions/categories";
import { listSkills } from "@/actions/skills";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/lib/routes";

type JobFiltersProps = {
  searchParams: Record<string, string | undefined>;
};

export async function JobFilters({ searchParams }: JobFiltersProps) {
  const [categories, skills] = await Promise.all([listCategories(), listSkills()]);
  const sp = searchParams;

  return (
    <form method="get" className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input name="q" defaultValue={sp.q} placeholder="Search jobs…" className="flex-1 bg-white" />
        <Button type="submit">Search</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect name="category" label="Category" defaultValue={sp.category}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect name="skill" label="Skill" defaultValue={sp.skill}>
          <option value="">Any skill</option>
          {skills.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.name}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect name="environment" label="Work style" defaultValue={sp.environment}>
          <option value="">Any</option>
          <option value="REMOTE">Remote</option>
          <option value="ONSITE">On-site</option>
          <option value="HYBRID">Hybrid</option>
        </FilterSelect>

        <FilterSelect name="billingMode" label="Budget type" defaultValue={sp.billingMode}>
          <option value="">Any</option>
          <option value="FIXED">Fixed price</option>
          <option value="HOURLY">Hourly</option>
        </FilterSelect>

        <FilterSelect name="experienceLevel" label="Experience" defaultValue={sp.experienceLevel}>
          <option value="">Any</option>
          <option value="ENTRY">Entry</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="EXPERT">Expert</option>
        </FilterSelect>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Min budget ($)</span>
          <Input name="minBudget" type="number" min={0} defaultValue={sp.minBudget} className="mt-1 bg-white" />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Max budget ($)</span>
          <Input name="maxBudget" type="number" min={0} defaultValue={sp.maxBudget} className="mt-1 bg-white" />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Near postcode</span>
          <Input name="nearPostcode" defaultValue={sp.nearPostcode} placeholder="e.g. M1 1AA" className="mt-1 bg-white" />
        </label>

        <FilterSelect name="radiusMiles" label="Radius" defaultValue={sp.radiusMiles}>
          <option value="">Any distance</option>
          <option value="10">Within 10 miles</option>
          <option value="25">Within 25 miles</option>
          <option value="50">Within 50 miles</option>
        </FilterSelect>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" defaultChecked={sp.featured === "1"} className="rounded" />
          Featured only
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="urgent" defaultChecked={sp.urgent === "1"} className="rounded" />
          Urgent only
        </label>
        <a href={routes.jobs} className="ml-auto text-blue-600 hover:underline">
          Clear filters
        </a>
      </div>
    </form>
  );
}

function FilterSelect({
  name,
  label,
  defaultValue,
  children,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 capitalize"
      >
        {children}
      </select>
    </label>
  );
}
