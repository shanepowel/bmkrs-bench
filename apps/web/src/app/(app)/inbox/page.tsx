import Link from "next/link";
import { listInboxThreads } from "@/actions/inbox";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/format";
import { routes } from "@/lib/routes";

export default async function InboxPage() {
  const threads = await listInboxThreads();

  return (
    <PageShell title="Inbox" description="Messages with clients and freelancers" width="md">
      {threads.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          description="Message a freelancer from a job page, or reply when you receive a proposal."
          action={{ label: "Browse jobs", href: routes.jobs }}
        />
      ) : (
        <ul className="space-y-3">
          {threads.map((thread) => (
            <li key={thread.id}>
              <Link href={routes.inboxThread(thread.id)}>
                <Card className="transition hover:border-blue-200 hover:shadow-md">
                  <CardBody className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900">{thread.jobTitle}</p>
                      {thread.lastMessage ? (
                        <p className="mt-1 truncate text-sm text-slate-600">
                          {thread.lastMessage.isOwn ? "You: " : ""}
                          {thread.lastMessage.body}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-slate-500">No messages yet</p>
                      )}
                      {thread.lastMessage && (
                        <p className="mt-1 text-xs text-slate-400">
                          {formatDateTime(thread.lastMessage.createdAt)}
                        </p>
                      )}
                    </div>
                    {thread.unread && <Badge variant="info">New</Badge>}
                  </CardBody>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
