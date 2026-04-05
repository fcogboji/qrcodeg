export type WifiSecurity = "WPA" | "WPA2" | "WEP" | "nopass";

/** Standard Wi-Fi QR format (most camera apps understand this). */
export function encodeWifiQr(opts: {
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden?: boolean;
}): string {
  const ssid = escapeWifiField(opts.ssid.trim());
  const pwd = escapeWifiField(opts.password);
  const t = opts.security === "nopass" ? "nopass" : opts.security;
  const h = opts.hidden ? "true" : "false";
  if (opts.security === "nopass") {
    return `WIFI:T:nopass;S:${ssid};H:${h};;`;
  }
  return `WIFI:T:${t};S:${ssid};P:${pwd};H:${h};;`;
}

function escapeWifiField(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/:/g, "\\:").replace(/"/g, '\\"');
}

export function encodeVCardQr(opts: {
  fullName: string;
  org?: string;
  phone?: string;
  email?: string;
  url?: string;
}): string {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  if (opts.fullName.trim()) {
    lines.push(`FN:${escapeVCardLine(opts.fullName.trim())}`);
  }
  if (opts.org?.trim()) lines.push(`ORG:${escapeVCardLine(opts.org.trim())}`);
  if (opts.phone?.trim()) lines.push(`TEL;TYPE=CELL:${escapeVCardLine(opts.phone.trim())}`);
  if (opts.email?.trim()) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardLine(opts.email.trim())}`);
  if (opts.url?.trim()) lines.push(`URL:${escapeVCardLine(opts.url.trim())}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

function escapeVCardLine(s: string): string {
  return s.replace(/\n/g, "\\n");
}

export function encodeMailtoQr(to: string, subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const q = params.toString();
  const addr = to.trim();
  return q ? `mailto:${addr}?${q}` : `mailto:${addr}`;
}

export function encodeSmsQr(number: string, message?: string): string {
  const n = number.trim().replace(/\s/g, "");
  if (!message?.trim()) return `sms:${n}`;
  return `sms:${n}?body=${encodeURIComponent(message.trim())}`;
}

export function encodeTelQr(number: string): string {
  const n = number.trim().replace(/\s/g, "");
  return `tel:${n}`;
}
