import { UserRole, type User } from "@bench/database";
import {
  clientNavItems,
  navRailFooter,
  partnerNavItems,
  studioNavItems,
  type NavRailItem,
} from "@/lib/nav-rail";
import { routes } from "@/lib/routes";

export function navItemsForUser(user: User): NavRailItem[] {
  switch (user.role) {
    case UserRole.ADMIN:
      return studioNavItems;
    case UserRole.CLIENT:
      return clientNavItems;
    case UserRole.TALENT:
      return partnerNavItems;
    default:
      return [{ label: "dashboard", href: routes.dashboard }];
  }
}

export function navFooterForUser(user: User): string {
  const role =
    user.role === UserRole.ADMIN ? "studio" : user.role === UserRole.CLIENT ? "client" : "partner";
  return navRailFooter(user.firstName, role);
}

export function activeNavForUser(user: User, pathname: string): string {
  if (pathname.startsWith("/threads")) return routes.threads;
  if (user.role === UserRole.ADMIN) {
    if (pathname.startsWith("/studio/pipeline")) return routes.studioPipeline;
    if (pathname.startsWith("/studio/bench")) return routes.studioBench;
    if (pathname.startsWith("/studio/briefs")) return routes.studioBriefs;
    if (pathname.startsWith("/studio")) return routes.studio;
  }
  if (user.role === UserRole.TALENT && pathname.startsWith("/partner")) return routes.partner;
  if (user.role === UserRole.CLIENT && pathname.startsWith("/client")) return routes.client;
  return pathname;
}
