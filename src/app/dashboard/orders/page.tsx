import { getOrders } from "@/lib/admin";
import { siteConfig } from "@/config/site";
import { OrderStatusSelect } from "@/components/dashboard/OrderStatusSelect";

export const dynamic = "force-dynamic";

const statusColor: Record<string, string> = {
  "جديد": "bg-blue-100 text-blue-700",
  "قيد التنفيذ": "bg-amber-100 text-amber-700",
  "تم التسليم": "bg-green-100 text-green-700",
};

export default async function DashboardOrders() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">الطلبات</h1>

      {orders.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface p-8 text-center text-muted">
          لا توجد طلبات بعد.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-lg border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{o.order_ref}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        statusColor[o.status] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {new Date(o.created_at).toLocaleString("ar-SA")}
                  </div>
                </div>
                <OrderStatusSelect orderId={o.id} status={o.status} />
              </div>

              <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <div className="font-medium">بيانات العميل</div>
                  <div className="mt-1 text-muted">{o.customer_name}</div>
                  <div className="text-muted">{o.customer_phone}</div>
                  <div className="text-muted">{o.customer_address}</div>
                </div>
                <div>
                  <div className="font-medium">المنتجات</div>
                  <ul className="mt-1 space-y-1 text-muted">
                    {o.items.map((it, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{it.name} × {it.quantity}</span>
                        <span>{it.price * it.quantity} {siteConfig.currency}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex justify-between border-t border-border pt-2 font-bold">
                    <span>الإجمالي</span>
                    <span>{o.total} {siteConfig.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
