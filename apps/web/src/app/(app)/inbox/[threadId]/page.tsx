import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export default async function InboxThreadRedirectPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  redirect(routes.threadsThread(threadId));
}
