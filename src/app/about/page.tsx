import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "من نحن",
  description: `تعرّف على قصة ${siteConfig.name} وشغفنا بصناعة العطور الفاخرة.`,
};

const values = [
  {
    title: "مكوّنات نادرة",
    body: "نختار أجود الزيوت العطرية والخامات من مصادرها الأصلية حول العالم.",
  },
  {
    title: "صناعة يدوية",
    body: "كل تركيبة تُصاغ بعناية على يد خبراء عطور بخبرة تمتد لعقود.",
  },
  {
    title: "ثبات يدوم",
    body: "عطور بتركيز عالٍ تمنحك حضورًا يرافقك طوال اليوم.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        title="من نحن"
        subtitle={siteConfig.tagline}
        image={siteConfig.images.about}
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
          <div className="grid gap-8 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="mx-auto mb-4 h-px w-12 bg-gold" />
                <h3 className="font-heading text-xl font-semibold">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
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
