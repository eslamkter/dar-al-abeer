const badges = [
  { title: "أصالة مضمونة", sub: "منتج أصلي 100%" },
  { title: "دفع عند الاستلام", sub: "ادفع وقت التسليم" },
  { title: "شحن لكل الخليج", sub: "توصيل سريع وآمن" },
];

/** شريط مؤشرات ثقة أسفل بيانات المنتج. */
export function TrustBadges() {
  return (
    <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6">
      {badges.map((b) => (
        <div key={b.title} className="text-center">
          <div className="text-sm font-semibold text-foreground">{b.title}</div>
          <div className="mt-0.5 text-xs text-muted">{b.sub}</div>
        </div>
      ))}
    </div>
  );
}
