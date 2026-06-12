"use client";

import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { routes } from "@/lib/routes";

function NotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF4D00] px-1 font-mono text-[10px] text-[#181613]">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function HeaderAccountActions({
  unread,
  unreadMessages,
}: {
  unread: number;
  unreadMessages: number;
}) {
  return (
    <div className="header-account-actions">
      <Show when="signed-out">
        <Link href={routes.login} className="nav-login">
          log in
        </Link>
        <Link href={routes.join} className="btn-primary nav-cta">
          apply
        </Link>
      </Show>
      <Show when="signed-in">
        <Link href={routes.inbox} className="relative nav-login hidden sm:inline">
          inbox
          <NotificationBadge count={unreadMessages} />
        </Link>
        <Link href={routes.notifications} className="relative nav-login hidden sm:inline">
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
    </div>
  );
}
