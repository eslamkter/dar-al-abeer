"use client";
import {useState} from "react";
import Link from "next/link";
import type {Product} from "@/lib/types";
import {navigationUi as ui} from "@/config/navigation";
import {siteConfig} from "@/config/site";
import {discoveryValues,discoveryPath} from "@/lib/discovery";
const normalize=(v:string)=>v.normalize("NFKD").replace(/[\u064B-\u065F\u0670]/g,"").replace(/[أإآ]/g,"ا").toLowerCase();
function Highlight({text,query}:{text:string;query:string}){const normalized=normalize(text),index=normalized.indexOf(normalize(query.trim()));if(index<0)return text;const positions:number[]=[];let offset=0;for(const c of text){for(const part of normalize(c)){if(part)positions.push(offset);}offset+=c.length;}const start=positions[index]??0,end=(positions[index+normalize(query.trim()).length-1]??start)+1;return <>{text.slice(0,start)}<mark className="rounded bg-gold/15 text-inherit">{text.slice(start,end)}</mark>{text.slice(end)}</>;}
export function SearchSuggestions({products,drawer=false,onNavigate}:{products:Product[];drawer?:boolean;onNavigate?:()=>void}){
 const [query,setQuery]=useState(""),[open,setOpen]=useState(false),q=normalize(query).trim();
 const brand=(p:Product)=>p.brand||siteConfig.name;
 const matches=q?products.filter(p=>normalize(`${p.name} ${brand(p)} ${p.category??""} ${discoveryValues(p,"notes").join(" ")}`).includes(q)).slice(0,4):[];
 const groups=[{title:ui.products,items:matches.map(p=>({label:p.name,href:`/products/${p.slug}`}))},{title:ui.notes,items:[...new Set(products.flatMap(p=>discoveryValues(p,"notes")))].filter(v=>q&&normalize(v).includes(q)).slice(0,3).map(value=>({label:value,href:discoveryPath("notes",value)}))},{title:ui.categories,items:[...new Set(products.map(p=>p.category).filter((v):v is string=>!!v))].filter(v=>q&&normalize(v).includes(q)).slice(0,3).map(value=>({label:value,href:discoveryPath("perfumes",value)}))},{title:ui.brands,items:[...new Set(products.map(brand))].filter(v=>q&&normalize(v).includes(q)).slice(0,3).map(value=>({label:value,href:`/products?brand=${encodeURIComponent(value)}`}))}];
 const navigate=()=>{setOpen(false);onNavigate?.();};
 return <div className={drawer?"relative my-6":"relative hidden sm:block"} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}} onKeyDown={e=>{if(e.key==="Escape")setOpen(false);}}><form method="get" action="/products"><input type="search" name="q" value={query} onFocus={()=>setOpen(true)} onChange={e=>{setQuery(e.target.value);setOpen(true);}} placeholder={ui.search} aria-label={ui.search} className={`min-h-11 rounded-full border border-border bg-background px-4 py-2 text-sm ${drawer?"w-full":"w-28 lg:w-40"}`} autoComplete="off"/></form>{open&&q&&<div className={`${drawer?"relative w-full":"absolute left-0 top-full w-[min(360px,90vw)]"} z-50 mt-2 max-h-[65dvh] overflow-auto rounded-2xl border border-border bg-surface p-4 shadow-xl`}>
 {groups.filter(g=>g.items.length).map(group=><section key={group.title}><h2 className="mt-3 mb-1 text-sm font-semibold">{group.title}</h2>{group.items.map(item=><Link key={item.href} className="block rounded-xl px-2 py-3 text-sm hover:bg-background" href={item.href} onClick={navigate}><Highlight text={item.label} query={query}/></Link>)}</section>)}
 {!groups.some(g=>g.items.length)&&<p role="status" className="py-3 text-sm">{ui.empty}</p>}<Link className="mt-2 block py-3 text-sm underline" href={`/products?q=${encodeURIComponent(query)}`} onClick={navigate}>{ui.showAll}</Link><Link className="block py-3 text-sm underline" href="/scent-finder" onClick={navigate}>{ui.finder}</Link></div>}</div>;
}
