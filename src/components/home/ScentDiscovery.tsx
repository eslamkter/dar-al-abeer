import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { discoveryConfig, discoveryValues, discoveryPath } from "@/lib/discovery";
import type { Product } from "@/lib/types";
export function ScentDiscovery({products}: {products: Product[]}) {
 return <Container className="py-16"><div className="grid gap-10 md:grid-cols-2">{(["notes","occasions"] as const).map(kind => <section key={kind} className="rounded-3xl border border-border p-6 sm:p-8"><h2 className="font-heading text-3xl">{discoveryConfig[kind].title}</h2><p className="mt-4 text-sm leading-relaxed text-muted">{discoveryConfig[kind].intro}</p><div className="mt-6 flex flex-wrap gap-2">{[...new Set(products.flatMap(p => discoveryValues(p,kind)))].slice(0,8).map(value => <Link key={value} href={discoveryPath(kind,value)} className="rounded-full bg-background px-4 py-3 text-sm hover:text-gold">{value}</Link>)}</div></section>)}</div></Container>;
}
