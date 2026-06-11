import { emailLayout, sendEmail } from "@/lib/email";
import { appUrl } from "@/lib/stripe";

export async function notifyProposalReceived({
  clientEmail,
  jobTitle,
  talentName,
  jobSlug,
}: {
  clientEmail: string;
  jobTitle: string;
  talentName: string;
  jobSlug: string;
}) {
  await sendEmail({
    to: clientEmail,
    subject: `New proposal on "${jobTitle}"`,
    html: emailLayout(
      "New proposal received",
      `<p><strong>${talentName}</strong> submitted a proposal on <strong>${jobTitle}</strong>.</p>`,
      { label: "Review proposals", href: appUrl(`/jobs/${jobSlug}`) }
    ),
  });
}

export async function notifyOfferSent({
  talentEmail,
  contractTitle,
  contractId,
}: {
  talentEmail: string;
  contractTitle: string;
  contractId: string;
}) {
  await sendEmail({
    to: talentEmail,
    subject: `You received an offer: ${contractTitle}`,
    html: emailLayout(
      "New contract offer",
      `<p>A client sent you an offer for <strong>${contractTitle}</strong>. Review and accept to get started.</p>`,
      { label: "View contract", href: appUrl(`/contracts/${contractId}`) }
    ),
  });
}

export async function notifyContractAccepted({
  clientEmail,
  contractTitle,
  talentName,
  contractId,
}: {
  clientEmail: string;
  contractTitle: string;
  talentName: string;
  contractId: string;
}) {
  await sendEmail({
    to: clientEmail,
    subject: `${talentName} accepted your contract`,
    html: emailLayout(
      "Contract accepted",
      `<p><strong>${talentName}</strong> accepted <strong>${contractTitle}</strong>. You can add milestones and fund work from the contract page.</p>`,
      { label: "Open contract", href: appUrl(`/contracts/${contractId}`) }
    ),
  });
}

export async function notifyMilestoneFunded({
  talentEmail,
  milestoneTitle,
  amount,
  contractId,
}: {
  talentEmail: string;
  milestoneTitle: string;
  amount: string;
  contractId: string;
}) {
  await sendEmail({
    to: talentEmail,
    subject: `Milestone funded: ${milestoneTitle}`,
    html: emailLayout(
      "Milestone funded",
      `<p>The client funded <strong>${milestoneTitle}</strong> (${amount}). Funds are held until you deliver and they approve.</p>`,
      { label: "View contract", href: appUrl(`/contracts/${contractId}`) }
    ),
  });
}

export async function notifyNewMessage({
  recipientEmail,
  jobTitle,
  preview,
  threadId,
}: {
  recipientEmail: string;
  jobTitle: string;
  preview: string;
  threadId: string;
}) {
  await sendEmail({
    to: recipientEmail,
    subject: `New message about "${jobTitle}"`,
    html: emailLayout(
      "New message",
      `<p>You have a new message about <strong>${jobTitle}</strong>:</p><p>${preview}</p>`,
      { label: "Open inbox", href: appUrl(`/inbox/${threadId}`) }
    ),
  });
}

export async function notifyMilestonePaid({
  talentEmail,
  milestoneTitle,
  amount,
}: {
  talentEmail: string;
  milestoneTitle: string;
  amount: string;
}) {
  await sendEmail({
    to: talentEmail,
    subject: `Payment released: ${milestoneTitle}`,
    html: emailLayout(
      "Payment released",
      `<p><strong>${amount}</strong> was released for <strong>${milestoneTitle}</strong>. It should arrive in your connected payout account per Stripe timing.</p>`
    ),
  });
}
