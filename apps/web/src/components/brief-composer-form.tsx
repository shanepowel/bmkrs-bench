"use client";

import { useState } from "react";
import { createStudioBrief } from "@/actions/briefs";
import { C, Label, mono, PrimaryButton, TextArea, TextField } from "@/lib/bench-ui";

export type InvitePartner = {
  userId: string;
  name: string;
  disciplines: string[];
};

export function BriefComposerForm({ partners }: { partners: InvitePartner[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <form action={createStudioBrief} className="max-w-2xl space-y-5">
      <div>
        <Label>project title</Label>
        <TextField name="title" placeholder="project copper" required />
      </div>
      <div>
        <Label>brief</Label>
        <TextArea
          name="description"
          rows={6}
          placeholder="what needs doing, by when, and what good looks like…"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>budget min (£)</Label>
          <TextField name="budgetMin" type="number" defaultValue="3000" required />
        </div>
        <div>
          <Label>budget max (£)</Label>
          <TextField name="budgetMax" type="number" defaultValue="6000" required />
        </div>
        <div>
          <Label>delivery (days)</Label>
          <TextField name="deliveryDays" type="number" defaultValue="14" required />
        </div>
      </div>

      <div>
        <Label>invite partners</Label>
        <p className="mb-3 text-[13px]" style={{ color: C.paperFaint }}>
          pick from the bench. they see yes / no / when on their home.
        </p>
        <div className="space-y-2">
          {partners.map((p) => {
            const on = selected.includes(p.userId);
            return (
              <label
                key={p.userId}
                className="flex cursor-pointer items-center gap-3 py-2"
                style={{ borderTop: `1px solid ${C.paperRule}` }}
              >
                <input
                  type="checkbox"
                  name="partnerIds"
                  value={p.userId}
                  checked={on}
                  onChange={() =>
                    setSelected(on ? selected.filter((id) => id !== p.userId) : [...selected, p.userId])
                  }
                  className="rounded border-slate-300"
                />
                <span className="font-medium">{p.name}</span>
                <span style={{ ...mono, color: C.paperFaint }} className="text-[12px]">
                  {p.disciplines.join(" · ")}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <PrimaryButton type="submit">send brief invites</PrimaryButton>
    </form>
  );
}
