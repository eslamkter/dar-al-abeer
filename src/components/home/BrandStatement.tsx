"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT =
  "كل عطر لدينا حكاية تُروى بالرائحة — نختار الخامة، ونصوغ التركيبة، لتترك أثرًا لا يُنسى.";

/** بيان العلامة: كشف الكلمات تدريجيًا مع التمرير (GSAP ScrollTrigger). */
export function BrandStatement() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLElement>(".word");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 30%",
            scrub: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-background py-24">
      <Container>
        <span className="eyebrow block text-center">فلسفتنا</span>
        <p
          ref={ref}
          className="mx-auto mt-6 max-w-3xl text-center font-heading text-2xl leading-relaxed sm:text-3xl"
        >
          {STATEMENT.split(" ").map((w, i) => (
            <span key={i} className="word inline-block" style={{ opacity: 1 }}>
              {w}&nbsp;
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
