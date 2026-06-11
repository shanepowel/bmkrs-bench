import Link from "next/link";
import { listInboxThreads } from "@/actions/inbox";
import { BenchAppShell } from "@/components/bench-app-shell";
import { C, mono, Status } from "@/lib/bench-ui";
import { requireUser } from "@/lib/auth";
import { activeNavForUser, navFooterForUser, navItemsForUser } from "@/lib/nav-for-user";
import { routes } from "@/lib/routes";

export default async function ThreadsPage() {
  const user = await requireUser();
  const threads = await listInboxThreads();

  return (
    <BenchAppShell
      active={activeNavForUser(user, routes.threads)}
      footer={navFooterForUser(user)}
      items={navItemsForUser(user)}
      title="threads."
      lead="project conversations with clients and partners. no rates in the thread, just the work."
    >
      <div
        className="grid grid-cols-[1.4fr_1.6fr_auto] py-2 text-[11px]"
        style={{ ...mono, color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}
      >
        <span>project</span>
        <span>last message</span>
        <span>status</span>
      </div>

      {threads.length === 0 ? (
        <p className="py-6 text-[15px]" style={{ color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}>
          no threads yet. they appear when a project is staffed or a brief gets a reply.
        </p>
      ) : (
        threads.map((thread) => (
          <Link
            key={thread.id}
            href={routes.threadsThread(thread.id)}
            className="grid w-full grid-cols-[1.4fr_1.6fr_auto] items-center gap-2 py-3 text-left transition-transform hover:translate-x-1 motion-reduce:transform-none"
            style={{ borderTop: `1px solid ${C.paperRule}` }}
          >
            <span className="font-medium">{thread.jobTitle.toLowerCase()}</span>
            <span className="truncate text-[12px]" style={{ ...mono, color: C.paperBody }}>
              {thread.lastMessage
                ? `${thread.lastMessage.isOwn ? "you: " : ""}${thread.lastMessage.body}`
                : "no messages yet"}
            </span>
            {thread.unread ? (
              <Status kind="stage-active">new</Status>
            ) : (
              <span style={{ ...mono, color: C.paperFaint }} className="text-[11px]">
                read
              </span>
            )}
          </Link>
        ))
      )}
    </BenchAppShell>
  );
}
