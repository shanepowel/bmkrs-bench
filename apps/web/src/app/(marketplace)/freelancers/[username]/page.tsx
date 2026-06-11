import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export default async function FreelancerRedirectPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  redirect(routes.partnerProfile(username));
}
