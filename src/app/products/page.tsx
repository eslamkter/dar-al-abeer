import {discoveryUi} from "@/config/discovery";
import {selectVariant} from "@/lib/variants";
import {RestoreBrowsePosition} from "@/components/product/CatalogNavigation";
import {FilterPanel} from "@/components/product/FilterPanel";
import Link from "next/link";
import { discoveryValues } from "@/lib/discovery";
import { pageSeo } from "@/lib/seo";
import type { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/products";
import { getPriceInfo, hasActiveDiscount, isNewArrival } from "@/lib/product-helpers";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/ui/Hero";
import { siteConfig } from "@/config/site";
import type { Product } from "@/lib/types";

export async function generateMetadata({searchParams}:{searchParams:Promise<SP>}):Promise<Metadata>{const sp=await searchParams;const page=Math.max(1,Math.floor(Number(s(sp.page)))||1);const filtered=Object.keys(sp).some(k=>k!=="page"&&s(sp[k]));return {...pageSeo(`/products${page>1?`?page=${page}`:""}`,filtered),title:page>1?`المتجر — ${page}`:"المتجر",description:"تصفح تشكيلتنا من العطور الفاخرة."};}

const GENDERS = ["رجالي", "نسائي", "للجنسين"];

type SP = { [k: string]: string | string[] | undefined };
const s = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

function applyFilters(products: Product[], sp: SP): Product[] {
  const normalize=(v:string)=>v.normalize("NFKD").replace(/[\u064B-\u065F]/g,"").replace(/[أإآ]/g,"ا").toLocaleLowerCase().trim();
  const q = normalize(s(sp.q));
  const gender = s(sp.gender);
  const category = s(sp.category);
  const sort = s(sp.sort);
  const offersOnly = s(sp.offers) === "1";

  let list = products.flatMap(base => {
    const options=base.variants?.length?base.variants.map(v=>selectVariant(base,v.id)):[base];
    const match=options.find((p) => {
    if (q && !normalize(`${p.name} ${p.brand||siteConfig.name} ${p.shortDescription} ${p.category ?? ""} ${discoveryValues(p,"notes").join(" ")}`).includes(q))
      return false;
    if(s(sp.origin)&&p.origin!==s(sp.origin))return false;
    if(s(sp.usage)&&p.usage!==s(sp.usage))return false;
    if(s(sp.size)&&p.size!==s(sp.size))return false;
    if(s(sp.concentration)&&p.concentration!==s(sp.concentration))return false;
    if (s(sp.note) && !discoveryValues(p,"notes").includes(s(sp.note))) return false;
    if (s(sp.occasion) && !discoveryValues(p,"occasions").includes(s(sp.occasion))) return false;
    if (s(sp.stock) === "1" && p.stock <= 0) return false;
    if (s(sp.max) && getPriceInfo(p).price > Math.max(0,Number(s(sp.max)))) return false;
    if (gender && p.gender !== gender) return false;
    if (category && p.category !== category) return false;
    if(s(sp.brand) && (p.brand||siteConfig.name)!==s(sp.brand))return false;
    if (offersOnly && !hasActiveDiscount(p)) return false;
    return true;
    });
    return match?[match]:[];
  });

  if (sort === "price-asc")
    list = [...list].sort((a, b) => getPriceInfo(a).price - getPriceInfo(b).price);
  else if (sort === "price-desc")
    list = [...list].sort((a, b) => getPriceInfo(b).price - getPriceInfo(a).price);
  else if (sort === "bestseller")
    list = [...list].sort((a, b) => Number(b.is_bestseller) - Number(a.is_bestseller));
  else
    list = [...list].sort((a, b) => Number(isNewArrival(b)) - Number(isNewArrival(a)));

  return list;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const [all, categories] = await Promise.all([getProducts(), getCategories()]);
  const products = applyFilters(all, sp);
  const pageSize=12,pageCount=Math.max(1,Math.ceil(products.length/pageSize)),page=Math.min(pageCount,Math.max(1,Math.floor(Number(s(sp.page)))||1));
  const pageHref=(n:number)=>{const params=new URLSearchParams();Object.entries(sp).forEach(([key,value])=>{if(s(value))params.set(key,s(value));});params.set("page",String(n));return `/products?${params}`;};

  const cur = { origin:s(sp.origin),usage:s(sp.usage),size:s(sp.size), concentration:s(sp.concentration), brand:s(sp.brand), q: s(sp.q), gender: s(sp.gender), category: s(sp.category), sort: s(sp.sort), offers: s(sp.offers), note:s(sp.note), occasion:s(sp.occasion), stock:s(sp.stock), max:s(sp.max) };


  return (
    <><RestoreBrowsePosition/>
      <Hero
        title="المتجر"
        subtitle="تشكيلة مختارة من أرقى العطور الشرقية والعالمية"
        image={siteConfig.images.shop}
        ambient
      />

      <Container className="py-12">
        {/* شريط الفلاتر (GET — يشتغل بدون جافاسكربت) */}
        <FilterPanel><form
          method="get"
          className="mb-8 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {([{name:"origin",label:discoveryUi.origin,values:[...new Set(all.map(p=>p.origin).filter((v):v is string=>!!v))]},{name:"usage",label:discoveryUi.usage,values:[...new Set(all.map(p=>p.usage).filter((v):v is string=>!!v))]},{name:"brand",label:"الماركة",values:[...new Set(all.map(p=>p.brand||siteConfig.name))]},{name:"concentration",label:"التركيز",values:[...new Set(all.map(p=>p.concentration).filter((v):v is string=>!!v))]},{name:"size",label:"الحجم / الوزن",values:[...new Set(all.flatMap(p=>p.variants?.length?p.variants.map(v=>v.label):p.size?[p.size]:[]))]}] as const).filter(f=>f.values.length).map(f=><label key={f.name} className="grid gap-2 text-sm">{f.label}<select name={f.name} defaultValue={cur[f.name]} className="min-h-11 min-w-0 rounded-xl border border-border bg-background px-3 py-2"><option value="">الكل</option>{f.values.map(value=><option key={value}>{value}</option>)}</select></label>)}
          <input
            type="search"
            name="q"
            aria-label="البحث في العطور"
            defaultValue={cur.q}
            placeholder="ابحث عن عطر..."
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm outline-none focus:border-gold lg:col-span-2"
          />
          <select aria-label="الفئة المستهدفة" name="gender" defaultValue={cur.gender} className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold">
            <option value="">كل الأنواع</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select aria-label="التصنيف" name="category" defaultValue={cur.category} className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold">
            <option value="">كل التصنيفات</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select aria-label="الترتيب" name="sort" defaultValue={cur.sort} className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold">
            <option value="">الأحدث</option>
            <option value="price-asc">السعر: الأقل أولًا</option>
            <option value="price-desc">السعر: الأعلى أولًا</option>
            <option value="bestseller">الأكثر مبيعًا</option>
          </select>
          {([{kind:"notes" as const,name:"note",label:"النوتة"},{kind:"occasions" as const,name:"occasion",label:"المناسبة"}]).map(f => <label className="grid gap-2 text-sm" key={f.name}>{f.label}<select name={f.name} defaultValue={f.name === "note" ? cur.note : cur.occasion} className="min-h-11 min-w-0 rounded-xl border border-border bg-background px-3 py-2"><option value="">الكل</option>{[...new Set(all.flatMap(p=>discoveryValues(p,f.kind)))].map(value=><option key={value}>{value}</option>)}</select></label>)}
          <label className="grid gap-2 text-sm">السعر الأقصى (ر.س)<input name="max" type="number" min="0" defaultValue={cur.max} className="min-h-11 min-w-0 rounded-xl border border-border bg-background px-3 py-2"/></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="stock" value="1" defaultChecked={cur.stock === "1"}/>المتوفر فقط</label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="offers" value="1" defaultChecked={cur.offers === "1"} className="accent-gold rounded" />
            العروض فقط
          </label>
          <div className="flex gap-2 lg:col-span-4">
            <button type="submit" className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-white hover:bg-gold-dark">
              تطبيق
            </button>
            <Link href="/products" aria-disabled={!Object.values(cur).some(Boolean)} tabIndex={Object.values(cur).some(Boolean) ? 0 : -1} className={`rounded-full border border-border px-6 py-2 text-sm text-muted hover:border-gold ${Object.values(cur).some(Boolean) ? "" : "pointer-events-none opacity-40"}`}>
              مسح
            </Link>
          </div>
        </form></FilterPanel>

        <div className="mb-5 flex flex-wrap gap-2">{Object.entries(cur).filter(([key,value]) => value && key !== "sort").map(([key,value]) => { const next = new URLSearchParams(Object.entries(cur).filter(([k,v]) => !!v && k !== key)); return <a key={key} aria-label={`إزالة ${key === "offers" ? "العروض" : value}`} href={`/products?${next}`} className="rounded-full border border-border px-4 py-3 text-sm">{key === "offers" ? "العروض" : value} ×</a>; })}</div>
        <p role="status" className="mb-6 text-sm text-muted">{products.length} منتج</p>
        <ProductGrid products={products.slice((page-1)*pageSize,page*pageSize)} />
        {pageCount>1&&<nav aria-label="صفحات المنتجات" className="mt-8 flex flex-wrap gap-3">{Array.from({length:pageCount},(_,i)=>i+1).map(n=><Link key={n} href={pageHref(n)} aria-current={page===n?"page":undefined} className="rounded-full border border-border px-5 py-3">{n}</Link>)}</nav>}
      </Container>
    </>
  );
}
