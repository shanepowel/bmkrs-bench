import { MilestoneStatus } from "@bench/database";
import { createMilestone, updateMilestoneStatus } from "@/actions/milestones";
import { createMilestoneCheckout } from "@/actions/payments";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { MILESTONE_STATUS_LABEL } from "@/lib/labels";
import { isPaymentsEnabled } from "@/lib/stripe";
import { formatMoney } from "@/lib/format";
import { routes } from "@/lib/routes";

type Milestone = {
  id: string;
  title: string;
  description: string | null;
  amount: { toString(): string };
  status: MilestoneStatus;
  dueDate: Date | null;
};

export function MilestonePanel({
  contractId,
  milestones,
  isClient,
  isTalent,
  contractActive,
  talentPayoutsReady,
}: {
  contractId: string;
  milestones: Milestone[];
  isClient: boolean;
  isTalent: boolean;
  contractActive: boolean;
  talentPayoutsReady: boolean;
}) {
  const paymentsOn = isPaymentsEnabled();

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900">Milestones</h2>
      <p className="mt-1 text-sm text-slate-600">
        {paymentsOn
          ? `Fund via Stripe Checkout. Platform fee: ${process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENT ?? "10"}%.`
          : "Partners invoice off-platform. Milestone funding through Stripe is retired on the bench."}
      </p>

      {!paymentsOn && contractActive && (
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          Coordinate payment terms in the project thread. See{" "}
          <a href={routes.transactions} className="font-semibold underline">
            transactions
          </a>{" "}
          for details.
        </p>
      )}

      {paymentsOn && !talentPayoutsReady && contractActive && (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
          Talent must{" "}
          <a href={routes.payouts} className="font-semibold underline">
            connect Stripe payouts
          </a>{" "}
          before milestones can be funded.
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {milestones.map((m) => (
          <li key={m.id}>
            <Card>
              <CardBody>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900">{m.title}</p>
                    {m.description && (
                      <p className="mt-1 text-sm text-slate-600">{m.description}</p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold">{formatMoney(Number(m.amount))}</p>
                    <p className="text-slate-500">{MILESTONE_STATUS_LABEL[m.status]}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {isClient && m.status === MilestoneStatus.PENDING && contractActive && paymentsOn && (
                    <form action={createMilestoneCheckout.bind(null, m.id)}>
                      <Button type="submit" disabled={!talentPayoutsReady}>
                        Fund milestone
                      </Button>
                    </form>
                  )}
                  {isTalent && m.status === MilestoneStatus.FUNDED && contractActive && (
                    <form
                      action={updateMilestoneStatus.bind(null, m.id, MilestoneStatus.SUBMITTED)}
                    >
                      <Button type="submit" variant="secondary">
                        Mark submitted
                      </Button>
                    </form>
                  )}
                  {isClient && m.status === MilestoneStatus.SUBMITTED && (
                    <form
                      action={updateMilestoneStatus.bind(null, m.id, MilestoneStatus.APPROVED)}
                    >
                      <Button type="submit">Approve & release payout</Button>
                    </form>
                  )}
                </div>
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>

      {milestones.length === 0 && (
        <div className="mt-4">
          <EmptyState title="No milestones yet" description="The client can add milestones to structure payments." />
        </div>
      )}

      {isClient && contractActive && (
        <form
          action={createMilestone}
          className="mt-8 space-y-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6"
        >
          <input type="hidden" name="contractId" value={contractId} />
          <h3 className="font-medium text-slate-900">Add milestone</h3>
          <Field label="Title" name="title" required />
          <Field label="Amount ($)" name="amount" type="number" required />
          <Field label="Description" name="description" as="textarea" rows={2} />
          <Button type="submit">Add milestone</Button>
        </form>
      )}
    </section>
  );
}
