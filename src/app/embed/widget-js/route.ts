import { NextResponse } from "next/server";

const UPSTREAM_WIDGET =
  process.env.WIDGET_SCRIPT_UPSTREAM_URL ??
  "https://24-7concept-pew4inhis-friday-s-projects.vercel.app/widget.js";

/**
 * Same-origin proxy for third-party widget.js — avoids net::ERR_BLOCKED_BY_ORB in Chrome
 * when the upstream response lacks suitable CORP / MIME for cross-origin script loads.
 */
export async function GET() {
  try {
    const res = await fetch(UPSTREAM_WIDGET, {
      next: { revalidate: 300 },
      headers: {
        Accept: "application/javascript, text/javascript, */*",
      },
    });
    if (!res.ok) {
      return new NextResponse(`console.warn("[widget] upstream ${res.status}");`, {
        status: 200,
        headers: {
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }
    const body = await res.text();
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "Cross-Origin-Resource-Policy": "cross-origin",
      },
    });
  } catch {
    return new NextResponse(`console.warn("[widget] proxy fetch failed");`, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
}
