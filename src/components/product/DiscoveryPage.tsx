import {RestoreBrowsePosition} from "./CatalogNavigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import { discoveryValues, discoveryPath, discoveryConfig, type DiscoveryKind } from "@/lib/discovery";
import { pageSeo } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "./ProductGrid";
export async function discoveryMetadata(kind: DiscoveryKind, value: string) {
 return {...pageSeo(discoveryPath(kind,value)),title:value,description:`${value} — ${discoveryConfig[kind].intro}`};
}
export async function DiscoveryPage({kind,value}: {kind: DiscoveryKind; value: string}) {
 const all = await getProducts();
 const products = all.filter(p => discoveryValues(p,kind).includes(value));
 if (!products.length) notFound();
 const alternatives = [...new Set(all.flatMap(p => discoveryValues(p,kind)))].filter(v => v !== value);
 return <><RestoreBrowsePosition/><Container className="py-14"><nav className="mb-8 text-sm text-muted"><Link href="/">الرئيسية</Link> / <Link href="/products">المتجر</Link> / {value}</nav><span className="eyebrow">{discoveryConfig[kind].title}</span><h1 className="mt-3 font-heading text-4xl">{value}</h1><p className="mt-4 max-w-2xl leading-relaxed text-muted">{discoveryConfig[kind].intro}</p><div className="my-10"><ProductGrid products={products} /></div><section><h2 className="font-heading text-2xl">{discoveryConfig[kind].title}</h2><div className="mt-5 flex flex-wrap gap-3">{alternatives.map(v => <Link className="rounded-full border border-border px-5 py-3 text-sm" key={v} href={discoveryPath(kind,v)}>{v}</Link>)}</div></section></Container></>;
}
