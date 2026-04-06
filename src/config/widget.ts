/**
 * Widget integration — **recommended setup**
 *
 * The browser should load **only** your own app’s script:
 *   `<script src="https://YOUR-APP/embed/widget-js" ...>`
 *
 * Do **not** load `https://widget-host/embed/widget-js` from third-party sites — that path is often
 * behind auth (Clerk) and returns 404 for anonymous visitors.
 *
 * Our route `GET /embed/widget-js` proxies the real file from `WIDGET_SCRIPT_UPSTREAM_URL`
 * (default: `{NEXT_PUBLIC_WIDGET_ORIGIN}/widget.js`).
 */
export const WIDGET_UPSTREAM_ORIGIN =
  process.env.NEXT_PUBLIC_WIDGET_ORIGIN ?? "https://24-7concept-pew4inhis-friday-s-projects.vercel.app";

/** Upstream file to fetch (public asset on the widget app). */
export const WIDGET_SCRIPT_PATH = "/widget.js";

export const WIDGET_SCRIPT_URL = `${WIDGET_UPSTREAM_ORIGIN.replace(/\/$/, "")}${WIDGET_SCRIPT_PATH}`;

/** Override full upstream URL if `widget.js` lives elsewhere. */
export const WIDGET_SCRIPT_UPSTREAM_URL =
  process.env.WIDGET_SCRIPT_UPSTREAM_URL?.trim() || WIDGET_SCRIPT_URL;

/** `data-*` attrs for the widget runtime (match values from your widget dashboard). */
export const widgetDataAttributes = {
  "data-api-base": WIDGET_UPSTREAM_ORIGIN,
  "data-bot-id": process.env.NEXT_PUBLIC_WIDGET_BOT_ID ?? "cmnmbgw1200032txm31qsfwll",
  "data-brand": process.env.NEXT_PUBLIC_WIDGET_BRAND ?? "ab",
} as const;
