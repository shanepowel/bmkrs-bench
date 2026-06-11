type Skill = { id: string; name: string; slug: string };

export function SkillPicker({
  skills,
  selectedIds = [],
}: {
  skills: Skill[];
  selectedIds?: string[];
}) {
  if (skills.length === 0) {
    return <p className="text-sm text-slate-500">No skills in database. Run db:seed.</p>;
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-900">Skills</legend>
      <div className="mt-2 flex flex-wrap gap-3">
        {skills.map((skill) => (
          <label
            key={skill.id}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-blue-300"
          >
            <input
              type="checkbox"
              name="skillIds"
              value={skill.id}
              defaultChecked={selectedIds.includes(skill.id)}
              className="rounded border-slate-300"
            />
            {skill.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
