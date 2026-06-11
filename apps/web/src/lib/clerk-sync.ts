import { PartnerStatus, prisma, UserRole } from "@bench/database";

/** Clerk webhook / API user payload (snake_case) */
export type ClerkUserPayload = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  image_url?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: { id: string; email_address: string }[];
  public_metadata?: Record<string, unknown>;
  unsafe_metadata?: Record<string, unknown>;
};

function resolveRole(clerkUser: ClerkUserPayload): UserRole {
  const publicRole = clerkUser.public_metadata?.role as string | undefined;
  if (publicRole === "CLIENT") return UserRole.CLIENT;
  if (publicRole === "TALENT") return UserRole.TALENT;
  if (publicRole === "ADMIN") return UserRole.ADMIN;
  if (publicRole === "APPLICANT") return UserRole.APPLICANT;

  const signupRole = clerkUser.unsafe_metadata?.signupRole as string | undefined;
  if (signupRole === "client") return UserRole.CLIENT;
  if (signupRole === "talent") return UserRole.TALENT;
  if (signupRole === "applicant") return UserRole.APPLICANT;

  return UserRole.APPLICANT;
}

function primaryEmail(clerkUser: ClerkUserPayload): string | null {
  const primary = clerkUser.email_addresses?.find(
    (e) => e.id === clerkUser.primary_email_address_id
  );
  return (primary?.email_address ?? clerkUser.email_addresses?.[0]?.email_address)?.toLowerCase() ?? null;
}

function defaultUsername(clerkUser: ClerkUserPayload, email: string): string {
  const base =
    clerkUser.username ??
    email.split("@")[0].replace(/[^a-z0-9._-]/gi, "").toLowerCase() ??
    `user_${clerkUser.id.slice(-8)}`;
  return `${base}_${clerkUser.id.slice(-4)}`.slice(0, 30);
}

export async function upsertUserFromClerk(clerkUser: ClerkUserPayload) {
  const email = primaryEmail(clerkUser);
  if (!email) return null;

  const role = resolveRole(clerkUser);
  const username = defaultUsername(clerkUser, email);

  return prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    create: {
      clerkId: clerkUser.id,
      email,
      username,
      firstName: clerkUser.first_name ?? "User",
      lastName: clerkUser.last_name ?? "",
      role,
      avatarUrl: clerkUser.image_url ?? undefined,
      ...(role === UserRole.CLIENT
        ? { clientProfile: { create: {} } }
        : {
            talentProfile: {
              create: {
                partnerStatus:
                  role === UserRole.APPLICANT ? PartnerStatus.APPLIED : PartnerStatus.REVIEWED,
              },
            },
          }),
    },
    update: {
      email,
      firstName: clerkUser.first_name ?? undefined,
      lastName: clerkUser.last_name ?? undefined,
      avatarUrl: clerkUser.image_url ?? undefined,
    },
    include: { clientProfile: true, talentProfile: true },
  });
}

export async function deleteUserByClerkId(clerkId: string) {
  await prisma.user.deleteMany({ where: { clerkId } });
}
