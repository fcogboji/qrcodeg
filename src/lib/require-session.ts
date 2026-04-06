import { getSession } from "@/lib/get-session";
import { NextResponse } from "next/server";

export async function requireSession() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  return session;
}
