"use client";

import { promotePartnerStatus } from "@/actions/pipeline";

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
    <div className="space-y-4 border border-[color:var(--surface-rule)] p-5">
      <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
        change status
      </p>
      {transitions.map((transition) => (
        <form
          key={transition.toStatus}
          action={promotePartnerStatus}
          className="space-y-3 border-t border-[color:var(--surface-rule)] pt-4 first:border-t-0 first:pt-0"
        >
          <input type="hidden" name="talentProfileId" value={talentProfileId} />
          <input type="hidden" name="toStatus" value={transition.toStatus} />
          <p className="text-body text-[var(--surface-heading)]">{transition.label}</p>
          <label className="block">
            <span className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
              reason (required)
            </span>
            <textarea
              name="reason"
              required
              rows={2}
              placeholder="portfolio strong, references checked, trial brief completed"
              className="mt-2 w-full border border-[color:var(--surface-rule)] bg-transparent px-3 py-2 text-body text-[var(--surface-heading)] placeholder:text-[var(--surface-meta)] focus:border-[#FF4D00]"
            />
          </label>
          <button
            type="submit"
            className={
              transition.primary
                ? "bg-[#FF4D00] px-5 py-2.5 text-body font-medium text-[#181613]"
                : "border border-[color:var(--surface-rule)] px-5 py-2.5 text-body text-[var(--surface-heading)] hover:border-[var(--surface-accent)]"
            }
          >
            {transition.label}
          </button>
        </form>
      ))}
    </div>
  );
}
