import type { Product } from "./types";
export function selectVariant(product: Product, id?: string): Product {
 if (!product.variants?.length) return product;
 const variant=product.variants.find(v=>v.id===id);
 if(!variant || !Number.isFinite(variant.price) || variant.price<0 || !Number.isInteger(variant.stock) || variant.stock<0) throw new Error("Choose a valid product option");
 return {...product,unitPrice:variant.unitPrice,productId:product.id,selectedVariantId:variant.id,id:`${product.id}::${variant.id}`,name:`${product.name} — ${variant.label}`,price:variant.price,stock:variant.stock,image:variant.image||product.image,gallery:variant.gallery||(variant.image?[variant.image]:product.gallery)||[product.image],sale_price:null,discount_start:null,discount_end:null,size:variant.label};
}
