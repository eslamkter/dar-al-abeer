import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import { Container } from "@/components/ui/Container";
import { ValueGrid } from "@/components/about/ValueGrid";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "من نحن",
  description: `تعرّف على قصة ${siteConfig.name} وشغفنا بصناعة العطور الفاخرة.`,
};

const icon = {
  drop: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c3.5 4.2 6 7.7 6 10.5a6 6 0 1 1-12 0C6 10.7 8.5 7.2 12 3Z" />
    </svg>
  ),
  hand: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M14 11.5V6a1.5 1.5 0 0 1 3 0v9" />
      <path d="M17 10.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6.5 7h-1C9 21 6 18.5 6 15v-2.8c0-.8.6-1.5 1.4-1.5.8 0 1.4.5 1.6 1.3l.5 2" />
    </svg>
  ),
  flame: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21c4.5 0 7-2.8 7-6.5 0-2.6-1.4-4.4-2.8-6-.2 1.6-1 2.7-1.9 2.7-.4-3-2-5.2-3.8-7.2-.3 2.7-1.3 4.3-3 6C6 11.5 5 13 5 14.9 5 18.4 7.5 21 12 21Z" />
    </svg>
  ),
};

const values = [
  {
    title: "مكوّنات نادرة",
    body: "نختار أجود الزيوت العطرية والخامات من مصادرها الأصلية حول العالم.",
    icon: icon.drop,
  },
  {
    title: "صناعة يدوية",
    body: "كل تركيبة تُصاغ بعناية على يد خبراء عطور بخبرة تمتد لعقود.",
    icon: icon.hand,
  },
  {
    title: "ثبات يدوم",
    body: "عطور بتركيز عالٍ تمنحك حضورًا يرافقك طوال اليوم.",
    icon: icon.flame,
  },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        title="من نحن"
        subtitle={siteConfig.tagline}
        image={siteConfig.images.about}
        ambient
      />

      {/* القصة */}
      <Container className="py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm tracking-widest text-gold">قصتنا</span>
            <h2 className="mt-2 font-heading text-3xl font-bold">
              عطرٌ يروي حكاية
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-foreground/80">
              <p>
                وُلدت {siteConfig.name} من شغفٍ عميق بفنّ العطور الشرقية
                الأصيلة. نؤمن أن العطر ليس مجرد رائحة، بل توقيعٌ يعبّر عن
                شخصية صاحبه ويترك أثرًا في ذاكرة كل من يلتقيه.
              </p>
              <p>
                من أرقى أنواع العود والزعفران والورد الدمشقي، نصنع تشكيلة
                استثنائية توازن بين عراقة التراث العربي ولمسة العصر الحديث،
                لتقدّم لك تجربة عطرية لا تُنسى.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=80"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>

      {/* القيم */}
      <section className="border-y border-border bg-surface">
        <Container className="py-16">
          <h2 className="mb-10 text-center font-heading text-3xl font-bold">
            ما يميّزنا
          </h2>
          <ValueGrid values={values} />
        </Container>
      </section>

      {/* دعوة للتصفح */}
      <Container className="py-20 text-center">
        <h2 className="font-heading text-2xl font-bold">
          اكتشف تشكيلتنا
        </h2>
        <p className="mt-2 text-muted">
          مجموعة مختارة بعناية تنتظر أن تكتشفها.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
        >
          تصفّح المتجر
        </Link>
      </Container>
    </>
  );
}
