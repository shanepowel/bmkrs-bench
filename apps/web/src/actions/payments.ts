"use server";

import {
  prisma,
  ContractStatus,
  MilestoneStatus,
  ActivityType,
  NotificationType,
  PaymentTransactionType,
} from "@bench/database";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  appUrl,
  getStripe,
  isPaymentsEnabled,
  platformFeePercent,
  toCents,
} from "@/lib/stripe";
import { ensureStripeCustomer } from "@/actions/stripe-connect";
import { logContractActivity } from "@/lib/contract-activity";
import { pushNotification } from "@/lib/in-app-notify";
import { notifyMilestonePaid } from "@/lib/notifications";
import { formatMoney } from "@/lib/utils";
import { recordPaymentTransaction } from "@/lib/payment-ledger";
import { revalidatePath } from "next/cache";

export async function createMilestoneCheckout(milestoneId: string): Promise<void> {
  if (!isPaymentsEnabled()) throw new Error("In-platform payments are disabled");

  const user = await requireUser();
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: {
      contract: {
        include: {
          talent: { include: { talentProfile: true } },
        },
      },
    },
  });

  if (!milestone) throw new Error("Milestone not found");
  if (milestone.contract.clientId !== user.id) throw new Error("Not authorized");
  if (milestone.status !== MilestoneStatus.PENDING) {
    throw new Error("Milestone is not awaiting payment");
  }
  if (milestone.contract.status !== ContractStatus.ACTIVE) {
    throw new Error("Contract must be active");
  }

  const talentProfile = milestone.contract.talent.talentProfile;
  if (!talentProfile?.stripeAccountId || !talentProfile.stripeChargesEnabled) {
    throw new Error("Talent must complete Stripe payout setup first");
  }

  const customerId = await ensureStripeCustomer(user.id);
  const amountCents = toCents(milestone.amount.toString());

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: {
            name: milestone.title,
            description: milestone.description ?? `Contract: ${milestone.contract.title}`,
          },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      metadata: {
        milestoneId: milestone.id,
        contractId: milestone.contractId,
        type: "milestone_fund",
      },
    },
    metadata: {
      milestoneId: milestone.id,
      contractId: milestone.contractId,
    },
    success_url: appUrl(`/contracts/${milestone.contractId}?funded=1`),
    cancel_url: appUrl(`/contracts/${milestone.contractId}?cancelled=1`),
  });

  if (!session.url) throw new Error("Failed to create checkout session");
  redirect(session.url);
}

/** Release payout after client approves (for milestones funded on platform without destination charge). */
export async function releaseMilestonePayment(milestoneId: string): Promise<void> {
  const user = await requireUser();
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: {
      contract: {
        include: {
          talent: { include: { talentProfile: true } },
        },
      },
    },
  });

  if (!milestone) throw new Error("Milestone not found");
  if (milestone.contract.clientId !== user.id) throw new Error("Not authorized");
  if (milestone.status !== MilestoneStatus.APPROVED) {
    throw new Error("Milestone must be approved before release");
  }

  if (!isPaymentsEnabled()) {
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: MilestoneStatus.PAID, paidAt: new Date() },
    });
    revalidatePath(`/contracts/${milestone.contractId}`);
    return;
  }

  const talentAccount = milestone.contract.talent.talentProfile?.stripeAccountId;
  if (!talentAccount) throw new Error("Talent Stripe account missing");

  const amountCents = toCents(milestone.amount.toString());
  const feePercent = platformFeePercent();
  const transferAmount = Math.round(amountCents * (1 - feePercent / 100));

  if (milestone.stripeTransferId) {
    revalidatePath(`/contracts/${milestone.contractId}`);
    return;
  }

  const transfer = await getStripe().transfers.create({
    amount: transferAmount,
    currency: "usd",
    destination: talentAccount,
    metadata: { milestoneId: milestone.id },
  });

  const gross = Number(milestone.amount);
  const platformFee = gross * (feePercent / 100);
  const netAmount = transferAmount / 100;

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      status: MilestoneStatus.PAID,
      stripeTransferId: transfer.id,
      paidAt: new Date(),
    },
  });

  await recordPaymentTransaction({
    contractId: milestone.contractId,
    milestoneId: milestone.id,
    payerId: milestone.contract.clientId,
    payeeId: milestone.contract.talentId,
    type: PaymentTransactionType.RELEASE,
    amount: Number(milestone.amount),
    platformFee,
    netAmount,
    stripeTransferId: transfer.id,
    receiptUrl: `https://dashboard.stripe.com/connect/transfers/${transfer.id}`,
  });

  await notifyMilestonePaid({
    talentEmail: milestone.contract.talent.email,
    milestoneTitle: milestone.title,
    amount: formatMoney(transferAmount / 100),
  });

  await logContractActivity({
    contractId: milestone.contractId,
    actorId: user.id,
    type: ActivityType.MILESTONE_PAID,
    title: `Paid out: ${milestone.title}`,
    body: formatMoney(transferAmount / 100),
  });

  await pushNotification({
    userId: milestone.contract.talentId,
    type: NotificationType.MILESTONE,
    title: "Milestone payout sent",
    body: `${milestone.title} — ${formatMoney(transferAmount / 100)}`,
    href: `/contracts/${milestone.contractId}`,
  });

  revalidatePath(`/contracts/${milestone.contractId}`);
}
