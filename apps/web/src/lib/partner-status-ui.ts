import { PartnerStatus } from "@bench/database";
import type { StatusKind } from "@/lib/bench-ui";

export function partnerStatusKind(status: PartnerStatus): StatusKind {
  switch (status) {
    case PartnerStatus.APPLIED:
      return "applied";
    case PartnerStatus.REVIEWED:
      return "reviewed";
    case PartnerStatus.TRUSTED:
      return "trusted";
    case PartnerStatus.CORE:
      return "core";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
