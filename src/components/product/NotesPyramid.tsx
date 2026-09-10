import type { FragranceProfile } from "@/lib/fragrance-notes";
import { Reveal } from "@/components/motion/Reveal";

const tiers = [
  { key: "top", label: "نوتات القمة", hint: "أول ما تشمّه" },
  { key: "heart", label: "نوتات القلب", hint: "روح العطر" },
  { key: "base", label: "نوتات القاعدة", hint: "الأثر الباقي" },
] as const;

/** هرم النوتات: ثلاث طبقات تظهر تدريجيًا مع مؤشر ثبات ومناسبة. */
export function NotesPyramid({ profile }: { profile: FragranceProfile }) {
  return (
    <section className="mt-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow">التركيبة</span>
          <h2 className="mt-2 font-heading text-2xl font-bold">هرم النوتات</h2>
        </div>
        <div className="text-left">
          <div className="text-xs text-muted">قوة الثبات</div>
          <div className="mt-1 flex gap-1" dir="ltr">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-6 rounded-full ${
                  i < profile.intensity ? "bg-gold" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tiers.map((t, i) => (
          <Reveal key={t.key} delay={i * 0.12}>
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="font-heading text-lg font-semibold">
                  {t.label}
                </span>
                <span className="text-xs text-muted">{t.hint}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile[t.key].map((note) => (
                  <span
                    key={note}
                    className="rounded-full border border-gold/40 bg-gold/5 px-4 py-1.5 text-sm text-foreground"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted">
        <span className="text-gold">مناسب لـ</span> {profile.occasion}.
      </p>
    </section>
  );
}
