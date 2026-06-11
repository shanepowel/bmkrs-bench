import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    { title: "Post or browse", body: "Clients post jobs with budget and scope. Talent browses open projects." },
    { title: "Propose", body: "Freelancers submit proposals with bid, timeline, and cover letter." },
    { title: "Hire", body: "Clients shortlist, send an offer, and open a contract." },
    {
      title: "Deliver & pay",
      body: "Work in the contract workspace: upload deliverables, fund milestones with Stripe escrow, and release payout on approval.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl text-slate-900">How it works</h1>
      <ol className="mt-10 space-y-8">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
              {i + 1}
            </span>
            <div>
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="mt-1 text-slate-600">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link
        href="/sign-up?role=client"
        className="mt-10 inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Get started
      </Link>
    </div>
  );
}
