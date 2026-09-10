import { getCategories } from "@/lib/products";
import { ProductForm } from "@/components/dashboard/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">إضافة منتج جديد</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
