import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { BENCH_SESSION_COOKIE } from "@/lib/bench-session";
import { isBenchDevAuth, isClerkConfigured, isDevAuthBypass } from "@/lib/env-clerk";
import { routes } from "@/lib/routes";

const isPublicRoute = createRouteMatcher([
  "/",
  "/apply(.*)",
  "/login(.*)",
  "/auth/callback(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health",
  "/api/webhooks(.*)",
  "/api/login",
]);

function benchDevMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname === routes.home ||
    pathname.startsWith("/apply") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  if (!req.cookies.has(BENCH_SESSION_COOKIE)) {
    return NextResponse.redirect(new URL(routes.login, req.url));
  }
  return NextResponse.next();
}

const clerkHandler = isClerkConfigured()
  ? clerkMiddleware(async (auth, req) => {
      if (isDevAuthBypass()) return;
      if (!isPublicRoute(req)) await auth.protect();
    })
  : null;

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (isBenchDevAuth()) return benchDevMiddleware(req);
  if (clerkHandler) return clerkHandler(req, event);
  return benchDevMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
