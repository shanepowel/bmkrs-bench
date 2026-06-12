import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

/** Legacy Clerk path — marketing and Sanity settings use `/login`. */
export default async function SignInRedirectPage({
  params,
}: {
  params: Promise<{ "sign-in"?: string[] }>;
}) {
  const { "sign-in": segments } = await params;
  const suffix = segments?.length ? `/${segments.join("/")}` : "";
  redirect(`${routes.login}${suffix}`);
}
