"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["جديد", "قيد التنفيذ", "تم التسليم"];

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState<OrderStatus>(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: OrderStatus) {
    setValue(newStatus);
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    setSaving(false);
    if (error) {
      alert("تعذّر تحديث الحالة: " + error.message);
      setValue(status);
      return;
    }
    router.refresh();
  }

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      className="rounded-md border border-border bg-background px-3 py-1 text-sm outline-none focus:border-gold"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
