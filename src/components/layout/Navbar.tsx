import {DiscoveryMenu} from "./DiscoveryMenu";
import {SearchSuggestions} from "./SearchSuggestions";
import type {Product} from "@/lib/types";
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

export function Navbar({products}:{products:Product[]}) {
  const social = siteConfig.contact.enabled?Object.entries(siteConfig.contact.social):[];
  const navLeft = siteConfig.nav.slice(0, 2);
  const navRight = siteConfig.nav.slice(2);

  return (
    // مش sticky عمدًا — بعكس دار الأثاث وعالم الصغار. شعار في النص +
    // نص القائمة متقسم حواليه بخط نضيف من غير خلفيات أو فواصل — لغة
    // بصرية "هادئة فاخرة" مختلفة عن شكل الـ pills المصمتة في دار
    // الأثاث والأيقونات الملوّنة في عالم الصغار، مش بس ترتيب مختلف.
    //
    // صفّين جوّا نفس عنصر <header> الواحد (مش شريط منفصل — variant
    // "merged" في site.ts فاضل زي ما هو): صف رفيع فوق للمعلومات، وصف
    // رئيسي تحت للشعار/القائمة. الفصل ده حلّ الازدحام اللي كان حاصل
    // لما كل حاجة كانت متلزّقة في صف واحد.
    <header className="relative z-40 border-b border-border bg-surface">
      {/* الصف العلوي — هاتف / سوشيال / لغة، ظاهر من xl بس */}
      {siteConfig.contact.enabled&&<div className="hidden border-b border-border-soft md:block">
        <Container className="flex min-h-11 items-center justify-between text-sm">
          {siteConfig.contact.enabled&&<a
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
            className="text-muted transition-colors hover:text-gold"
            dir="ltr"
          >
            {siteConfig.contact.phone}
          </a>}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-muted">
              {social.map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center transition-colors hover:text-gold"
                >
                  {socialIcons[key]}
                </a>
              ))}
            </div>
            <LanguageSwitcher />
          </div>
        </Container>
      </div>}

      {/* الصف الرئيسي — شعار في النص، القائمة متقسّمة حواليه */}
      <Container>
        <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-6">
          <nav className="hidden items-center gap-10 md:flex">
            {navLeft.map((item) => item.href==="/products" ? <DiscoveryMenu key={item.href} products={products}/> : (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link relative whitespace-nowrap text-sm tracking-wide text-muted transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/wishlist" className="nav-link whitespace-nowrap py-3 text-sm text-muted hover:text-gold">{siteConfig.savedLists.title}</Link>
          </nav>

          <Link
            href="/"
            className="justify-self-center font-heading text-2xl font-bold text-foreground"
          >
            {siteConfig.name}
          </Link>

          <div className="flex items-center justify-end gap-6">
            <nav className="hidden items-center gap-10 md:flex">
              {navRight.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link relative whitespace-nowrap text-sm tracking-wide text-muted transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <SearchSuggestions products={products}/>
              <CartLink />
              <MobileNav products={products} />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
