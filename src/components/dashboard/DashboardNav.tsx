"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "نظرة عامة", href: "/dashboard" },
  { label: "المنتجات", href: "/dashboard/products" },
  { label: "الطلبات", href: "/dashboard/orders" },
  { label: "العملاء", href: "/dashboard/customers" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const active =
          link.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-md px-4 py-2 text-sm transition-colors ${
              active
                ? "bg-gold text-white"
                : "text-muted hover:bg-background hover:text-gold"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
