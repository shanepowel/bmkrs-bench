import { routes } from "@/lib/routes";

export type NavRailItem = { label: string; href: string };

export const studioNavItems: NavRailItem[] = [
  { label: "pipeline", href: routes.studioPipeline },
  { label: "the bench", href: routes.studioBench },
  { label: "briefs", href: routes.studioBriefs },
  { label: "studio", href: routes.studio },
];

export const partnerNavItems: NavRailItem[] = [
  { label: "home", href: routes.partner },
  { label: "profile", href: routes.profile },
  { label: "briefs", href: routes.jobs },
  { label: "threads", href: routes.inbox },
];

export const clientNavItems: NavRailItem[] = [
  { label: "projects", href: routes.client },
  { label: "threads", href: routes.inbox },
  { label: "contracts", href: routes.dashboard },
];

export function navRailFooter(firstName: string, role: "studio" | "partner" | "client") {
  return `${firstName.toLowerCase()} · ${role}`;
}
