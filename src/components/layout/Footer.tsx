import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <Container className="grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <h4 className="font-heading text-lg font-bold">{siteConfig.name}</h4>
          <p className="mt-2 text-sm text-muted">{siteConfig.tagline}</p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">روابط سريعة</h4>
          <ul className="space-y-2 text-sm text-muted">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">تواصل معنا</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>{siteConfig.contact.phone}</li>
            <li>{siteConfig.contact.email}</li>
            <li>{siteConfig.contact.address}</li>
          </ul>
        </div>
      </Container>

      <div className="flex flex-col items-center gap-2 border-t border-border py-4 text-center text-xs text-muted sm:flex-row sm:justify-between">
        <span>
          © {new Date().getFullYear()} {siteConfig.name}. جميع الحقوق محفوظة.
        </span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-gold">
            سياسة الخصوصية
          </Link>
          <Link href="/terms" className="hover:text-gold">
            الشروط والأحكام
          </Link>
        </div>
      </div>
    </footer>
  );
}
