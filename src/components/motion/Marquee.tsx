/**
 * شريط نصّي متحرك بلا توقف (حركي/kinetic) — لمسة تحريرية فاخرة.
 * حركة CSS خالصة، وبتقف مع تفضيل تقليل الحركة.
 */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee-wrap overflow-hidden border-y border-border bg-surface py-5">
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-heading text-lg text-foreground/70"
          >
            {t}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
      <style>{`
        .marquee-track{animation:marquee 26s linear infinite}
        .marquee-wrap:hover .marquee-track{animation-play-state:paused}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion:reduce){.marquee-track{animation:none}}
      `}</style>
    </div>
  );
}
