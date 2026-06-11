import { SkillPicker } from "@/components/skill-picker";
import { Button } from "@/components/ui/button";

type Skill = { id: string; name: string; slug: string };
type Category = { id: string; name: string; slug: string };

type JobFormProps = {
  skills: Skill[];
  categories?: Category[];
  selectedSkillIds?: string[];
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    title?: string;
    description?: string;
    budgetMin?: number;
    budgetMax?: number;
    billingMode?: string;
    environment?: string;
    experienceLevel?: string;
    country?: string;
    city?: string;
    postcode?: string;
    categoryId?: string;
    featured?: boolean;
    urgent?: boolean;
  };
  isDraft?: boolean;
};

export function JobForm({
  skills,
  categories = [],
  selectedSkillIds,
  action,
  defaultValues,
  isDraft,
}: JobFormProps) {
  const d = defaultValues ?? {};

  return (
    <form action={action} className="space-y-5">
      <label className="block text-sm">
        <span className="font-medium">Title</span>
        <input
          name="title"
          required
          minLength={5}
          defaultValue={d.title}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">Description</span>
        <textarea
          name="description"
          required
          minLength={20}
          rows={8}
          defaultValue={d.description}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Min budget ($)</span>
          <input
            name="budgetMin"
            type="number"
            min={0}
            required
            defaultValue={d.budgetMin}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Max budget ($)</span>
          <input
            name="budgetMax"
            type="number"
            min={0}
            required
            defaultValue={d.budgetMax}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Select name="billingMode" label="Type" options={["FIXED", "HOURLY"]} defaultValue={d.billingMode} />
        <Select name="environment" label="Environment" options={["REMOTE", "ONSITE", "HYBRID"]} defaultValue={d.environment} />
        <Select name="experienceLevel" label="Experience" options={["ENTRY", "INTERMEDIATE", "EXPERT"]} defaultValue={d.experienceLevel} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="font-medium">Postcode</span>
          <input name="postcode" defaultValue={d.postcode} placeholder="e.g. M1 1AA" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
        </label>
        <label className="block text-sm">
          <span className="font-medium">City</span>
          <input name="city" defaultValue={d.city} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Country</span>
          <input name="country" defaultValue={d.country} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
        </label>
      </div>
      {categories.length > 0 && (
        <label className="block text-sm">
          <span className="font-medium">Category</span>
          <select
            name="categoryId"
            defaultValue={d.categoryId ?? ""}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <SkillPicker skills={skills} selectedIds={selectedSkillIds} />
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" defaultChecked={d.featured} className="rounded" />
          Feature this job
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="urgent" defaultChecked={d.urgent} className="rounded" />
          Mark as urgent
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" name="publish" value="true">
          {isDraft ? "Publish job" : "Save & publish"}
        </Button>
        {!isDraft && (
          <Button type="submit" name="publish" value="false" variant="secondary">
            Save as draft
          </Button>
        )}
        {isDraft && (
          <Button type="submit" name="publish" value="false" variant="secondary">
            Save draft
          </Button>
        )}
      </div>
    </form>
  );
}

function Select({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue ?? options[0]}
        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 capitalize"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.toLowerCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
