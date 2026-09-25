"use client";
import Link from "next/link";
import {useSavedLists} from "@/lib/saved-lists";
import type {Product} from "@/lib/types";
import {siteConfig} from "@/config/site";
export function Wishlist({products}:{products:Product[]}){
 const {wishlist,toggleWishlist}=useSavedLists();
 const entries=wishlist.map(saved=>({saved,product:products.find(p=>p.slug===saved.slug)}));
 return <><h1 className="font-heading text-3xl">{siteConfig.savedLists.title}</h1>{!entries.length&&<p className="my-8 text-muted">{siteConfig.savedLists.empty}</p>}<ul className="my-8 grid gap-4 sm:grid-cols-2">{entries.map(({saved,product})=><li key={saved.slug} className="rounded-3xl border border-border bg-surface p-6">{product?<><Link href={`/products/${product.slug}`} className="font-heading text-xl underline">{product.name}</Link><p className="mt-3">{product.stock>0?siteConfig.savedLists.available:siteConfig.savedLists.unavailable}</p></>:<p>{siteConfig.savedLists.removed}</p>}<button type="button" onClick={()=>toggleWishlist(saved)} className="mt-5 min-h-11 rounded-full border border-border px-5 py-3">{siteConfig.savedLists.remove}</button></li>)}</ul><Link href="/products" className="inline-block rounded-full bg-foreground px-6 py-3 text-background">{siteConfig.savedLists.shop}</Link></>;
}
