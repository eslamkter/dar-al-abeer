import Link from "next/link";
import {Container} from "@/components/ui/Container";
import {getProducts} from "@/lib/products";
import {discoveryConfig,discoveryValues,discoveryPath} from "@/lib/discovery";
import {pageSeo} from "@/lib/seo";
const kind="notes" as const;
export const metadata={...pageSeo("/"+kind),title:discoveryConfig[kind].title,description:discoveryConfig[kind].intro};
export default async function Page(){const products=await getProducts();const values=[...new Set(products.flatMap(p=>discoveryValues(p,kind)))];return <Container className="py-16"><h1 className="font-heading text-4xl">{discoveryConfig[kind].title}</h1><p className="mt-5 max-w-2xl leading-relaxed text-muted">{discoveryConfig[kind].intro}</p><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{values.map(value=><Link className="rounded-3xl border border-border p-6 text-lg hover:bg-background" key={value} href={discoveryPath(kind,value)}>{value}</Link>)}</div></Container>;}
