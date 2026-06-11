import { Body, H2, Kicker, PageBridge, Rule, Section } from "@/components/surfaces";
import { cn } from "@/lib/utils";

export function BenchShell({
  kicker,
  title,
  lead,
  children,
  className,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <Section theme="ink" className="border-b border-[rgba(241,239,232,0.16)]">
        <PageBridge className="py-12">
          <div className={cn("col-span-12 sm:col-span-9", className)}>
            {kicker && (
              <>
                <Kicker>{kicker}</Kicker>
                <Rule className="mb-tight mt-4" />
              </>
            )}
            <H2>{title}</H2>
            {lead && <Body large className="mt-tight">{lead}</Body>}
          </div>
        </PageBridge>
      </Section>
      <Section theme="paper">
        <PageBridge className="py-section">{children}</PageBridge>
      </Section>
    </>
  );
}
