import Link from "next/link";

type SetupNoticeProps = {
  title: string;
  children: React.ReactNode;
};

export function SetupNotice({ title, children }: SetupNoticeProps) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-serif text-2xl text-slate-900">{title}</h1>
      <div className="mt-4 space-y-3 text-sm text-slate-600">{children}</div>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Back to home
      </Link>
    </div>
  );
}
