import SiteHeader from "@/components/SiteHeader";

export function EntryChrome({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: string;
}) {
  return (
    <>
      <SiteHeader active={active} />
      {children}
    </>
  );
}
