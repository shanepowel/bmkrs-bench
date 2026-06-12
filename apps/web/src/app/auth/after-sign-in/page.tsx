import { redirect } from "next/navigation";
import { syncUserFromClerk } from "@/lib/auth";
import { homeForRole } from "@/lib/bench";
import { routes } from "@/lib/routes";

/** Role-aware landing after Clerk sign-in (replaces flat /home redirect). */
export default async function AfterSignInPage() {
  const user = await syncUserFromClerk();
  if (user) redirect(homeForRole(user.role));
  redirect(routes.login);
}
