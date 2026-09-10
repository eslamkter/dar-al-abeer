"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("متأكد من حذف المنتج؟")) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("تعذّر الحذف: " + error.message);
      setDeleting(false);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm text-muted hover:text-red-600 disabled:opacity-50"
    >
      {deleting ? "..." : "حذف"}
    </button>
  );
}
