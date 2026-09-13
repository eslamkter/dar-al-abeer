import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/config/site";

/** بطل الصفحة الرئيسية: صورة بتكبير بطيء + ظهور متدرّج للنص. */
export function HomeHero() {
  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden">
      <div className="hero-zoom absolute inset-0">
        <Image
          src={siteConfig.images.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-l from-foreground/55 via-foreground/35 to-foreground/10" />

      <Container className="relative z-10 py-24 text-white">
        <div className="max-w-xl">
          <Reveal immediate>
            <span className="eyebrow block text-gold">{siteConfig.name}</span>
          </Reveal>
          <Reveal immediate delay={0.12}>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight drop-shadow sm:text-6xl">
              {siteConfig.tagline}
            </h1>
          </Reveal>
          <Reveal immediate delay={0.24}>
            <p className="mt-5 max-w-md text-lg font-light text-white/85">
              {siteConfig.description}
            </p>
          </Reveal>
          <Reveal immediate delay={0.36}>
            <Link
              href="/products"
              className="mt-9 inline-block rounded-full bg-gold px-9 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
            >
              تصفّح المتجر
            </Link>
          </Reveal>
        </div>
      </Container>

      <style>{`
        .hero-zoom{animation:heroZoom 18s ease-out forwards}
        @keyframes heroZoom{from{transform:scale(1)}to{transform:scale(1.08)}}
        @media (prefers-reduced-motion:reduce){.hero-zoom{animation:none}}
      `}</style>
    </section>
  );
}
