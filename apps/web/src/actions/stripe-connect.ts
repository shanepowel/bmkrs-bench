"use server";

import { prisma, UserRole } from "@bench/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole, requireUser } from "@/lib/auth";
import { appUrl, getStripe, isStripeConfigured } from "@/lib/stripe";

export async function getTalentStripeStatus() {
  const user = await requireRole(UserRole.TALENT);
  const profile = await prisma.talentProfile.findUnique({ where: { userId: user.id } });
  return {
    configured: isStripeConfigured(),
    accountId: profile?.stripeAccountId ?? null,
    chargesEnabled: profile?.stripeChargesEnabled ?? false,
    payoutsEnabled: profile?.stripePayoutsEnabled ?? false,
    ready: Boolean(profile?.stripeChargesEnabled && profile?.stripePayoutsEnabled),
  };
}

export async function startStripeConnectOnboarding(): Promise<void> {
  if (!isStripeConfigured()) throw new Error("Stripe is not configured");

  const user = await requireRole(UserRole.TALENT);
  const stripe = getStripe();

  let profile = await prisma.talentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    profile = await prisma.talentProfile.create({ data: { userId: user.id } });
  }

  let accountId = profile.stripeAccountId;
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
      metadata: { userId: user.id, clerkId: user.clerkId },
    });
    accountId = account.id;
    await prisma.talentProfile.update({
      where: { userId: user.id },
      data: { stripeAccountId: accountId },
    });
  }

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: appUrl("/settings/payouts?refresh=1"),
    return_url: appUrl("/settings/payouts?connected=1"),
    type: "account_onboarding",
  });

  redirect(link.url);
}

export async function refreshStripeConnectStatus(): Promise<void> {
  const user = await requireRole(UserRole.TALENT);
  const profile = await prisma.talentProfile.findUnique({ where: { userId: user.id } });
  if (!profile?.stripeAccountId || !isStripeConfigured()) return;

  const account = await getStripe().accounts.retrieve(profile.stripeAccountId);

  await prisma.talentProfile.update({
    where: { userId: user.id },
    data: {
      stripeChargesEnabled: account.charges_enabled ?? false,
      stripePayoutsEnabled: account.payouts_enabled ?? false,
    },
  });

  revalidatePath("/settings/payouts");
}

async function ensureStripeCustomer(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  if (user.stripeCustomerId) return user.stripeCustomerId;

  const customer = await getStripe().customers.create({
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    metadata: { userId: user.id },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export { ensureStripeCustomer };
