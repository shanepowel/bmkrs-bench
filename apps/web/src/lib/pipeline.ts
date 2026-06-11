import { PartnerStatus } from "@bench/database";

export const DAY_RATE_BANDS = [
  "£250–350/day",
  "£350–450/day",
  "£450–550/day",
  "£550–700/day",
  "£700+/day",
] as const;

export type DayRateBand = (typeof DAY_RATE_BANDS)[number];

/** Valid studio transitions; every change requires a reason in the audit log. */
export const PARTNER_STATUS_TRANSITIONS: Record<PartnerStatus, PartnerStatus[]> = {
  [PartnerStatus.APPLIED]: [PartnerStatus.REVIEWED, PartnerStatus.TRUSTED],
  [PartnerStatus.REVIEWED]: [PartnerStatus.APPLIED, PartnerStatus.TRUSTED],
  [PartnerStatus.TRUSTED]: [PartnerStatus.REVIEWED, PartnerStatus.CORE],
  [PartnerStatus.CORE]: [PartnerStatus.TRUSTED],
};

export function canTransition(from: PartnerStatus, to: PartnerStatus) {
  return PARTNER_STATUS_TRANSITIONS[from].includes(to);
}

export function promoteLabel(to: PartnerStatus): string {
  switch (to) {
    case PartnerStatus.REVIEWED:
      return "mark reviewed";
    case PartnerStatus.TRUSTED:
      return "add to bench";
    case PartnerStatus.CORE:
      return "mark core team";
    case PartnerStatus.APPLIED:
      return "return to queue";
    default:
      return "update status";
  }
}

export function formatStatusSince(date: Date) {
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}
