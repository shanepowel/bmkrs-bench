import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { surfaceVars, type SurfaceTheme } from "@/lib/surfaces";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  theme: SurfaceTheme;
  as?: "section" | "div" | "header" | "footer";
};

export function Section({ theme, as: Tag = "section", className, style, children, ...props }: SectionProps) {
  return (
    <Tag
      className={cn("w-full", className)}
      style={{ ...surfaceVars(theme), backgroundColor: "var(--surface-bg)", ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Kicker({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-accent)]", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function H1({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn("text-hero font-medium text-[var(--surface-heading)]", className)} {...props}>
      {children}
    </h1>
  );
}

export function H2({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-h2 font-medium text-[var(--surface-heading)]", className)} {...props}>
      {children}
    </h2>
  );
}

export function H3({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-h3 font-medium text-[var(--surface-heading)]", className)} {...props}>
      {children}
    </h3>
  );
}

export function Body({
  large,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { large?: boolean }) {
  return (
    <p
      className={cn(
        "max-w-[65ch] text-[var(--surface-body)]",
        large ? "text-body-lg" : "text-body",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Rule({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr className={cn("border-0 border-t border-[color:var(--surface-rule)]", className)} {...props} />
  );
}

export function PageBridge({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto grid max-w-grid grid-cols-12 gap-gutter px-gutter py-section", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function MetaRail({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <aside className={cn("font-mono text-meta text-[var(--surface-meta)]", className)} {...props}>
      {children}
    </aside>
  );
}

export function PartnerStatusLine({
  status,
  since,
  className,
}: {
  status: string;
  since?: string;
  className?: string;
}) {
  const line = since ? `· ${status} since ${since}` : `· ${status}`;
  return (
    <p className={cn("font-mono text-meta tracking-[0.04em] text-[var(--surface-meta)]", className)}>
      {line}
    </p>
  );
}

export function FullBleed({
  src,
  alt,
  caption,
  className,
}: {
  src: string;
  alt: string;
  caption: string;
  className?: string;
}) {
  return (
    <figure className={cn("relative max-h-[60vh] w-full overflow-hidden", className)}>
      <Image src={src} alt={alt} width={1920} height={820} className="h-full w-full object-cover" />
      <figcaption className="absolute bottom-4 left-4 font-mono text-meta text-[var(--surface-meta)]">
        {caption}
      </figcaption>
    </figure>
  );
}
