import { ContractStatus, MilestoneStatus, ProposalStatus } from "@bench/database";

export const MILESTONE_STATUS_LABEL: Record<MilestoneStatus, string> = {
  PENDING: "Awaiting payment",
  FUNDED: "Funded — in escrow",
  SUBMITTED: "Work submitted",
  APPROVED: "Approved",
  PAID: "Paid out",
  CANCELLED: "Cancelled",
};

export function formatEnumLabel(value: string) {
  return value.toLowerCase().replace(/_/g, " ");
}

export function proposalStatusLabel(status: ProposalStatus) {
  return formatEnumLabel(status);
}

export function contractStatusLabel(status: ContractStatus) {
  return formatEnumLabel(status);
}
