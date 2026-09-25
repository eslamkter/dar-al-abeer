"use client";
import {useState} from "react";
import {ProductGrid} from "./ProductGrid";
import {discoveryValues} from "@/lib/discovery";
import {discoveryUi as ui} from "@/config/discovery";
import type {Product} from "@/lib/types";
import {selectVariant} from "@/lib/variants";
import {getPriceInfo} from "@/lib/product-helpers";
export function ScentFinder({products}:{products:Product[]}) {
 const [selection,setSelection]=useState<{note:string;occasion:string;budget:string;intensity:string}|null>(null);
 const results=selection?products.flatMap(base=>{
  const options=base.variants?.length?base.variants.map(v=>selectVariant(base,v.id)):[base];
  const match=options.find(p=>p.stock>0&&(!selection.note||discoveryValues(p,'notes').includes(selection.note))&&(!selection.occasion||discoveryValues(p,'occasions').includes(selection.occasion))&&(!selection.intensity||p.intensity===selection.intensity)&&(!selection.budget||getPriceInfo(p).price<=Number(selection.budget)));
  return match?[match]:[];
 }):[];
 return <><form className="my-8 grid gap-5 rounded-3xl border border-border bg-surface p-6 sm:grid-cols-2" onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);setSelection({note:String(data.get('note')||''),occasion:String(data.get('occasion')||''),budget:String(data.get('budget')||''),intensity:String(data.get('intensity')||'')});}}>
 {[{kind:'notes' as const,name:'note',label:ui.note},{kind:'occasions' as const,name:'occasion',label:ui.occasion}].map(field=><label key={field.name} className="grid gap-3 text-sm">{field.label}<select name={field.name} className="min-h-12 rounded-xl border border-border bg-background px-4"><option value="">{ui.any}</option>{[...new Set(products.flatMap(p=>discoveryValues(p,field.kind)))].map(value=><option key={value}>{value}</option>)}</select></label>)}
 <label className="grid gap-3 text-sm">{ui.budget}<input name="budget" type="number" min="0" step="any" className="min-h-12 min-w-0 rounded-xl border border-border bg-background px-4"/></label>
 <label className="grid gap-3 text-sm">{ui.intensity}<select name="intensity" className="min-h-12 rounded-xl border border-border bg-background px-4"><option value="">{ui.any}</option>{[...new Set(products.map(p=>p.intensity).filter(Boolean))].map(value=><option key={value}>{value}</option>)}</select><span className="text-xs text-muted">{ui.intensityNote}</span></label>
 <button className="rounded-full bg-gold px-6 py-3 text-white">{ui.find}</button><button type="reset" onClick={()=>setSelection(null)} className="rounded-full border border-border px-6 py-3">{ui.reset}</button></form>
 {selection&&<section><h2 className="mb-6 font-heading text-2xl" role="status">{results.length?`${ui.results} (${results.length})`:ui.empty}</h2><ProductGrid products={results}/></section>}</>;
}
