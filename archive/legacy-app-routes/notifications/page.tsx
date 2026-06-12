import Link from "next/link";
import { redirect } from "next/navigation";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/actions/in-app-notifications";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { routes } from "@/lib/routes";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect(routes.signIn);

  const notifications = await listNotifications();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <PageShell
      title="Notifications"
      description={unread > 0 ? `${unread} unread` : "You're all caught up"}
      back={{ href: routes.dashboard, label: "Dashboard" }}
      width="lg"
      actions={
        unread > 0 ? (
          <form action={markAllNotificationsRead}>
            <Button type="submit" variant="secondary">
              Mark all read
            </Button>
          </form>
        ) : undefined
      }
    >
      {notifications.length === 0 ? (
        <EmptyState title="No notifications yet" description="Updates on proposals, contracts, and payments appear here." />
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li key={n.id}>
              <Card
                className={n.read ? "" : "border-blue-200 bg-blue-50/30"}
              >
                <CardBody>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{n.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{n.body}</p>
                      <p className="mt-2 text-xs text-slate-500">{formatDateTime(n.createdAt)}</p>
                    </div>
                    {!n.read && (
                      <form action={markNotificationRead.bind(null, n.id)}>
                        <Button type="submit" variant="ghost" className="text-xs">
                          Mark read
                        </Button>
                      </form>
                    )}
                  </div>
                  {n.href && (
                    <Link href={n.href} className="mt-3 inline-block text-sm font-medium text-blue-600">
                      View details →
                    </Link>
                  )}
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
