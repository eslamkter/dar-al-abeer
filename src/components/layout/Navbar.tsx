import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { CartLink } from "./CartLink";
import { MobileNav } from "./MobileNav";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        {/* الشعار */}
        <Link href="/" className="font-heading text-xl font-bold text-foreground">
          {siteConfig.name}
        </Link>

        {/* روابط نضيفة (٤ فقط) */}
        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link relative text-sm text-muted transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* بحث + سلة + قائمة موبايل */}
        <div className="flex items-center gap-3">
          <form method="get" action="/products" className="hidden sm:block">
            <input
              type="search"
              name="q"
              placeholder="ابحث..."
              aria-label="بحث"
              className="w-32 rounded-full border border-border bg-background px-4 py-1.5 text-sm outline-none transition-all focus:w-44 focus:border-gold"
            />
          </form>
          <CartLink />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
