import Link from "next/link";
import { UserRole } from "@bench/database";
import { prisma } from "@bench/database";
import { HeaderAccountActions } from "@/components/layout/header-account-actions";
import { MarketingSiteHeader } from "@/components/layout/marketing-site-header";
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

function SignedOutActions() {
  return (
    <>
      <Link href={routes.login} className="nav-login">
        log in
      </Link>
      <Link href={routes.join} className="btn-primary nav-cta">
        apply
      </Link>
    </>
  );
}

export async function SiteHeader() {
  const hasClerk = isClerkConfigured();
  const user = isDatabaseConfigured() ? await getCurrentUser() : null;
  const [unread, unreadMessages] = user
    ? await Promise.all([unreadCount(user.id), getUnreadMessageCount(user.id)])
    : [0, 0];

  const benchNav = user ? navForRole(user.role) : undefined;
  const accountSlot =
    hasClerk && user ? (
      <HeaderAccountActions unread={unread} unreadMessages={unreadMessages} />
    ) : hasClerk ? (
      <HeaderAccountActions unread={0} unreadMessages={0} />
    ) : user ? (
      <Link href={homeForRole(user.role)} className="nav-login">
        the bench
      </Link>
    ) : (
      <SignedOutActions />
    );

  return <MarketingSiteHeader accountSlot={accountSlot} benchNav={benchNav} />;

}
