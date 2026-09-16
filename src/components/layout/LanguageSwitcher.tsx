"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

/**
 * مفتاح لغة — تفاعلي وحقيقي بصريًا، لكن التبديل الفعلي للمحتوى لسه
 * مش موصول (كل محتوى الثيمات عربي فقط حاليًا). نفس منطق "بنية
 * جاهزة، التوصيل لاحقًا" المتبع في بقية المشروع.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const [active, setActive] = useState<(typeof siteConfig.languageSwitcher.options)[number]>(
    siteConfig.languageSwitcher.options[0]
  );
  if (!siteConfig.languageSwitcher.enabled) return null;

  return (
    <div className={`flex items-center gap-0.5 rounded-full border border-border p-0.5 text-[11px] font-semibold ${className}`}>
      {siteConfig.languageSwitcher.options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => setActive(opt)}
          aria-pressed={active === opt}
          className={`rounded-full px-2 py-0.5 transition-colors ${
            active === opt ? "bg-gold text-white" : "text-muted hover:text-gold"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
