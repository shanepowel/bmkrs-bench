"use client";

import { useState } from "react";
import { C, mono } from "@/lib/bench-ui";

type Skill = { id: string; name: string };

export function BenchSkillPicker({
  skills,
  selectedIds = [],
}: {
  skills: Skill[];
  selectedIds?: string[];
}) {
  const [selected, setSelected] = useState<string[]>(selectedIds);

  if (skills.length === 0) {
    return <p style={{ ...mono, color: C.paperFaint }} className="text-[12px]">no disciplines in database.</p>;
  }

  return (
    <fieldset>
      <legend style={{ ...mono, color: C.paperBody }} className="mb-2 text-[12px]">
        disciplines
      </legend>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => {
          const on = selected.includes(skill.id);
          return (
            <label key={skill.id} className="cursor-pointer">
              <input
                type="checkbox"
                name="skillIds"
                value={skill.id}
                checked={on}
                onChange={() =>
                  setSelected(on ? selected.filter((id) => id !== skill.id) : [...selected, skill.id])
                }
                className="sr-only"
              />
              <span
                className="inline-block rounded-full border px-4 py-2 text-[13px] transition-colors"
                style={
                  on
                    ? { background: C.ink, color: C.paper, borderColor: C.ink }
                    : { color: C.paperBody, borderColor: "rgba(24,22,19,0.25)" }
                }
              >
                {skill.name.toLowerCase()}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
