import Link from "next/link";
import { notFound } from "next/navigation";
import { ContractStatus } from "@bench/database";
import { listContractActivity } from "@/actions/activity";
import { acceptContract, completeContract, getContract } from "@/actions/contracts";
import { getReviewForContract } from "@/actions/reviews";
import { listDeliverablesForContract } from "@/actions/deliverables";
import { listMilestones } from "@/actions/milestones";
import { ContractActivityTimeline } from "@/components/contract-activity-timeline";
import { ReviewForm } from "@/components/review-form";
import { ReviewsList } from "@/components/reviews-list";
import { DeliverablesPanel } from "@/components/deliverables-panel";
import { PageShell } from "@/components/layout/page-shell";
import { MilestonePanel } from "@/components/milestone-panel";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { contractStatusLabel } from "@/lib/labels";
import { formatMoney } from "@/lib/format";
import { routes } from "@/lib/routes";

export default async function ContractPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ funded?: string }>;
}) {
  const { id } = await params;
  const { funded } = await searchParams;
  const user = await getCurrentUser();
  if (!user) notFound();

  const contract = await getContract(id);
  if (!contract) notFound();

  const isTalent = user.id === contract.talentId;
  const isClient = user.id === contract.clientId;
  const canAccept = isTalent && contract.status === ContractStatus.PENDING_ACCEPTANCE;
  const [milestones, deliverables, activities, review] = await Promise.all([
    listMilestones(id),
    listDeliverablesForContract(id),
    listContractActivity(id),
    getReviewForContract(id),
  ]);
  const contractActive = contract.status === ContractStatus.ACTIVE;
  const contractCompleted = contract.status === ContractStatus.COMPLETED;
  const talentPayoutsReady = Boolean(
    contract.talent.talentProfile?.stripeChargesEnabled &&
      contract.talent.talentProfile?.stripePayoutsEnabled
  );

  return (
    <PageShell
      title={contract.title}
      description={`${formatMoney(Number(contract.amount))} · ${contractStatusLabel(contract.status)}`}
      back={{ href: routes.dashboard, label: "Dashboard" }}
      width="full"
      actions={
        canAccept ? (
          <form action={acceptContract.bind(null, id)}>
            <Button type="submit">Accept contract</Button>
          </form>
        ) : (
          <Badge variant={contractActive ? "success" : "info"}>
            {contractStatusLabel(contract.status)}
          </Badge>
        )
      }
    >
      {funded === "1" && (
        <Alert variant="success" className="mb-6">
          Payment received — milestone is funded and held in escrow.
        </Alert>
      )}

      <Card className="mb-8">
        <CardBody>
          <dl className="grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-slate-500">Client</dt>
              <dd className="font-medium text-slate-900">
                {contract.client.firstName} {contract.client.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Talent</dt>
              <dd className="font-medium text-slate-900">
                {contract.talent.firstName} {contract.talent.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Related job</dt>
              <dd>
                <Link href={routes.job(contract.job.slug)} className="font-medium text-blue-600">
                  View job
                </Link>
              </dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      {isClient && contractActive && (
        <div className="mb-8">
          <form action={completeContract.bind(null, id)}>
            <Button type="submit" variant="secondary">
              Mark contract complete
            </Button>
          </form>
          <p className="mt-2 text-xs text-slate-500">
            Mark complete when all work is delivered. You can leave a review afterward.
          </p>
        </div>
      )}

      {contractCompleted && isClient && !review && (
        <div className="mb-8">
          <ReviewForm contractId={id} />
        </div>
      )}

      {review && (
        <div className="mb-8">
          <h3 className="mb-3 font-semibold text-slate-900">Review</h3>
          <ReviewsList
            reviews={[
              {
                ...review,
                contract: { title: contract.title },
                reviewer: review.reviewer,
              },
            ]}
          />
        </div>
      )}

      {isTalent && contractActive && !talentPayoutsReady && (
        <Alert variant="warning" className="mb-8">
          Connect Stripe to receive payments when milestones are approved.{" "}
          <Link href={routes.payouts} className="font-semibold underline">
            Set up payouts
          </Link>
        </Alert>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <MilestonePanel
            contractId={id}
            milestones={milestones}
            isClient={isClient}
            isTalent={isTalent}
            contractActive={contractActive}
            talentPayoutsReady={talentPayoutsReady}
          />
          <DeliverablesPanel
            contractId={id}
            milestones={milestones}
            deliverables={deliverables}
            isTalent={isTalent}
            contractActive={contractActive}
          />
        </div>
        <div className="lg:col-span-1">
          <ContractActivityTimeline activities={activities} />
        </div>
      </div>
    </PageShell>
  );
}
