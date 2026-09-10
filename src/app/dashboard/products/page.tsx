import Link from "next/link";
import Image from "next/image";
import { getAdminProducts } from "@/lib/admin";
import { siteConfig } from "@/config/site";
import { DeleteProductButton } from "@/components/dashboard/DeleteProductButton";

// نقرأ من القاعدة مباشرة في كل مرة (بدون تخزين مؤقت)
export const dynamic = "force-dynamic";

export default async function DashboardProducts() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">المنتجات</h1>
        <Link
          href="/dashboard/products/new"
          className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
        >
          + إضافة منتج
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-right text-muted">
            <tr>
              <th className="p-3 font-medium">المنتج</th>
              <th className="p-3 font-medium">السعر</th>
              <th className="p-3 font-medium">المخزون</th>
              <th className="p-3 font-medium">التصنيف</th>
              <th className="p-3 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted">
                  لا توجد منتجات بعد.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {p.image && (
                      <div className="relative h-10 w-10 overflow-hidden rounded bg-background">
                        <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                      </div>
                    )}
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="p-3">{p.price} {siteConfig.currency}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 text-muted">{p.category ?? "—"}</td>
                <td className="p-3">
                  <div className="flex gap-4">
                    <Link
                      href={`/dashboard/products/${p.id}/edit`}
                      className="text-sm text-gold hover:underline"
                    >
                      تعديل
                    </Link>
                    <DeleteProductButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
