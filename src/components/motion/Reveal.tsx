"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * ظهور ناعم (رفع + تلاشٍ) — يعتمد على IntersectionObserver + CSS.
 * يفشل بأمان: لو أي شيء تعطّل، المحتوى يظهر بدل ما يختفي.
 * immediate = يظهر عند التحميل مباشرة (للبطل فوق الطية).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    if (immediate) {
      const t = setTimeout(() => setShown(true), 30);
      return () => clearTimeout(t);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);

    // صمّام أمان: لو الـ observer ما اشتغلش (متصفحات/حالات نادرة)، أظهر المحتوى.
    const fallback = setTimeout(() => setShown(true), 1600);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [immediate]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(18px)",
        transition: `opacity .6s ease ${delay}s, transform .6s cubic-bezier(.2,.7,.2,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
