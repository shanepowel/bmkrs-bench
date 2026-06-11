import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { deleteUserByClerkId, upsertUserFromClerk, type ClerkUserPayload } from "@/lib/clerk-sync";

type WebhookEvent = {
  type: string;
  data: ClerkUserPayload;
};

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CLERK_WEBHOOK_SECRET not configured" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(secret);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated":
      await upsertUserFromClerk(evt.data);
      break;
    case "user.deleted":
      await deleteUserByClerkId(evt.data.id);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
