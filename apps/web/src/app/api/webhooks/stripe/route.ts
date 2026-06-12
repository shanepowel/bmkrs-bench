import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  prisma,
  MilestoneStatus,
  ActivityType,
  NotificationType,
  PaymentTransactionType,
} from "@bench/database";
import { recordPaymentTransaction } from "@/lib/payment-ledger";
import { logContractActivity } from "@/lib/contract-activity";
import { pushNotification } from "@/lib/in-app-notify";
import { notifyMilestoneFunded } from "@/lib/notifications";
import { formatMoney } from "@/lib/utils";
import { getStripe, isPaymentsEnabled } from "@/lib/stripe";

export async function POST(req: Request) {
  if (!isPaymentsEnabled()) {
    return NextResponse.json({ ok: true, skipped: "payments disabled" });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET not configured" }, { status: 500 });
  }

  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      await handleAccountUpdated(account);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const milestoneId = session.metadata?.milestoneId;
  if (!milestoneId) return;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  const milestone = await prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      status: MilestoneStatus.FUNDED,
      stripePaymentIntentId: paymentIntentId ?? undefined,
      fundedAt: new Date(),
    },
    include: {
      contract: { include: { client: true, talent: true } },
    },
  });

  await recordPaymentTransaction({
    contractId: milestone.contractId,
    milestoneId: milestone.id,
    payerId: milestone.contract.clientId,
    payeeId: milestone.contract.talentId,
    type: PaymentTransactionType.FUND,
    amount: Number(milestone.amount),
    stripePaymentIntentId: paymentIntentId ?? undefined,
    receiptUrl: paymentIntentId
      ? `https://dashboard.stripe.com/payments/${paymentIntentId}`
      : undefined,
  });

  await notifyMilestoneFunded({
    talentEmail: milestone.contract.talent.email,
    milestoneTitle: milestone.title,
    amount: formatMoney(Number(milestone.amount)),
    contractId: milestone.contractId,
  });

  await logContractActivity({
    contractId: milestone.contractId,
    type: ActivityType.MILESTONE_FUNDED,
    title: `Funded: ${milestone.title}`,
    body: formatMoney(Number(milestone.amount)),
  });

  await pushNotification({
    userId: milestone.contract.talentId,
    type: NotificationType.MILESTONE,
    title: "Milestone funded",
    body: `${milestone.title} — ${formatMoney(Number(milestone.amount))} in escrow`,
    href: `/contracts/${milestone.contractId}`,
  });
}

async function handleAccountUpdated(account: Stripe.Account) {
  if (!account.id) return;
  await prisma.talentProfile.updateMany({
    where: { stripeAccountId: account.id },
    data: {
      stripeChargesEnabled: account.charges_enabled ?? false,
      stripePayoutsEnabled: account.payouts_enabled ?? false,
    },
  });
}
