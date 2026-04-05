import Link from "next/link";

const links = [
  { href: "/", label: "Overview" },
  { href: "/studio", label: "QR generator" },
  { href: "/integration", label: "Integration & widgets" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="leading-tight text-zinc-900 dark:text-zinc-50">
          <span className="block font-semibold tracking-tight">QR Brand Studio</span>
          <span className="block text-[11px] font-normal text-zinc-500 dark:text-zinc-400 sm:text-xs">
            Free QR code generator
          </span>
        </Link>
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
      </div>
    </header>
  );
}
