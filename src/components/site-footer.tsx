import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">QR Brand Studio</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              A <strong className="font-medium text-zinc-800 dark:text-zinc-200">QR code generator</strong>{" "}
              for teams: links, text, Wi‑Fi, vCard contacts, email, phone, and SMS payloads; custom
              colours; PNG or SVG export. Includes REST APIs and layout slots for analytics, chat,
              billing, and other SaaS widgets.
            </p>
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">Product</p>
            <ul className="mt-2 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link className="hover:text-zinc-900 dark:hover:text-zinc-200" href="/studio">
                  QR code generator
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-zinc-900 dark:hover:text-zinc-200"
                  href="/integration"
                >
                  Widget &amp; API integration
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-zinc-900 dark:hover:text-zinc-200"
                  href="/api/health"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Health check (JSON)
                </a>
              </li>
            </ul>
          </div>
          <div id="footer-widget-slot" data-widget-region="footer-secondary">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">Partner strip</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Mount co-marketing badges, trust seals, or a status page widget inside{" "}
              <code className="rounded bg-zinc-200/80 px-1 text-xs dark:bg-zinc-800">#footer-widget-slot</code>
              . This block is intentionally verbose so CMS and tag-manager rules can key off stable
              selectors without colliding with application chrome.
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-500">
          © {new Date().getFullYear()} QR Brand Studio. Built for teams who white-label QR output.
        </p>
      </div>
    </footer>
  );
}
