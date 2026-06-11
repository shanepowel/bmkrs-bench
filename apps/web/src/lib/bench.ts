import { PartnerStatus, UserRole, type User } from "@bench/database";

/** Product language for persisted UserRole values. */
export const roleLabel: Record<UserRole, string> = {
  [UserRole.APPLICANT]: "applicant",
  [UserRole.CLIENT]: "client",
  [UserRole.TALENT]: "partner",
  [UserRole.ADMIN]: "studio",
};

export const partnerStatusLabel: Record<PartnerStatus, string> = {
  [PartnerStatus.APPLIED]: "applied",
  [PartnerStatus.REVIEWED]: "reviewed",
  [PartnerStatus.TRUSTED]: "trusted",
  [PartnerStatus.CORE]: "core",
};

export function isStudio(user: Pick<User, "role">) {
  return user.role === UserRole.ADMIN;
}

export function isPartner(user: Pick<User, "role">) {
  return user.role === UserRole.TALENT;
}

export function isClient(user: Pick<User, "role">) {
  return user.role === UserRole.CLIENT;
}

export function isApplicant(user: Pick<User, "role">) {
  return user.role === UserRole.APPLICANT;
}

export function homeForRole(role: UserRole): string {
  switch (role) {
    case UserRole.APPLICANT:
      return "/application";
    case UserRole.TALENT:
      return "/partner";
    case UserRole.CLIENT:
      return "/client";
    case UserRole.ADMIN:
      return "/studio";
    default:
      return "/dashboard";
  }
}
