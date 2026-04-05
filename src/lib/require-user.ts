import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/** Returns 401 JSON if there is no signed-in Clerk user; otherwise returns the Clerk user id. */
export async function requireUserId(): Promise<string | NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  return userId;
}
