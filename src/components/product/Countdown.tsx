"use client";

import { useEffect, useState } from "react";

/** عدّاد تنازلي لنهاية العرض — محفّز FOMO. */
export function Countdown({ endsAt }: { endsAt: string }) {
  const [left, setLeft] = useState<number>(() =>
    Math.max(0, new Date(endsAt).getTime() - Date.now())
  );

  useEffect(() => {
    const id = setInterval(() => {
      setLeft(Math.max(0, new Date(endsAt).getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (left <= 0) return null;

  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);

  const box = (n: number, label: string) => (
    <div className="flex flex-col items-center rounded-md bg-foreground px-2.5 py-1 text-background">
      <span className="font-mono text-base font-bold tabular-nums">
        {String(n).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-background/70">{label}</span>
    </div>
  );

  return (
    <div className="mt-4 flex items-center gap-3 rounded-lg border border-ember/30 bg-ember/5 p-3">
      <span className="text-sm font-semibold text-ember">ينتهي العرض خلال</span>
      <div className="flex gap-1.5" dir="ltr">
        {d > 0 && box(d, "يوم")}
        {box(h, "ساعة")}
        {box(m, "دقيقة")}
        {box(s, "ثانية")}
      </div>
    </div>
  );
}
