"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/day", label: "Day" },
  { href: "/week", label: "Week" },
  { href: "/month", label: "Month" },
  { href: "/year", label: "Year" },
  { href: "/settings", label: "Settings" },
];

export function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Desktop: top bar */}
      <header className="hidden border-b border-border bg-surface sm:block">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/day" className="font-semibold tracking-tight">
            Rate Your Day
          </Link>
          <nav className="flex gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive(l.href) ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile: bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] sm:hidden">
        <div className="grid grid-cols-5">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`py-3 text-center text-sm ${isActive(l.href) ? "font-semibold text-fg" : "text-muted"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
