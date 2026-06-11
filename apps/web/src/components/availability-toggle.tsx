"use client";

import { updateAvailability } from "@/actions/profile";
import { C, mono } from "@/lib/bench-ui";

const OPTIONS = [
  { value: "open", label: "available" },
  { value: "limited", label: "booked" },
  { value: "unavailable", label: "away" },
] as const;

export function AvailabilityToggle({ current }: { current: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {OPTIONS.map((opt) => {
        const active =
          (opt.value === "open" && current === "open") ||
          (opt.value === "limited" && current === "limited") ||
          (opt.value === "unavailable" && current === "unavailable");
        return (
          <form key={opt.value} action={updateAvailability}>
            <input type="hidden" name="availability" value={opt.value} />
            <button
              type="submit"
              className="rounded-full border px-4 py-2 text-[13px] transition-colors"
              style={
                active
                  ? { background: C.ink, color: C.paper, borderColor: C.ink }
                  : { color: C.paperBody, borderColor: "rgba(24,22,19,0.25)" }
              }
            >
              · {opt.label}
            </button>
          </form>
        );
      })}
      <p style={{ ...mono, color: C.paperFaint }} className="w-full text-[11px]">
        this is what the studio sees when staffing. keep it honest and you get briefs that actually fit.
      </p>
    </div>
  );
}
