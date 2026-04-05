import Link from "next/link";
import { ClerkHeaderAuth } from "@/components/clerk-header-auth";

const links = [
  { href: "/", label: "Overview" },
  { href: "/studio", label: "QR generator" },
  { href: "/integration", label: "Integration & widgets" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-auto min-h-14 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:flex-nowrap sm:px-6 sm:py-0">
        <Link href="/" className="min-w-0 shrink-0 leading-tight text-zinc-900 dark:text-zinc-50">
          <span className="block font-semibold tracking-tight">QR Brand Studio</span>
          <span className="block text-[11px] font-normal text-zinc-500 dark:text-zinc-400 sm:text-xs">
            Free QR code generator
          </span>
        </Link>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3">
          <nav className="flex flex-wrap items-center gap-1 text-sm sm:gap-2" aria-label="Main">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-1.5 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                {label}
              </Link>
            ))}
          </nav>
          <ClerkHeaderAuth />
        </div>
      </div>
    </header>
  );
}
