import Link from "next/link";
import { getCustomers } from "@/lib/admin";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function DashboardCustomers() {
  const customers = await getCustomers();

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">العملاء</h1>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-right text-muted">
            <tr>
              <th className="p-3 font-medium">الاسم</th>
              <th className="p-3 font-medium">الهاتف</th>
              <th className="p-3 font-medium">عدد الطلبات</th>
              <th className="p-3 font-medium">إجمالي الإنفاق</th>
              <th className="p-3 font-medium">آخر طلب</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted">
                  لا يوجد عملاء بعد.
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.phone} className="border-b border-border last:border-0 hover:bg-background">
                <td className="p-3">
                  <Link
                    href={`/dashboard/customers/${encodeURIComponent(c.phone)}`}
                    className="font-medium text-gold hover:underline"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="p-3 text-muted">{c.phone}</td>
                <td className="p-3">{c.ordersCount}</td>
                <td className="p-3">{c.totalSpent} {siteConfig.currency}</td>
                <td className="p-3 text-muted">
                  {new Date(c.lastOrderAt).toLocaleDateString("ar-SA")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
