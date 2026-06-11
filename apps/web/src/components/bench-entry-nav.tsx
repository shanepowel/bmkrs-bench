import Link from "next/link";
import { C, mono } from "@/lib/bench-ui";
import { marketingUrls } from "@/lib/marketing-urls";
import { routes } from "@/lib/routes";

type EntryContext = "login" | "join" | "hire";

export function BenchEntryNav({ context }: { context: EntryContext }) {
  return (
    <nav
      className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-2"
      aria-label="entry navigation"
    >
      <a
        href={marketingUrls.studio}
        style={{ ...mono, color: C.paperFaint }}
        className="text-[12px] underline-offset-4 hover:underline"
      >
        ← bmkrs.com
      </a>
      <a
        href={marketingUrls.network}
        style={{ ...mono, color: C.paperFaint }}
        className="text-[12px] underline-offset-4 hover:underline"
      >
        the network ↗
      </a>
      {context === "hire" && (
        <Link
          href={routes.join}
          style={{ ...mono, color: C.paperFaint }}
          className="text-[12px] underline-offset-4 hover:underline"
        >
          join as a specialist
        </Link>
      )}
      {context === "join" && (
        <Link
          href={routes.hire}
          style={{ ...mono, color: C.paperFaint }}
          className="text-[12px] underline-offset-4 hover:underline"
        >
          hire talent
        </Link>
      )}
      {context === "login" && (
        <>
          <Link
            href={routes.join}
            style={{ ...mono, color: C.paperFaint }}
            className="text-[12px] underline-offset-4 hover:underline"
          >
            join the network
          </Link>
          <Link
            href={routes.hire}
            style={{ ...mono, color: C.paperFaint }}
            className="text-[12px] underline-offset-4 hover:underline"
          >
            hire talent
          </Link>
        </>
      )}
    </nav>
  );
}

export function BenchEntryNavInk({ context }: { context: EntryContext }) {
  return (
    <nav
      className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-2"
      aria-label="entry navigation"
    >
      <a
        href={marketingUrls.studio}
        style={{ ...mono, color: C.inkFaint }}
        className="text-[12px] underline-offset-4 hover:underline"
      >
        ← bmkrs.com
      </a>
      <a
        href={marketingUrls.network}
        style={{ ...mono, color: C.inkFaint }}
        className="text-[12px] underline-offset-4 hover:underline"
      >
        the network ↗
      </a>
      {context === "login" && (
        <>
          <Link
            href={routes.join}
            style={{ ...mono, color: C.inkFaint }}
            className="text-[12px] underline-offset-4 hover:underline"
          >
            join the network
          </Link>
          <Link
            href={routes.hire}
            style={{ ...mono, color: C.inkFaint }}
            className="text-[12px] underline-offset-4 hover:underline"
          >
            hire talent
          </Link>
        </>
      )}
    </nav>
  );
}
