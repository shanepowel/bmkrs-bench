import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma, UserRole, type User } from "@bench/database";
import { redirect } from "next/navigation";
import { upsertUserFromClerk, type ClerkUserPayload } from "@/lib/clerk-sync";
import { homeForRole, isStudio } from "@/lib/bench";
import {
  getBenchSession,
  type BenchRole,
  type BenchSession,
} from "@/lib/bench-session";
import {
  isBenchDevAuth,
  isClerkConfigured,
  isDatabaseConfigured,
  isDevAuthBypass,
} from "@/lib/env";
import { routes } from "@/lib/routes";

const DEV_CLERK_ID: Record<BenchRole, string> = {
  studio: "seed_studio_1",
  client: "seed_client_1",
  partner: "seed_talent_1",
};

async function userForBenchSession(session: BenchSession): Promise<User | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    return await prisma.user.findUnique({ where: { clerkId: DEV_CLERK_ID[session.role] } });
  } catch (error) {
    console.error("[auth] bench session user lookup failed", error);
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isDatabaseConfigured()) return null;

  if (isDevAuthBypass()) {
    const clerkId =
      process.env.DEV_AUTH_USER === "talent" ? "seed_talent_1" : "seed_client_1";
    try {
      return await prisma.user.findUnique({ where: { clerkId } });
    } catch (error) {
      console.error("[auth] dev bypass user lookup failed", error);
      return null;
    }
  }

  if (isBenchDevAuth()) {
    const session = await getBenchSession();
    if (!session) return null;
    return userForBenchSession(session);
  }

  if (!isClerkConfigured()) return null;

  try {
    const { userId } = await auth();
    if (!userId) return null;

    const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (existing) return existing;

    return syncUserFromClerk();
  } catch (error) {
    console.error("[auth] Clerk session lookup failed", error);
    return null;
  }
}

export async function getAuthSession(): Promise<BenchSession | null> {
  if (!isBenchDevAuth()) return null;
  return getBenchSession();
}

export async function requireUser() {
  if (isBenchDevAuth()) {
    const session = await getBenchSession();
    if (!session) redirect(routes.login);
    const user = await userForBenchSession(session);
    if (!user) redirect(routes.login);
    return user;
  }

  if (!isClerkConfigured()) {
    redirect(routes.login);
  }
  if (!isDatabaseConfigured()) {
    throw new Error(
      "Database URL is not configured (connect Neon to this Vercel project or set DATABASE_URL_UNPOOLED)."
    );
  }
  const user = await getCurrentUser();
  if (!user) redirect(routes.login);
  return user;
}

export async function requireRole(role: UserRole) {
  const user = await requireUser();
  if (user.role !== role) redirect(homeForRole(user.role));
  return user;
}

export async function requireStudio() {
  const user = await requireUser();
  if (!isStudio(user)) redirect(homeForRole(user.role));
  return user;
}

export async function syncUserFromClerk(): Promise<User | null> {
  if (!isClerkConfigured() || !isDatabaseConfigured()) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const payload: ClerkUserPayload = {
    id: clerkUser.id,
    first_name: clerkUser.firstName,
    last_name: clerkUser.lastName,
    username: clerkUser.username,
    image_url: clerkUser.imageUrl,
    primary_email_address_id: clerkUser.primaryEmailAddressId,
    email_addresses: clerkUser.emailAddresses.map((e) => ({
      id: e.id,
      email_address: e.emailAddress,
    })),
    public_metadata: clerkUser.publicMetadata as Record<string, unknown>,
    unsafe_metadata: clerkUser.unsafeMetadata as Record<string, unknown>,
  };

  return upsertUserFromClerk(payload);
}
