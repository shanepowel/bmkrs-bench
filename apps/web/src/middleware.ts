import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkConfigured, isDevAuthBypass } from "@/lib/env-clerk";

/** Public surfaces only: login, application intake, health, webhooks. */
const isPublicRoute = createRouteMatcher([
  "/",
  "/apply(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health",
  "/api/webhooks(.*)",
]);

export default isClerkConfigured()
  ? clerkMiddleware(async (auth, req) => {
      if (isDevAuthBypass()) return;
      if (!isPublicRoute(req)) await auth.protect();
    })
  : function middleware() {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
