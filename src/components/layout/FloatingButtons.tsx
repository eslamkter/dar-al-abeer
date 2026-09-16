"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useSavedLists } from "@/lib/saved-lists";

/**
 * دوك عائم رأسي أسفل اليسار — لوحة واحدة مدمجة (pill) تجمع كل الأزرار،
 * كل زرار بيتفعّل لوحده من floatingButtons في site.ts. شكل مختلف عمدًا
 * عن دار الأثاث (أزرار منفصلة يمين) وعالم الصغار (speed-dial يمين) —
 * تنويع بنائي حقيقي مش بس لوني.
 */
export function FloatingButtons() {
  const { backToTop, whatsapp, compare, wishlist } = siteConfig.floatingButtons;
  const [showTop, setShowTop] = useState(false);
  const [panel, setPanel] = useState<"wishlist" | "compare" | null>(null);
  const saved = useSavedLists();

  useEffect(() => {
    if (!backToTop) return;
    function onScroll() {
      setShowTop(window.scrollY > 480);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [backToTop]);

  // رقم واتساب حقيقي لازم يكون مُدخل فعليًا — مش فاضي، ومش نمط أصفار
  // متكررة (بديل شائع لرقم وهمي لسه ما اتحطش) — لسه محتاج تشيك فعلي هنا
  // حتى لو التفعيل شغّال من الإعداد، دفاع إضافي.
  const hasRealWhatsapp =
    !!siteConfig.contact.whatsapp && !/0{5,}/.test(siteConfig.contact.whatsapp);
  const showWhatsapp = whatsapp && hasRealWhatsapp;

  if (!backToTop && !showWhatsapp && !compare && !wishlist) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-center gap-1 rounded-full border border-border bg-surface/95 p-2 shadow-xl backdrop-blur">
      {showWhatsapp && (
        <a
          href={`https://wa.me/${siteConfig.contact.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل عبر واتساب"
          className="flex h-11 w-11 items-center justify-center rounded-full text-[#25D366] transition-colors hover:bg-[#25D366]/10"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.4 3.9 3.4.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.5-.6 1.7-1.2.2-.6.2-1 .1-1.2-.1-.1-.3-.2-.5-.3Z" />
          </svg>
        </a>
      )}

      {wishlist && (
        <button
          type="button"
          aria-label="المفضلة"
          onClick={() => setPanel((p) => (p === "wishlist" ? null : "wishlist"))}
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-gold/10 hover:text-gold"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 20.5s-7.5-4.6-9.8-9C.8 8 2 4.5 5.3 3.7c2-.5 3.9.3 5.2 2 .3.4.9.4 1.2 0 1.3-1.7 3.2-2.5 5.2-2 3.3.8 4.5 4.3 3.1 7.8-2.3 4.4-9.8 9-9.8 9Z" strokeLinejoin="round" />
          </svg>
          {saved.wishlist.length > 0 && (
            <span className="absolute -top-1 -left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
              {saved.wishlist.length}
            </span>
          )}
        </button>
      )}

      {compare && (
        <button
          type="button"
          aria-label="المقارنة"
          onClick={() => setPanel((p) => (p === "compare" ? null : "compare"))}
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-gold/10 hover:text-gold"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h13M13 3l4 4-4 4" />
            <path d="M20 17H7m6 4-4-4 4-4" />
          </svg>
          {saved.compare.length > 0 && (
            <span className="absolute -top-1 -left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
              {saved.compare.length}
            </span>
          )}
        </button>
      )}

      {backToTop && showTop && (
        <button
          type="button"
          aria-label="رجوع لأعلى الصفحة"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-gold/10 hover:text-gold"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      )}

      {panel && (
        <div className="absolute bottom-0 left-full ml-3 w-64 rounded-2xl border border-border bg-surface p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {panel === "wishlist" ? "المفضلة" : "المقارنة"}
            </h3>
            <button
              type="button"
              aria-label="إغلاق"
              onClick={() => setPanel(null)}
              className="text-muted hover:text-foreground"
            >
              ×
            </button>
          </div>
          <PanelList
            items={panel === "wishlist" ? saved.wishlist : saved.compare}
            onRemove={panel === "wishlist" ? saved.toggleWishlist : saved.toggleCompare}
          />
        </div>
      )}
    </div>
  );
}

function PanelList({
  items,
  onRemove,
}: {
  items: { slug: string; name: string; price: number; image: string }[];
  onRemove: (item: { slug: string; name: string; price: number; image: string }) => void;
}) {
  if (items.length === 0) {
    return <p className="py-4 text-center text-sm text-muted">لسه مفيش عناصر مضافة.</p>;
  }
  return (
    <ul className="max-h-64 space-y-2 overflow-y-auto">
      {items.map((item) => (
        <li key={item.slug} className="flex items-center gap-2">
          <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-background">
            <Image src={item.image} alt="" fill sizes="40px" className="object-cover" />
          </span>
          <Link
            href={`/products/${item.slug}`}
            className="min-w-0 flex-1 truncate text-xs font-medium hover:text-gold"
          >
            {item.name}
          </Link>
          <button
            type="button"
            aria-label="إزالة"
            onClick={() => onRemove(item)}
            className="text-muted hover:text-foreground"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
