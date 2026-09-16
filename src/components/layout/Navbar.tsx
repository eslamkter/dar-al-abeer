import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { CartLink } from "./CartLink";
import { MobileNav } from "./MobileNav";
import { LanguageSwitcher } from "./LanguageSwitcher";

const socialIcons: Record<string, React.ReactNode> = {
  instagram: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 3c.4 2.2 2 3.9 4.4 4.2v3c-1.6 0-3.1-.5-4.4-1.4v6.6a5.6 5.6 0 1 1-4.8-5.5v3.1a2.5 2.5 0 1 0 1.8 2.4V3h3Z" />
    </svg>
  ),
  snapchat: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c3 0 5 2.3 5 5.4v2.3c0 .3.4.7 1.2.9 1 .3 1.4.9 1 1.6-.3.5-1 .8-1.6 1 .1.4.4.8 1 1 .5.2.6.8.1 1.1-.6.4-1.3.5-1.7.9-.3.3-.3.7-1 1-.9.4-1.7-.2-2.7-.2-1 0-1.4.9-3.3.9s-2.3-.9-3.3-.9c-1 0-1.8.6-2.7.2-.7-.3-.7-.7-1-1-.4-.4-1.1-.5-1.7-.9-.5-.3-.4-.9.1-1.1.6-.2.9-.6 1-1-.6-.2-1.3-.5-1.6-1-.4-.7 0-1.3 1-1.6.8-.2 1.2-.6 1.2-.9V7.4C7 4.3 9 2 12 2Z" />
    </svg>
  ),
};

export function Navbar() {
  const social = Object.entries(siteConfig.contact.social);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* الشعار */}
        <Link href="/" className="shrink-0 font-heading text-xl font-bold text-foreground">
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

        {/*
          شريط المعلومات (هاتف + سوشيال + لغة) مدموج هنا جوّا الهيدر
          نفسه بدل ما يبقى شريط منفصل فوقه — variant "merged" في
          site.ts. ظاهر من xl بس عشان الصف ما يزدحمش؛ نسخة الموبايل في
          ذيل درج MobileNav.
        */}
        <div className="hidden items-center gap-4 border-r border-border pr-4 xl:flex">
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
            className="text-xs text-muted transition-colors hover:text-gold"
            dir="ltr"
          >
            {siteConfig.contact.phone}
          </a>
          <div className="flex items-center gap-2 text-muted">
            {social.map(([key, href]) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={key}
                className="transition-colors hover:text-gold"
              >
                {socialIcons[key]}
              </a>
            ))}
          </div>
          <LanguageSwitcher />
        </div>

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
