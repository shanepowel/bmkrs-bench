import { Resend } from "resend";

let resend: Resend | null = null;

function client() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

const from = () =>
  process.env.EMAIL_FROM ?? "Freelance Near Me <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const r = client();
  if (!r) {
    if (process.env.NODE_ENV === "development") {
      console.log("[email:dev]", { to, subject });
    }
    return;
  }

  await r.emails.send({ from: from(), to, subject, html });
}

export function emailLayout(title: string, body: string, cta?: { label: string; href: string }) {
  const button = cta
    ? `<p style="margin-top:24px"><a href="${cta.href}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:9999px;text-decoration:none;font-weight:600">${cta.label}</a></p>`
    : "";
  return `
<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;color:#0f172a;line-height:1.5">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <p style="color:#64748b;font-size:14px">Freelance Near Me</p>
    <h1 style="font-size:22px;margin:16px 0 8px">${title}</h1>
    <div>${body}</div>
    ${button}
    <p style="margin-top:32px;font-size:12px;color:#94a3b8">You received this because of activity on your account.</p>
  </div>
</body></html>`;
}
