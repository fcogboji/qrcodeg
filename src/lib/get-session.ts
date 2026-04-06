import { auth } from "@/auth";
import type { Session } from "next-auth";

/**
 * Like `auth()`, but if the session JWT was signed with an old `AUTH_SECRET` (or cookie is
 * corrupted), returns `null` instead of throwing / logging JWTSessionError on every request.
 */
export async function getSession(): Promise<Session | null> {
  try {
    return await auth();
  } catch {
    return null;
  }
}
