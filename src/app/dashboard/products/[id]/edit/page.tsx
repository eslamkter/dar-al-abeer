import { notFound } from "next/navigation";
import { getAdminProductById } from "@/lib/admin";
import { getCategories } from "@/lib/products";
import { ProductForm } from "@/components/dashboard/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: PageProps<"/dashboard/products/[id]/edit">) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getCategories(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">تعديل المنتج</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
