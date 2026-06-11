import Link from "next/link";
import { notFound } from "next/navigation";
import { getInboxThread } from "@/actions/inbox";
import { BenchAppShell } from "@/components/bench-app-shell";
import { BenchMessagePanel } from "@/components/bench-message-panel";
import { C, mono } from "@/lib/bench-ui";
import { requireUser } from "@/lib/auth";
import { activeNavForUser, navFooterForUser, navItemsForUser } from "@/lib/nav-for-user";
import { routes } from "@/lib/routes";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const user = await requireUser();
  const { threadId } = await params;
  const data = await getInboxThread(threadId);
  if (!data) notFound();

  const { thread, currentUserId } = data;

  return (
    <BenchAppShell
      active={activeNavForUser(user, routes.threads)}
      footer={navFooterForUser(user)}
      items={navItemsForUser(user)}
      title={thread.job.title.toLowerCase()}
      lead="project thread"
    >
      <Link
        href={routes.threads}
        className="mb-6 inline-block text-[12px] hover:underline"
        style={{ ...mono, color: C.orange }}
      >
        ← all threads
      </Link>
      <BenchMessagePanel
        threadId={thread.id}
        initialMessages={thread.messages}
        currentUserId={currentUserId}
      />
    </BenchAppShell>
  );
}
