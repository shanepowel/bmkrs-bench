export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl text-slate-900">About Freelance Near Me</h1>
      <p className="mt-6 text-slate-700 leading-relaxed">
        We connect businesses with skilled freelancers — locally or remotely. The product is built
        as a modern React application: TypeScript, Next.js, and Tailwind on Vercel, with Postgres,
        Clerk for accounts, and Stripe for secure milestone payments.
      </p>
      <p className="mt-4 text-slate-700 leading-relaxed">
        Our focus is a clear hire loop inspired by leading marketplaces: discover talent, receive
        proposals, contract, and pay with confidence.
      </p>
    </div>
  );
}
