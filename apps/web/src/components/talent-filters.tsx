import { listSkills } from "@/actions/skills";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/lib/routes";

type TalentFiltersProps = {
  searchParams: Record<string, string | undefined>;
};

export async function TalentFilters({ searchParams }: TalentFiltersProps) {
  const skills = await listSkills();
  const sp = searchParams;

  return (
    <form method="get" className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input name="q" defaultValue={sp.q} placeholder="Search by name or headline…" className="flex-1 bg-white" />
        <Button type="submit">Search</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Skill</span>
          <select
            name="skill"
            defaultValue={sp.skill ?? ""}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            <option value="">Any skill</option>
            {skills.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Availability</span>
          <select
            name="availability"
            defaultValue={sp.availability ?? ""}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            <option value="">Any</option>
            <option value="open">Available</option>
            <option value="limited">Limited</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Min rate ($/hr)</span>
          <Input name="minRate" type="number" min={0} defaultValue={sp.minRate} className="mt-1 bg-white" />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Max rate ($/hr)</span>
          <Input name="maxRate" type="number" min={0} defaultValue={sp.maxRate} className="mt-1 bg-white" />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Near postcode</span>
          <Input name="nearPostcode" defaultValue={sp.nearPostcode} placeholder="e.g. M1 1AA" className="mt-1 bg-white" />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Radius</span>
          <select
            name="radiusMiles"
            defaultValue={sp.radiusMiles ?? ""}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            <option value="">Any distance</option>
            <option value="10">Within 10 miles</option>
            <option value="25">Within 25 miles</option>
            <option value="50">Within 50 miles</option>
          </select>
        </label>
      </div>

      <a href={routes.talents} className="text-sm text-blue-600 hover:underline">
        Clear filters
      </a>
    </form>
  );
}
