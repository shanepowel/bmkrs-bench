import { NextResponse } from "next/server";
import { prisma } from "@bench/database";
import { emailLayout, sendEmail } from "@/lib/email";

const NOTIFY_TO = process.env.HIRE_NOTIFY_EMAIL ?? "hello@bmkrs.com";

type HireBody = {
  name?: string;
  email?: string;
  company?: string;
  need?: string;
  disciplines?: string[];
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as HireBody | null;
  if (!body?.name?.trim() || !body?.email?.trim() || !body?.need?.trim()) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const disciplines = Array.isArray(body.disciplines)
    ? body.disciplines.filter((d): d is string => typeof d === "string" && d.trim().length > 0)
    : [];

  const enquiry = await prisma.hireEnquiry.create({
    data: {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      company: body.company?.trim() || null,
      disciplines,
      need: body.need.trim(),
    },
  });

  const disciplineLine =
    disciplines.length > 0 ? disciplines.join(", ") : "not specified";

  await sendEmail({
    to: NOTIFY_TO,
    subject: `hire enquiry — ${enquiry.name}`,
    html: emailLayout(
      "new hire enquiry",
      `<p><strong>${enquiry.name}</strong> · ${enquiry.email}</p>
       ${enquiry.company ? `<p>company: ${enquiry.company}</p>` : ""}
       <p>disciplines: ${disciplineLine}</p>
       <p style="margin-top:16px;white-space:pre-wrap">${enquiry.need}</p>`,
    ),
  });

  return NextResponse.json({ ok: true, id: enquiry.id });
}
