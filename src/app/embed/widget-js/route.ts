import { NextResponse } from "next/server";
import {
  WIDGET_SCRIPT_URL,
  widgetDataAttributes,
  WIDGET_UPSTREAM_ORIGIN,
} from "@/config/widget";

const UPSTREAM_WIDGET =
  process.env.WIDGET_SCRIPT_UPSTREAM_URL?.trim() || WIDGET_SCRIPT_URL;

/** One-line console helper when the widget host rejects anonymous access (browser would 401 too). */
function clientAuthBlockedMessage(): string {
  return `console.warn("[widget] ${WIDGET_SCRIPT_URL} returned 401/403. Disable Vercel Deployment Protection on the widget project, host widget.js on a public URL, or set WIDGET_VERCEL_BYPASS_SECRET on this app so /embed/widget-js can proxy the real file.");`;
}

/**
 * Bootstrap when server fetch failed for a reason where the browser might still load the script
 * (e.g. some CDNs allow browser cookies but not datacenter IPs).
 */
function clientLoaderScript(): string {
  const src = WIDGET_SCRIPT_URL;
  const apiBase = widgetDataAttributes["data-api-base"];
  const botId = widgetDataAttributes["data-bot-id"];
  const brand = widgetDataAttributes["data-brand"];
  return `(function(){
try{
var s=document.createElement("script");
s.src=${JSON.stringify(src)};
s.async=true;
s.setAttribute("data-api-base",${JSON.stringify(apiBase)});
s.setAttribute("data-bot-id",${JSON.stringify(botId)});
s.setAttribute("data-brand",${JSON.stringify(brand)});
(document.head||document.body).appendChild(s);
}catch(e){console.warn("[widget] client loader failed",e);}
})();`;
}

function upstreamFetchHeaders(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/javascript, text/javascript, */*",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    Referer: `${WIDGET_UPSTREAM_ORIGIN}/`,
  };
  const bypass =
    process.env.WIDGET_VERCEL_BYPASS_SECRET?.trim() ||
    process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
  if (bypass) {
    h["x-vercel-protection-bypass"] = bypass;
  }
  const auth = process.env.WIDGET_SCRIPT_FETCH_AUTHORIZATION?.trim();
  if (auth) {
    h.Authorization = auth.startsWith("Bearer ") ? auth : `Bearer ${auth}`;
  }
  return h;
}

/**
 * Same-origin proxy for widget.js when the CDN allows our server to fetch it.
 * If fetch fails (401, etc.), returns a tiny loader that pulls the script in the browser instead.
 */
export async function GET() {
  try {
    const res = await fetch(UPSTREAM_WIDGET, {
      cache: "no-store",
      headers: upstreamFetchHeaders(),
    });
    if (!res.ok) {
      const body =
        res.status === 401 || res.status === 403
          ? clientAuthBlockedMessage()
          : clientLoaderScript();
      return new NextResponse(body, {
        status: 200,
        headers: {
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control": "no-store",
          "Cross-Origin-Resource-Policy": "cross-origin",
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
    return new NextResponse(clientLoaderScript(), {
      status: 200,
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store",
        "Cross-Origin-Resource-Policy": "cross-origin",
      },
    });
  }
}
