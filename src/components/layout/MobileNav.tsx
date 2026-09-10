"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

/** قائمة الموبايل (زر + لوحة منسدلة). */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="القائمة"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:text-gold"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-border bg-surface shadow-lg">
          <form method="get" action="/products" className="border-b border-border p-4">
            <input
              type="search"
              name="q"
              placeholder="ابحث عن عطر..."
              className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-gold"
            />
          </form>
          <nav className="flex flex-col p-2">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-4 py-3 text-sm text-foreground hover:bg-background hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
