import Link from "next/link";
import { signOutAction } from "@/app/actions/sign-out";
import { getSession } from "@/lib/get-session";

const links = [
  { href: "/", label: "Overview" },
  { href: "/studio", label: "QR generator" },
  { href: "/integration", label: "Integration & widgets" },
] as const;

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:flex-nowrap sm:px-6 sm:py-0">
        <Link href="/" className="min-w-0 shrink-0 leading-tight text-zinc-900 dark:text-zinc-50">
          <span className="block font-semibold tracking-tight">QR Brand Studio</span>
          <span className="block text-[11px] font-normal text-zinc-500 dark:text-zinc-400 sm:text-xs">
            Free QR code generator
          </span>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
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
          <div className="flex items-center gap-2 border-l border-zinc-200 pl-2 dark:border-zinc-700 sm:pl-3">
            {session?.user ? (
              <>
                <span className="hidden max-w-[140px] truncate text-xs text-zinc-500 dark:text-zinc-400 sm:inline">
                  {session.user.email}
                </span>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
