import {
  prisma,
  PaymentTransactionType,
  PaymentTransactionStatus,
  type Prisma,
} from "@bench/database";

export async function recordPaymentTransaction(data: {
  contractId: string;
  milestoneId?: string;
  payerId: string;
  payeeId: string;
  type: PaymentTransactionType;
  amount: number | Prisma.Decimal;
  platformFee?: number | Prisma.Decimal;
  netAmount?: number | Prisma.Decimal;
  stripePaymentIntentId?: string;
  stripeTransferId?: string;
  receiptUrl?: string;
  status?: PaymentTransactionStatus;
}) {
  return prisma.paymentTransaction.create({
    data: {
      contractId: data.contractId,
      milestoneId: data.milestoneId,
      payerId: data.payerId,
      payeeId: data.payeeId,
      type: data.type,
      amount: data.amount,
      platformFee: data.platformFee,
      netAmount: data.netAmount,
      stripePaymentIntentId: data.stripePaymentIntentId,
      stripeTransferId: data.stripeTransferId,
      receiptUrl: data.receiptUrl,
      status: data.status ?? PaymentTransactionStatus.SUCCEEDED,
    },
  });
}
