import Link from "next/link";
import { WidgetSlot } from "@/components/widget-slot";

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-zinc-200 bg-gradient-to-b from-white to-zinc-50 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-medium uppercase tracking-wider text-violet-600 dark:text-violet-400">
            QR code generator
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Make QR codes for websites, Wi‑Fi, contacts, and more — in your brand colours
          </h1>
          <p className="mt-4 text-base font-medium text-zinc-800 dark:text-zinc-200">
            This site is a <strong className="font-semibold">QR code generator</strong>: you type what
            people should get when they scan (a link, a network, a phone number, etc.), and we draw
            the square pattern phones read. No account required to try it; nothing is sent to an
            external &quot;QR service&quot; — generation runs on this app.
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Save <strong className="font-medium text-zinc-800 dark:text-zinc-200">customer colour</strong>{" "}
            presets so every tenant&apos;s codes match their packaging and campaigns. Use{" "}
            <strong className="font-medium text-zinc-800 dark:text-zinc-200">Wi‑Fi and contact</strong>{" "}
            wizards so you never hand-type cryptic strings. The same options are available over the{" "}
            <strong className="font-medium text-zinc-800 dark:text-zinc-200">REST API</strong> for your
            own product or automation.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/studio"
              className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500"
            >
              Open QR generator
            </Link>
            <Link
              href="/integration"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Read integration guide
            </Link>
          </div>
        </div>
      </section>

      <div
        id="hero-widget-rail"
        data-widget-region="hero-rail"
        className="border-b border-zinc-200 bg-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-900/50"
      >
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <WidgetSlot
            id="widget-hero-announcement"
            title="Announcement / banner widget"
            description="Ideal for Intercom sliders, Pendo guides, or a CookieYes bar. The parent #hero-widget-rail spans the viewport width so full-bleed marketing banners align with your design system."
            minHeight="min-h-[100px]"
            data-widget-kind="announcement"
          />
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Why teams adopt this stack
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <article>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Tenant-aware colours</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Customer records keep canonical hex values. When your billing system provisions a new
              account, create a matching profile via POST /api/customers. Every subsequent QR request
              can reference customerId and inherit the right palette without duplicating colour
              logic in the browser.
            </p>
          </article>
          <article>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Production operations</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              SQLite ships by default for zero-config demos; point DATABASE_URL at PostgreSQL for real
              deployments. The build runs Prisma generate and migrate deploy. A lightweight /api/health
              route executes SELECT 1 so orchestrators can wire liveness and readiness probes without
              custom scripts.
            </p>
          </article>
          <article>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">SaaS surface area</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Long-form copy and redundant DOM hooks exist on purpose. Product-led growth teams embed
              Calendly, Chili Piper, or native chat widgets next to technical documentation without
              refactoring layouts. Stable ids reduce breakage when marketing rotates campaigns weekly.
            </p>
          </article>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <WidgetSlot
            id="widget-side-chat"
            title="Conversational widget column"
            description="Drop Drift, HubSpot chat, or Crisp here. The column sits alongside primary content on large screens; stack naturally on mobile. Use data-widget-kind=&quot;chat&quot; in your tag manager to scope triggers."
            data-widget-kind="chat"
          />
          <div className="max-w-none space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Embedding third-party SaaS responsibly
            </h2>
            <p>
              Modern SaaS products rarely ship as a single bundle. You might rely on a customer-data
              platform for audiences, a separate tool for session replay, and yet another vendor for
              invoice portals. Each vendor wants a predictable anchor element. This template repeats
              descriptive paragraphs so automated accessibility audits still see meaningful text even
              before widgets load, and so SEO crawlers understand the page intent while you iterate on
              embed scripts.
            </p>
            <p>
              When you integrate a widget, prefer loading scripts after consent where regulations
              require it. The dashed regions are visually obvious in staging so QA can confirm that
              layout shift stays within acceptable thresholds. If a script fails, the surrounding
              copy still communicates value to human visitors.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">API snapshot</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          The UI builds standard strings for you (for example{" "}
          <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">WIFI:…</code> or vCard
          blocks); the API always receives a single <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">content</code>{" "}
          string to turn into pixels. All endpoints use JSON except POST /api/qr, which returns raw
          PNG or SVG bytes.
        </p>
        <ul className="mt-8 space-y-4 font-mono text-xs text-zinc-800 dark:text-zinc-200 sm:text-sm">
          <li>
            <span className="text-violet-600 dark:text-violet-400">GET</span> /api/customers — list
            colour profiles
          </li>
          <li>
            <span className="text-violet-600 dark:text-violet-400">POST</span> /api/customers — create
            profile (optional slug; auto-suffixed on collision)
          </li>
          <li>
            <span className="text-violet-600 dark:text-violet-400">PATCH</span>{" "}
            /api/customers/[id] — rename or recolour
          </li>
          <li>
            <span className="text-violet-600 dark:text-violet-400">DELETE</span> /api/customers/[id]
          </li>
          <li>
            <span className="text-violet-600 dark:text-violet-400">POST</span> /api/qr — render code
            (body includes content, format, optional customerId)
          </li>
          <li>
            <span className="text-violet-600 dark:text-violet-400">GET</span> /api/health — database
            connectivity
          </li>
        </ul>
      </section>
    </main>
  );
}
