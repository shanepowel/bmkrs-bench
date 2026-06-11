import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { UserRole } from "@bench/database";
import { prisma } from "@bench/database";
import { Logo } from "@/components/logo";
import { getCurrentUser } from "@/lib/auth";
import { homeForRole } from "@/lib/bench";
import { isClerkConfigured, isDatabaseConfigured } from "@/lib/env";
import { getUnreadMessageCount } from "@/actions/inbox";
import { routes } from "@/lib/routes";

async function unreadCount(userId: string) {
  try {
    return await prisma.notification.count({ where: { userId, read: false } });
  } catch {
    return 0;
  }
}

function NotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF4D00] px-1 font-mono text-[10px] text-[#181613]">
      {count > 9 ? "9+" : count}
    </span>
  );
}

function navForRole(role: UserRole) {
  switch (role) {
    case UserRole.ADMIN:
      return [
        { href: routes.studio, label: "studio" },
        { href: routes.studioPipeline, label: "pipeline" },
        { href: routes.studioBench, label: "bench" },
        { href: routes.studioBriefs, label: "briefs" },
        { href: routes.inbox, label: "inbox" },
      ];
    case UserRole.TALENT:
      return [
        { href: routes.partner, label: "partner" },
        { href: routes.profile, label: "profile" },
        { href: routes.inbox, label: "inbox" },
      ];
    case UserRole.CLIENT:
      return [
        { href: routes.client, label: "projects" },
        { href: routes.inbox, label: "inbox" },
      ];
    case UserRole.APPLICANT:
      return [{ href: routes.application, label: "application" }];
    default:
      return [{ href: routes.dashboard, label: "dashboard" }];
  }
}

export async function SiteHeader() {
  const hasClerk = isClerkConfigured();
  const user = isDatabaseConfigured() ? await getCurrentUser() : null;
  const [unread, unreadMessages] = user
    ? await Promise.all([unreadCount(user.id), getUnreadMessageCount(user.id)])
    : [0, 0];

  const navLinks = user ? navForRole(user.role) : [];

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(241,239,232,0.16)] bg-[#181613]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-grid items-center justify-between gap-4 px-gutter">
        <Logo variant="wordmark-dark" href={user ? homeForRole(user.role) : routes.home} />

        {user && (
          <nav className="hidden items-center gap-5 md:flex" aria-label="Main">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-meta uppercase tracking-[0.08em] text-[#B4B2A9] transition hover:text-[#F1EFE8]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {hasClerk ? (
            <>
              <Show when="signed-out">
                <Link
                  href={routes.signIn}
                  className="font-mono text-meta uppercase tracking-[0.08em] text-[#D3D1C7] hover:text-[#F1EFE8]"
                >
                  sign in
                </Link>
                <Link
                  href={routes.apply}
                  className="bg-[#FF4D00] px-4 py-2 font-mono text-meta uppercase tracking-[0.08em] text-[#181613]"
                >
                  apply
                </Link>
              </Show>
              <Show when="signed-in">
                <Link
                  href={routes.inbox}
                  className="relative hidden font-mono text-meta uppercase tracking-[0.08em] text-[#B4B2A9] sm:inline"
                >
                  inbox
                  <NotificationBadge count={unreadMessages} />
                </Link>
                <Link
                  href={routes.notifications}
                  className="relative hidden font-mono text-meta uppercase tracking-[0.08em] text-[#B4B2A9] sm:inline"
                >
                  alerts
                  <NotificationBadge count={unread} />
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
                  }}
                />
              </Show>
            </>
          ) : (
            user && (
              <Link
                href={routes.dashboard}
                className="font-mono text-meta uppercase tracking-[0.08em] text-[#B4B2A9]"
              >
                dashboard
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
