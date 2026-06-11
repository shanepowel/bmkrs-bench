import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "wordmark-dark" | "wordmark-light" | "icon-dark" | "icon-light";

const paths: Record<LogoVariant, string> = {
  "wordmark-dark": "/logo/bmkrs-primary-dark.svg",
  "wordmark-light": "/logo/bmkrs-primary-light.svg",
  "icon-dark": "/logo/bmkrs-icon-dark.svg",
  "icon-light": "/logo/bmkrs-icon-light.svg",
};

const sizes: Record<LogoVariant, { w: number; h: number }> = {
  "wordmark-dark": { w: 120, h: 32 },
  "wordmark-light": { w: 120, h: 32 },
  "icon-dark": { w: 32, h: 32 },
  "icon-light": { w: 32, h: 32 },
};

export function Logo({
  variant = "icon-dark",
  href = "/",
  className,
  priority,
}: {
  variant?: LogoVariant;
  href?: string;
  className?: string;
  priority?: boolean;
}) {
  const { w, h } = sizes[variant];
  const img = (
    <Image
      src={paths[variant]}
      alt="bmkrs"
      width={w}
      height={h}
      priority={priority}
      className={cn("h-auto w-auto", className)}
    />
  );

  if (!href) return img;
  return (
    <Link href={href} className="inline-block">
      {img}
    </Link>
  );
}
