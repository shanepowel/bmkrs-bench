import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

/** Legacy Clerk path — marketing and Sanity settings use `/login`. */
export default function SignInRedirectPage() {
  redirect(routes.login);
}
