import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * قسم بطل (Hero) بصورة خلفية كبيرة وتدرّج غامق فوقها.
 * قابل لإعادة الاستخدام في أي صفحة.
 *
 * ambient: تدرّج ناعم بلون foreground (بدل أسود خام) + تكبير بطيء للصورة،
 * بنفس معالجة HomeHero. اختياري كي لا يتغيّر شكل الصفحات الأخرى.
 */
export function Hero({
  title,
  subtitle,
  image,
  children,
  ambient = false,
}: {
  title: string;
  subtitle?: string;
  image: string;
  children?: ReactNode;
  ambient?: boolean;
}) {
  return (
    <section className="relative flex min-h-[340px] items-center justify-center overflow-hidden sm:min-h-[420px]">
      <div className={ambient ? "hero-zoom absolute inset-0" : "absolute inset-0"}>
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {/* طبقة تعتيم لإبراز النص فوق الصورة مهما كانت */}
      <div
        className={
          ambient
            ? "absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/35 to-foreground/15"
            : "absolute inset-0 bg-black/55"
        }
      />
      {ambient && (
        <style>{`
          .hero-zoom{animation:heroZoom 18s ease-out forwards}
          @keyframes heroZoom{from{transform:scale(1)}to{transform:scale(1.08)}}
          @media (prefers-reduced-motion:reduce){.hero-zoom{animation:none}}
        `}</style>
      )}

      <Container className="relative z-10 text-center text-white">
        <Reveal immediate>
          <h1 className="font-heading text-4xl font-bold drop-shadow sm:text-5xl">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal immediate delay={0.12}>
            <p className="mx-auto mt-3 max-w-xl text-white/85">{subtitle}</p>
          </Reveal>
        )}
        {children && (
          <Reveal immediate delay={0.22}>
            <div className="mt-6">{children}</div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
