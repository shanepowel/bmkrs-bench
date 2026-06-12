import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.need) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  // TODO: insert into hire_enquiries + notify hello@bmkrs.com
  console.log("hire enquiry:", body.email, body.need);
  return NextResponse.json({ ok: true });
}
