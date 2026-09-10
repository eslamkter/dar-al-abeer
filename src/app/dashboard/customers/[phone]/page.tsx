import Link from "next/link";
import { getCustomerOrders, getCustomerNotes } from "@/lib/admin";
import { siteConfig } from "@/config/site";
import { AddNoteForm } from "@/components/dashboard/AddNoteForm";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: PageProps<"/dashboard/customers/[phone]">) {
  const { phone: raw } = await params;
  const phone = decodeURIComponent(raw);

  const [orders, notes] = await Promise.all([
    getCustomerOrders(phone),
    getCustomerNotes(phone),
  ]);

  const name = orders[0]?.customer_name ?? phone;
  const totalSpent = orders.reduce((s, o) => s + Number(o.total), 0);

  return (
    <div>
      <Link href="/dashboard/customers" className="text-sm text-gold hover:underline">
        ← العملاء
      </Link>

      <h1 className="mt-3 mb-1 font-heading text-2xl font-bold">{name}</h1>
      <p className="text-muted">{phone}</p>
      <p className="mt-1 text-sm text-muted">
        {orders.length} طلب — إجمالي {totalSpent} {siteConfig.currency}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* الطلبات السابقة */}
        <section>
          <h2 className="mb-3 font-heading text-lg font-bold">الطلبات السابقة</h2>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="rounded-lg border border-border bg-surface p-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-bold">{o.order_ref}</span>
                  <span className="text-muted">{o.status}</span>
                </div>
                <div className="mt-1 text-muted">
                  {new Date(o.created_at).toLocaleDateString("ar-SA")} — {o.total} {siteConfig.currency}
                </div>
                <ul className="mt-2 text-muted">
                  {o.items.map((it, i) => (
                    <li key={i}>{it.name} × {it.quantity}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* الملاحظات */}
        <section>
          <h2 className="mb-3 font-heading text-lg font-bold">ملاحظات</h2>
          <AddNoteForm phone={phone} />

          <div className="mt-4 space-y-3">
            {notes.length === 0 && (
              <p className="text-sm text-muted">لا توجد ملاحظات بعد.</p>
            )}
            {notes.map((n) => (
              <div key={n.id} className="rounded-lg border border-border bg-surface p-4 text-sm">
                <p>{n.note}</p>
                <p className="mt-2 text-xs text-muted">
                  {new Date(n.created_at).toLocaleString("ar-SA")}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
