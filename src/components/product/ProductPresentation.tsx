"use client";
import {ShareProduct} from "./ShareProduct";
import {useStickyPurchase} from "./useStickyPurchase";
import {useEffect,useState} from "react";
import Link from "next/link";
import type {Product} from "@/lib/types";
import {selectVariant} from "@/lib/variants";
import {getPriceInfo,getBadges} from "@/lib/product-helpers";
import {productUi as ui} from "@/config/product";
import {siteConfig} from "@/config/site";
import {ProductGallery} from "./ProductGallery";
import {AddToCartButton} from "./AddToCartButton";
import {Countdown} from "./Countdown";
export function ProductPresentation({product,initialVariant}: {product:Product;initialVariant?:string}) {
 const {anchor,visible}=useStickyPurchase();
 const first=product.variants?.find(v=>v.id===initialVariant)?.id||product.variants?.find(v=>v.stock>0)?.id||product.variants?.[0]?.id;
 const [variant,setVariant]=useState(first);
 const [quantity,setQuantity]=useState(1);
 useEffect(()=>{const restore=()=>{const id=new URLSearchParams(location.search).get('variant');setVariant(product.variants?.find(v=>v.id===id)?.id||first);setQuantity(1);};window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore);},[product.variants,first]);
 const selected=selectVariant(product,variant),price=getPriceInfo(selected);
 const images=selected.gallery?.length?selected.gallery:[selected.image];
 const facts=[{label:ui.concentration,value:product.concentration},{label:ui.size,value:selected.size},{label:ui.origin,value:product.origin},{label:ui.usage,value:product.usage},{label:ui.care,value:product.care}].filter(row=>row.value);
 function choose(id:string){setVariant(id);setQuantity(1);const url=new URL(location.href);url.searchParams.set('variant',id);history.replaceState(null,'',url);}
 return <div className="grid gap-10 lg:grid-cols-2"><ProductGallery key={selected.id} images={images} alt={selected.name}/><div>
  {product.category&&<Link className="text-sm text-gold" href={`/perfumes/${encodeURIComponent(product.category)}`}>{product.category}</Link>}
  <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">{product.name}</h1>
  <div className="mt-4 flex flex-wrap gap-2">{getBadges(selected).slice(0,2).map(b=><span className="rounded-full bg-foreground px-3 py-1 text-xs text-background" key={b.label}>{b.label}</span>)}</div>
  <div className="mt-5 flex items-baseline gap-3" aria-live="polite"><strong className="text-3xl">{price.price} {siteConfig.currency}</strong>{price.original&&<del className="text-muted">{price.original} {siteConfig.currency}</del>}</div>
  {selected.unitPrice && selected.unitPrice.quantity>0 && selected.unitPrice.referenceQuantity>0 && <p className="mt-2 text-sm text-muted">{(price.price/selected.unitPrice.quantity*selected.unitPrice.referenceQuantity).toLocaleString("ar-SA",{maximumFractionDigits:2})} {siteConfig.currency} / {selected.unitPrice.referenceQuantity} {selected.unitPrice.unit}</p>}
  {price.endsAt&&<Countdown endsAt={price.endsAt}/>}
  {!!product.variants?.length&&<fieldset className="mt-6"><legend className="mb-3 font-semibold">{ui.choose}</legend><div className="flex flex-wrap gap-2">{product.variants.map(v=><button key={v.id} onClick={()=>choose(v.id)} aria-pressed={variant===v.id} className={`min-h-11 rounded-full border px-4 py-2 text-sm ${variant===v.id?'border-gold bg-gold text-white':'border-border'}`}>{v.label}{v.stock<=0?` — ${ui.unavailable}`:''}</button>)}</div></fieldset>}
  <p className="mt-4 text-sm" role="status">{selected.stock>0?ui.available:ui.unavailable}</p>
  <p className="mt-6 leading-relaxed text-muted">{product.description}</p>
  {!!facts.length&&<section className="mt-6 rounded-2xl bg-surface p-5"><h2 className="font-heading text-xl">{ui.facts}</h2><dl>{facts.map(row=><div className="mt-3 flex flex-wrap justify-between gap-3" key={row.label}><dt className="text-sm text-muted">{row.label}</dt><dd className="text-sm">{row.value}</dd></div>)}</dl></section>}
  <div ref={anchor} className="mt-6 flex items-end gap-4"><label className="grid gap-2 text-sm">{ui.quantity}<input type="number" min={1} max={Math.max(1,selected.stock)} disabled={selected.stock<=0} value={quantity} onChange={e=>setQuantity(Math.max(1,Math.min(selected.stock,Math.floor(Number(e.target.value))||1)))} className="min-h-12 w-20 rounded-xl border border-border p-3"/></label><div className="flex-1"><AddToCartButton product={selected} quantity={quantity}/></div></div>
  <Link className="mt-5 inline-block py-2 text-sm text-gold underline" href={ui.shippingHref}>{ui.shipping}</Link>
  <ShareProduct title={product.name}/>
  {visible&&<div className="sticky-buy"><strong>{price.price} {siteConfig.currency}</strong><AddToCartButton product={selected} quantity={quantity}/></div>}
 </div></div>;
}
