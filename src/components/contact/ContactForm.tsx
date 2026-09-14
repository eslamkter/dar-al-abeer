"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

/**
 * نموذج تواصل يفتح محادثة واتساب مكتوب فيها الرسالة جاهزة.
 * حل عملي للسوق الخليجي بدون الحاجة لخادم بريد.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = `مرحبًا ${siteConfig.name}،\nالاسم: ${name}\n\n${message}`;
    const url = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">الاسم</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2 outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">رسالتك</label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2 outline-none focus:border-gold"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
      >
        إرسال عبر واتساب
      </button>
    </form>
  );
}
