import type { Metadata } from "next";
import { Hero } from "@/components/ui/Hero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: `تواصل مع ${siteConfig.name} — نسعد بخدمتك.`,
};

export default function ContactPage() {
  const c = siteConfig.contact;
  const info = [
    { label: "الهاتف", value: c.phone, href: `tel:${c.phone}` },
    { label: "البريد الإلكتروني", value: c.email, href: `mailto:${c.email}` },
    { label: "العنوان", value: c.address },
    { label: "مواعيد العمل", value: c.hours },
  ];

  return (
    <>
      <Hero
        title="تواصل معنا"
        subtitle="نسعد بالإجابة على استفساراتك وخدمتك"
        image={siteConfig.images.contact}
      />

      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* معلومات التواصل */}
          <div>
            <h2 className="font-heading text-2xl font-bold">معلومات التواصل</h2>
            <div className="mt-6 space-y-5">
              {info.map((item) => (
                <div key={item.label}>
                  <div className="text-sm text-gold">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} className="hover:text-gold">
                      {item.value}
                    </a>
                  ) : (
                    <div>{item.value}</div>
                  )}
                </div>
              ))}
            </div>

            {/* زر واتساب مباشر */}
            <a
              href={`https://wa.me/${c.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              تواصل عبر واتساب
            </a>
          </div>

          {/* نموذج الرسالة */}
          <div className="rounded-lg border border-border bg-background p-6">
            <h2 className="font-heading text-2xl font-bold">أرسل رسالة</h2>
            <p className="mt-1 mb-6 text-sm text-muted">
              اكتب رسالتك وسنتواصل معك في أقرب وقت.
            </p>
            <ContactForm />
          </div>
        </div>
      </Container>
    </>
  );
}
