import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Keep middleware minimal for Vercel Edge — custom `auth.protect()` here has caused
 * MIDDLEWARE_INVOCATION_FAILED. Route protection uses `auth.protect()` in server layouts instead.
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
