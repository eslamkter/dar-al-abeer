import Link from "next/link";
import { getOrders, getAdminProducts, getCustomers } from "@/lib/admin";
import { siteConfig } from "@/config/site";

export default async function DashboardHome() {
  const [orders, products, customers] = await Promise.all([
    getOrders(),
    getAdminProducts(),
    getCustomers(),
  ]);

  const newOrders = orders.filter((o) => o.status === "جديد").length;
  const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

  const stats = [
    { label: "طلبات جديدة", value: newOrders, href: "/dashboard/orders" },
    { label: "إجمالي الطلبات", value: orders.length, href: "/dashboard/orders" },
    { label: "المنتجات", value: products.length, href: "/dashboard/products" },
    { label: "العملاء", value: customers.length, href: "/dashboard/customers" },
  ];

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">نظرة عامة</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-lg border border-border bg-surface p-6 transition-shadow hover:shadow-md"
          >
            <div className="text-3xl font-bold text-gold">{s.value}</div>
            <div className="mt-1 text-sm text-muted">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-surface p-6">
        <div className="text-sm text-muted">إجمالي المبيعات</div>
        <div className="mt-1 text-2xl font-bold">
          {revenue} {siteConfig.currency}
        </div>
      </div>
    </div>
  );
}
