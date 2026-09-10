"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function AddNoteForm({ phone }: { phone: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("customer_notes")
      .insert({ customer_phone: phone, note: note.trim() });
    setSaving(false);
    if (error) {
      alert("تعذّر حفظ الملاحظة: " + error.message);
      return;
    }
    setNote("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="اكتب ملاحظة عن العميل..."
        className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:border-gold"
      />
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold-dark disabled:opacity-60"
      >
        {saving ? "جارٍ الحفظ..." : "إضافة ملاحظة"}
      </button>
    </form>
  );
}
