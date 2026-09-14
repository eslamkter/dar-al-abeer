"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

// صورة تمثيلية لكل تصنيف (fallback = عود).
const catImage: Record<string, string> = {
  "عطور شرقية": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
  "عطور زهرية": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&q=80",
  "عطور منعشة": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
  "عطور يومية": "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80",
  "عود": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80",
  "مسك": "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80",
};
const fallback = "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80";

/** أول عنصر بلاطة كبيرة (2×2) على الشاشات المتوسطة فأكبر — نسيج تحريري بدل شبكة متساوية. */
function tileSize(i: number) {
  return i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1";
}

export function CategoryTiles({ categories }: { categories: string[] }) {
  const reduceMotion = useReducedMotion();
  if (categories.length === 0) return null;

  return (
    <Container className="py-16">
      <Reveal>
        <div className="mb-8 text-center">
          <span className="eyebrow">تصفّح حسب</span>
          <h2 className="mt-2 font-heading text-3xl font-bold">التصنيفات</h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[160px]">
        {categories.map((c, i) => (
          <Reveal key={c} delay={Math.min(i * 0.05, 0.25)} className={`aspect-square md:aspect-auto ${tileSize(i)}`}>
            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
              className="h-full"
            >
              <Link
                href={`/products?category=${encodeURIComponent(c)}`}
                className="group relative flex h-full items-center justify-center overflow-hidden rounded-xl border border-border"
              >
                <Image
                  src={catImage[c] ?? fallback}
                  alt={c}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-foreground/45 transition-colors group-hover:bg-foreground/25" />
                <span
                  className={`relative z-10 text-center font-heading font-bold text-white drop-shadow ${
                    i === 0 ? "text-xl sm:text-2xl" : "text-sm"
                  }`}
                >
                  {c}
                </span>
              </Link>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
