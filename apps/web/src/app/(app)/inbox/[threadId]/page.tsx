import Link from "next/link";
import { notFound } from "next/navigation";
import { getInboxThread } from "@/actions/inbox";
import { MessagePanelLive } from "@/components/message-panel-live";
import { PageShell } from "@/components/layout/page-shell";
import { routes } from "@/lib/routes";

export default async function InboxThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const data = await getInboxThread(threadId);
  if (!data) notFound();

  const { thread, currentUserId } = data;

  return (
    <PageShell
      title={thread.job.title}
      description="Contract conversation"
      width="md"
      actions={
        <Link href={routes.job(thread.job.slug)} className="text-sm font-medium text-blue-600">
          View job
        </Link>
      }
    >
      <MessagePanelLive
        threadId={thread.id}
        initialMessages={thread.messages}
        currentUserId={currentUserId}
      />
    </PageShell>
  );
}
