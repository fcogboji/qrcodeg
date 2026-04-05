"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { contrastRatio } from "@/lib/color-contrast";
import {
  encodeMailtoQr,
  encodeSmsQr,
  encodeTelQr,
  encodeVCardQr,
  encodeWifiQr,
  type WifiSecurity,
} from "@/lib/qr-payload";

type Customer = {
  id: string;
  name: string;
  slug: string;
  darkColor: string;
  lightColor: string;
};

type PayloadMode = "link" | "text" | "wifi" | "contact" | "email" | "phone" | "sms";

const defaultDark = "#0f172a";
const defaultLight = "#ffffff";

const MODES: { id: PayloadMode; label: string; hint: string }[] = [
  { id: "link", label: "Website link", hint: "Opens a URL when scanned" },
  { id: "text", label: "Plain text", hint: "Any short message or code" },
  { id: "wifi", label: "Wi‑Fi", hint: "Join network — no typing the password" },
  { id: "contact", label: "Contact card", hint: "Save name, phone, email (vCard)" },
  { id: "email", label: "Email", hint: "Opens the mail app with a draft" },
  { id: "phone", label: "Phone call", hint: "Starts a call on mobile" },
  { id: "sms", label: "Text message", hint: "Opens SMS with optional text" },
];

const WIDTH_PRESETS = [
  { value: 320, label: "Small (screen)" },
  { value: 512, label: "Medium (print)" },
  { value: 768, label: "Large (poster)" },
  { value: 1024, label: "Extra large" },
] as const;

const EC_LEVELS = [
  { value: "L" as const, label: "Low (~7%)", note: "Smallest pattern" },
  { value: "M" as const, label: "Medium (~15%)", note: "Default — good balance" },
  { value: "Q" as const, label: "Quartile (~25%)", note: "Damaged prints" },
  { value: "H" as const, label: "High (~30%)", note: "Logos / harsh lighting" },
];

