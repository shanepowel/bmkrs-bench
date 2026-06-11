import Link from "next/link";
import { getMyPaymentTransactions } from "@/actions/payment-transactions";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime, formatMoney } from "@/lib/format";
import { routes } from "@/lib/routes";

const typeLabels: Record<string, string> = {
  FUND: "Funded",
  RELEASE: "Released",
  REFUND: "Refunded",
};

export default async function TransactionsPage() {
  const transactions = await getMyPaymentTransactions();

  return (
    <PageShell
      title="Transactions"
      description="Funding, releases, and receipts for your contracts"
      width="md"
    >
      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Payments appear here when milestones are funded or released."
          action={{ label: "Go to dashboard", href: routes.dashboard }}
        />
      ) : (
        <ul className="space-y-3">
          {transactions.map((tx) => (
            <li key={tx.id}>
              <Card>
                <CardBody className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">
                      {tx.milestone?.title ?? tx.contract.title}
                    </p>
                    <Badge>{typeLabels[tx.type] ?? tx.type}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    {formatMoney(Number(tx.amount))}
                    {tx.netAmount != null && tx.type === "RELEASE" && (
                      <> · Net payout {formatMoney(Number(tx.netAmount))}</>
                    )}
                    {tx.platformFee != null && Number(tx.platformFee) > 0 && (
                      <> · Platform fee {formatMoney(Number(tx.platformFee))}</>
                    )}
                  </p>
                  <p className="text-xs text-slate-400">{formatDateTime(tx.createdAt)}</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <Link href={routes.contract(tx.contractId)} className="text-blue-600 hover:underline">
                      View contract
                    </Link>
                    {tx.receiptUrl && (
                      <a href={tx.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Receipt
                      </a>
                    )}
                  </div>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
