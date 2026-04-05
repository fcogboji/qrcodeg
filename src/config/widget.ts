/** Third-party chat/widget — used by layout + /embed/widget-js proxy. */
export const WIDGET_UPSTREAM_ORIGIN =
  process.env.NEXT_PUBLIC_WIDGET_ORIGIN ?? "https://24-7concept-pew4inhis-friday-s-projects.vercel.app";

export const WIDGET_SCRIPT_PATH = "/widget.js";

export const WIDGET_SCRIPT_URL = `${WIDGET_UPSTREAM_ORIGIN.replace(/\/$/, "")}${WIDGET_SCRIPT_PATH}`;

export const widgetDataAttributes = {
  "data-api-base": WIDGET_UPSTREAM_ORIGIN,
  "data-bot-id": "cmnlweicd000110vl1ij6guu1",
  "data-brand": "qrcodeg",
} as const;
