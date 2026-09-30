"use client";
import { useEffect } from "react";
export function MotionEnhancement() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const observer = new IntersectionObserver((entries) =>
      entries.forEach(
        (e) =>
          ((e.target as HTMLElement).dataset.inView = String(e.isIntersecting)),
      ),
    );
    document
      .querySelectorAll(".hero-art")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}
