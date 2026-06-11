"use client";

import { promotePartnerStatus } from "@/actions/pipeline";
import { C, mono, Label, PrimaryButton, TextArea } from "@/lib/bench-ui";

export type PipelineTransition = {
  toStatus: string;
  label: string;
  primary: boolean;
};

export function PipelinePromotePanel({
  talentProfileId,
  transitions,
}: {
  talentProfileId: string;
  transitions: PipelineTransition[];
}) {
  if (transitions.length === 0) return null;

  return (
    <div className="space-y-4 p-5" style={{ border: `1px solid ${C.paperRule}` }}>
      <p style={{ ...mono, color: C.paperFaint }} className="text-[11px] uppercase tracking-[0.08em]">
        change status
      </p>
      {transitions.map((transition, index) => (
        <form
          key={transition.toStatus}
          action={promotePartnerStatus}
          className="space-y-3 pt-4 first:pt-0"
          style={{ borderTop: index > 0 ? `1px solid ${C.paperRule}` : undefined }}
        >
          <input type="hidden" name="talentProfileId" value={talentProfileId} />
          <input type="hidden" name="toStatus" value={transition.toStatus} />
          <p className="text-[15px] font-medium">{transition.label}</p>
          <div>
            <Label>reason (required)</Label>
            <TextArea
              name="reason"
              required
              rows={2}
              placeholder="portfolio strong, references checked, trial brief completed"
            />
          </div>
          {transition.primary ? (
            <PrimaryButton type="submit">{transition.label}</PrimaryButton>
          ) : (
            <button
              type="submit"
              className="rounded-full border px-6 py-3 text-[14px] font-medium transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none"
              style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperText, background: "transparent" }}
            >
              {transition.label}
            </button>
          )}
        </form>
      ))}
    </div>
  );
}