export function StudioApp() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [name, setName] = useState("");
  const [darkColor, setDarkColor] = useState(defaultDark);
  const [lightColor, setLightColor] = useState(defaultLight);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [payloadMode, setPayloadMode] = useState<PayloadMode>("link");
  const [content, setContent] = useState("https://example.com/welcome");
  const [wifiSsid, setWifiSsid] = useState("Guest WiFi");
  const [wifiPassword, setWifiPassword] = useState("welcome123");
  const [wifiSecurity, setWifiSecurity] = useState<WifiSecurity>("WPA");
  const [vcName, setVcName] = useState("Alex Rivera");
  const [vcOrg, setVcOrg] = useState("QR Brand Studio");
  const [vcPhone, setVcPhone] = useState("+1 555 0100");
  const [vcEmail, setVcEmail] = useState("hello@example.com");
  const [vcUrl, setVcUrl] = useState("https://example.com");
  const [mailTo, setMailTo] = useState("team@example.com");
  const [mailSubject, setMailSubject] = useState("Hello");
  const [mailBody, setMailBody] = useState("");
  const [telNumber, setTelNumber] = useState("+1 555 0100");
  const [smsNumber, setSmsNumber] = useState("+1 555 0100");
  const [smsBody, setSmsBody] = useState("I'm at the door.");
  const [format, setFormat] = useState<"png" | "svg">("png");
  const [widthPx, setWidthPx] = useState<number>(512);
  const [ecLevel, setEcLevel] = useState<(typeof EC_LEVELS)[number]["value"]>("M");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load customers");
      setCustomers(data.customers ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const selected = useMemo(
    () => customers.find((c) => c.id === selectedId) ?? null,
    [customers, selectedId],
  );

  const fgForContrast = selected?.darkColor ?? darkColor;
  const bgForContrast = selected?.lightColor ?? lightColor;
  const scanContrast = useMemo(
    () => contrastRatio(fgForContrast, bgForContrast),
    [fgForContrast, bgForContrast],
  );

  useEffect(() => {
    if (selected) {
      setDarkColor(selected.darkColor);
      setLightColor(selected.lightColor);
    }
  }, [selected]);

  const encodedPayload = useMemo(() => {
    switch (payloadMode) {
      case "link":
      case "text":
        return content.trim();
      case "wifi":
        return encodeWifiQr({
          ssid: wifiSsid,
          password: wifiPassword,
          security: wifiSecurity,
          hidden: false,
        });
      case "contact":
        return encodeVCardQr({
          fullName: vcName,
          org: vcOrg || undefined,
          phone: vcPhone || undefined,
          email: vcEmail || undefined,
          url: vcUrl || undefined,
        });
      case "email":
        return encodeMailtoQr(mailTo, mailSubject || undefined, mailBody || undefined);
      case "phone":
        return encodeTelQr(telNumber);
      case "sms":
        return encodeSmsQr(smsNumber, smsBody || undefined);
      default:
        return "";
    }
  }, [
    payloadMode,
    content,
    wifiSsid,
    wifiPassword,
    wifiSecurity,
    vcName,
    vcOrg,
    vcPhone,
    vcEmail,
    vcUrl,
    mailTo,
    mailSubject,
    mailBody,
    telNumber,
    smsNumber,
    smsBody,
  ]);

  const applyPreview = useCallback(async () => {
    if (payloadMode === "wifi" && !wifiSsid.trim()) {
      setError("Enter the Wi‑Fi network name (SSID).");
      return;
    }
    if (payloadMode === "contact" && !vcName.trim()) {
      setError("Enter at least a full name for the contact card.");
      return;
    }
    if (payloadMode === "email" && !mailTo.trim()) {
      setError("Enter the recipient email address.");
      return;
    }
    if (payloadMode === "phone" && !telNumber.trim()) {
      setError("Enter a phone number.");
      return;
    }
    if (payloadMode === "sms" && !smsNumber.trim()) {
      setError("Enter a mobile number for SMS.");
      return;
    }
    if ((payloadMode === "link" || payloadMode === "text") && !content.trim()) {
      setError("Enter a URL or some text to encode.");
      return;
    }
    if (!encodedPayload.trim()) {
      setError("Add some content to encode — the QR cannot be empty.");
      return;
    }
    setBusy(true);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    try {
      const body: Record<string, unknown> = {
        content: encodedPayload,
        darkColor,
        lightColor,
        format,
        width: widthPx,
        errorCorrectionLevel: ecLevel,
      };
      if (selectedId) {
        body.customerId = selectedId;
        delete body.darkColor;
        delete body.lightColor;
      }
      const res = await fetch("/api/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? res.statusText);
      }
      const blob = await res.blob();
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Preview failed");
    } finally {
      setBusy(false);
    }
  }, [
    encodedPayload,
    payloadMode,
    wifiSsid,
    vcName,
    mailTo,
    telNumber,
    smsNumber,
    content,
    darkColor,
    lightColor,
    format,
    widthPx,
    ecLevel,
    previewUrl,
    selectedId,
  ]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function flashCopy(msg: string) {
    setCopyHint(msg);
    window.setTimeout(() => setCopyHint(null), 2000);
  }

  async function copyEncodedString() {
    try {
      await navigator.clipboard.writeText(encodedPayload);
      flashCopy("Encoded text copied");
    } catch {
      setError("Could not copy — try selecting the text manually.");
    }
  }

  async function copyImageToClipboard() {
    if (!previewUrl || format !== "png") {
      setError("Copy image works with PNG preview. Switch format to PNG and generate.");
      return;
    }
    try {
      const blob = await fetch(previewUrl).then((r) => r.blob());
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      flashCopy("Image copied — paste into Slides, Mail, etc.");
    } catch {
      setError("Image copy not supported in this browser — use Download instead.");
    }
  }

  async function addCustomer(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, darkColor, lightColor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create customer");
      setName("");
      setCustomers((prev) => [data.customer, ...prev]);
      setSelectedId(data.customer.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function removeCustomer(id: string) {
    if (!confirm("Remove this customer profile?")) return;
    setError(null);
    const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    if (selectedId === id) setSelectedId(null);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }

  function download() {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = `qr-${selected?.slug ?? "export"}.${format === "svg" ? "svg" : "png"}`;
    a.click();
  }

  const modeMeta = MODES.find((m) => m.id === payloadMode);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <div className="rounded-2xl border border-violet-200 bg-violet-50/80 p-5 dark:border-violet-900/50 dark:bg-violet-950/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
            QR code generator
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Turn links, Wi‑Fi, contacts &amp; more into scannable QR codes
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            Pick what you want to encode below — you never have to memorize Wi‑Fi or vCard syntax. Set
            size and error correction for print vs screen, match colours to each customer, then
            download PNG or SVG. Everything runs in this app; your data is not sent to a third-party
            QR website.
          </p>
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">What should the QR do?</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {modeMeta?.hint}. The exact text we encode appears under your fields — use{" "}
            <strong className="font-medium text-zinc-800 dark:text-zinc-200">Copy text</strong> to
            reuse it elsewhere.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPayloadMode(m.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                  payloadMode === m.id
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {(payloadMode === "link" || payloadMode === "text") && (
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {payloadMode === "link" ? "URL" : "Text"}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={payloadMode === "link" ? 2 : 5}
                  placeholder={
                    payloadMode === "link"
                      ? "https://yoursite.com/page"
                      : "Coupon code, short message, or serial…"
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none ring-violet-500/30 focus:border-violet-500 focus:ring-4 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>
            )}

            {payloadMode === "wifi" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Network name (SSID)
                  <input
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                  <input
                    type="password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    autoComplete="off"
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
                <label className="sm:col-span-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Security
                  <select
                    value={wifiSecurity}
                    onChange={(e) => setWifiSecurity(e.target.value as WifiSecurity)}
                    className="mt-1 w-full max-w-xs rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  >
                    <option value="WPA">WPA / WPA2 personal</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Open network (no password)</option>
                  </select>
                </label>
              </div>
            )}

            {payloadMode === "contact" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Full name
                  <input
                    value={vcName}
                    onChange={(e) => setVcName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Organization
                  <input
                    value={vcOrg}
                    onChange={(e) => setVcOrg(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Phone
                  <input
                    value={vcPhone}
                    onChange={(e) => setVcPhone(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                  <input
                    type="email"
                    value={vcEmail}
                    onChange={(e) => setVcEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
                <label className="sm:col-span-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Website
                  <input
                    value={vcUrl}
                    onChange={(e) => setVcUrl(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
              </div>
            )}

            {payloadMode === "email" && (
              <div className="grid gap-4">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  To
                  <input
                    type="email"
                    value={mailTo}
                    onChange={(e) => setMailTo(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Subject
                  <input
                    value={mailSubject}
                    onChange={(e) => setMailSubject(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Body (optional)
                  <textarea
                    value={mailBody}
                    onChange={(e) => setMailBody(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
              </div>
            )}

            {payloadMode === "phone" && (
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Phone number
                <input
                  value={telNumber}
                  onChange={(e) => setTelNumber(e.target.value)}
                  placeholder="+1 555 123 4567"
                  className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>
            )}

            {payloadMode === "sms" && (
              <div className="grid gap-4">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Mobile number
                  <input
                    value={smsNumber}
                    onChange={(e) => setSmsNumber(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Message (optional)
                  <textarea
                    value={smsBody}
                    onChange={(e) => setSmsBody(e.target.value)}
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950/80">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Encoded string (read-only)
              </span>
              <button
                type="button"
                onClick={() => void copyEncodedString()}
                disabled={!encodedPayload}
                className="text-xs font-medium text-violet-600 hover:text-violet-500 disabled:opacity-40 dark:text-violet-400"
              >
                Copy text
              </button>
            </div>
            <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap break-all font-mono text-xs text-zinc-800 dark:text-zinc-200">
              {encodedPayload || "—"}
            </pre>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 border-t border-zinc-100 pt-6 dark:border-zinc-800">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Image format
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as "png" | "svg")}
                className="ml-2 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="png">PNG (raster)</option>
                <option value="svg">SVG (scales cleanly)</option>
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Output size
              <select
                value={widthPx}
                onChange={(e) => setWidthPx(Number(e.target.value))}
                className="ml-2 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {WIDTH_PRESETS.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label} ({w.value}px)
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Error correction
              <select
                value={ecLevel}
                onChange={(e) => setEcLevel(e.target.value as (typeof EC_LEVELS)[number]["value"])}
                className="ml-2 max-w-[220px] rounded-lg border border-zinc-200 bg-white px-2 py-1 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {EC_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label} — {l.note}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Colours &amp; preview</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {selected
              ? `Using profile “${selected.name}”. Colours are read-only here; edit the profile on the right or create a new customer.`
              : "Pick module (foreground) and background. Strong contrast helps phones scan faster — see the note below."}
          </p>
          {scanContrast != null && scanContrast < 3 && (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
              Contrast is low (about {scanContrast.toFixed(1)}∶1). For reliable scanning, try a darker
              foreground or lighter background — especially for outdoor posters or glossy paper.
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="w-28">Foreground</span>
              <input
                type="color"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                disabled={!!selected}
                className="h-10 w-14 cursor-pointer rounded border border-zinc-200 disabled:opacity-50 dark:border-zinc-700"
              />
              <input
                type="text"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                disabled={!!selected}
                className="w-28 rounded-lg border border-zinc-200 px-2 py-1 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="w-28">Background</span>
              <input
                type="color"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                disabled={!!selected}
                className="h-10 w-14 cursor-pointer rounded border border-zinc-200 disabled:opacity-50 dark:border-zinc-700"
              />
              <input
                type="text"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                disabled={!!selected}
                className="w-28 rounded-lg border border-zinc-200 px-2 py-1 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void applyPreview()}
              disabled={busy}
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 disabled:opacity-50"
            >
              {busy ? "Generating…" : "Generate QR code"}
            </button>
            <button
              type="button"
              onClick={download}
              disabled={!previewUrl}
              className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Download
            </button>
            <button
              type="button"
              onClick={() => void copyImageToClipboard()}
              disabled={!previewUrl}
              className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Copy image
            </button>
            {copyHint && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400">{copyHint}</span>
            )}
          </div>
          {error && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
          <div className="mt-6 flex min-h-[200px] items-center justify-center rounded-xl bg-zinc-100 p-6 dark:bg-zinc-950">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Generated QR code preview"
                className="max-h-72 w-auto max-w-full object-contain"
              />
            ) : (
              <p className="max-w-sm text-center text-sm text-zinc-500">
                Your QR code preview will appear here. Choose a type above, then click{" "}
                <strong className="text-zinc-700 dark:text-zinc-300">Generate QR code</strong>.
              </p>
            )}
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="font-medium text-zinc-900 dark:text-zinc-100">Why this isn&apos;t “just another” generator</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <strong className="text-zinc-800 dark:text-zinc-200">Smart types</strong> — Wi‑Fi,
              contact cards, SMS, and email are built in (no cryptic strings).
            </li>
            <li>
              <strong className="text-zinc-800 dark:text-zinc-200">Print-ready</strong> — size presets
              and error correction for real-world scanning.
            </li>
            <li>
              <strong className="text-zinc-800 dark:text-zinc-200">Brand colours</strong> — save a
              palette per customer (sidebar) or use your own hex values.
            </li>
            <li>
              <strong className="text-zinc-800 dark:text-zinc-200">Your stack</strong> — same options
              via REST API for apps and automation.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="font-medium text-zinc-900 dark:text-zinc-100">Customer profiles</h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            Each row is a tenant-style colour preset. Your SaaS can mirror these records via the REST
            API and pass{" "}
            <code className="rounded bg-zinc-100 px-0.5 dark:bg-zinc-800">customerId</code> when
            generating codes server-side.
          </p>
          {loadingList ? (
            <p className="mt-4 text-sm text-zinc-500">Loading…</p>
          ) : (
            <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className={`w-full rounded-lg px-3 py-2 text-left transition ${
                    selectedId === null
                      ? "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  Ad-hoc colours
                </button>
              </li>
              {customers.map((c) => (
                <li key={c.id} className="flex items-stretch gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`min-w-0 flex-1 rounded-lg px-3 py-2 text-left transition ${
                      selectedId === c.id
                        ? "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span className="block truncate font-medium">{c.name}</span>
                    <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {c.slug}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${c.name}`}
                    onClick={() => void removeCustomer(c.id)}
                    className="rounded-lg px-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form
          onSubmit={(e) => void addCustomer(e)}
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          <h2 className="font-medium text-zinc-900 dark:text-zinc-100">New customer</h2>
          <label className="mt-3 block text-sm text-zinc-700 dark:text-zinc-300">
            Display name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder="e.g. Acme Retail EU"
            />
          </label>
          <div className="mt-3 flex gap-3">
            <label className="text-xs text-zinc-600 dark:text-zinc-400">
              FG
              <input
                type="color"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                className="mt-1 block h-9 w-full cursor-pointer rounded border border-zinc-200 dark:border-zinc-700"
              />
            </label>
            <label className="text-xs text-zinc-600 dark:text-zinc-400">
              BG
              <input
                type="color"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                className="mt-1 block h-9 w-full cursor-pointer rounded border border-zinc-200 dark:border-zinc-700"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={busy || !name.trim()}
            className="mt-4 w-full rounded-xl bg-zinc-900 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Save profile
          </button>
        </form>
      </aside>
    </div>
  );
}
