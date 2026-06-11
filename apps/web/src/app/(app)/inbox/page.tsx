import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export default function InboxRedirectPage() {
  redirect(routes.threads);
}
