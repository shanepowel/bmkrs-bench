import { notFound, redirect } from "next/navigation";
import { getJobBySlug } from "@/actions/jobs";
import { getOrCreateThread } from "@/actions/messages";
import { MessagePanel } from "@/components/message-panel";
import { PageShell } from "@/components/layout/page-shell";
import { getCurrentUser } from "@/lib/auth";
import { routes } from "@/lib/routes";

export default async function JobMessagesPage({
  params,
}: {
  params: Promise<{ slug: string; participantId: string }>;
}) {
  const { slug, participantId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(routes.signIn);

  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const isParticipant = user.id === job.posterId || user.id === participantId;
  if (!isParticipant) notFound();

  const thread = await getOrCreateThread(job.id, participantId);
  const other =
    user.id === job.posterId
      ? job.proposals.find((p) => p.talentId === participantId)?.talent
      : job.poster;

  const otherName = other
    ? `${other.firstName} ${other.lastName}`
    : "Conversation";

  return (
    <PageShell
      title={`Messages with ${otherName}`}
      description={job.title}
      back={{ href: routes.job(slug), label: "Back to job" }}
      width="lg"
    >
      <MessagePanel
        threadId={thread.id}
        messages={thread.messages}
        currentUserId={user.id}
      />
    </PageShell>
  );
}
