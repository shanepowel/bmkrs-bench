import Link from "next/link";
import { ProposalStatus } from "@bench/database";
import { shortlistProposal, declineProposal } from "@/actions/proposals";
import { sendOfferFromProposal } from "@/actions/contracts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { proposalStatusLabel } from "@/lib/labels";
import { formatMoney } from "@/lib/format";
import { routes } from "@/lib/routes";

type ProposalRow = {
  id: string;
  status: ProposalStatus;
  coverLetter: string;
  bidAmount: { toString(): string };
  deliveryDays: number;
  talent: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    talentProfile: { headline: string | null } | null;
  };
};

export function ProposalInbox({
  proposals,
  jobSlug,
}: {
  proposals: ProposalRow[];
  jobSlug: string;
}) {
  if (proposals.length === 0) {
    return <p className="text-slate-600">No proposals yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {proposals.map((p) => (
        <li key={p.id}>
          <Card>
            <CardBody>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">
                {p.talent.firstName} {p.talent.lastName}{" "}
                <span className="font-normal text-slate-500">@{p.talent.username}</span>
              </p>
              {p.talent.talentProfile?.headline && (
                <p className="text-sm text-slate-600">{p.talent.talentProfile.headline}</p>
              )}
              <p className="mt-2 line-clamp-3 text-sm text-slate-700">{p.coverLetter}</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">{formatMoney(parseFloat(p.bidAmount.toString()))}</p>
              <p className="text-slate-500">{p.deliveryDays} days</p>
              <Badge className="mt-2">{proposalStatusLabel(p.status)}</Badge>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={routes.jobMessages(jobSlug, p.talent.id)}>
              <Button type="button" variant="secondary">
                Message
              </Button>
            </Link>
            {p.status === ProposalStatus.SUBMITTED && (
              <form action={shortlistProposal.bind(null, p.id)}>
                <Button type="submit" variant="secondary">
                  Shortlist
                </Button>
              </form>
            )}
            {p.status === ProposalStatus.SHORTLISTED && (
              <form action={sendOfferFromProposal.bind(null, p.id)}>
                <Button type="submit">Send offer</Button>
              </form>
            )}
            {p.status !== ProposalStatus.DECLINED && p.status !== ProposalStatus.ACCEPTED && (
              <form action={declineProposal.bind(null, p.id)}>
                <Button type="submit" variant="ghost">
                  Decline
                </Button>
              </form>
            )}
          </div>
            </CardBody>
          </Card>
        </li>
      ))}
    </ul>
  );
}
