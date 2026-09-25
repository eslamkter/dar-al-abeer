"use client";
import {SearchSuggestions} from "./SearchSuggestions";
import type {Product} from "@/lib/types";
import {useRef,useState} from "react";
import Link from "next/link";
import {siteConfig} from "@/config/site";
export function MobileNav({products}:{products:Product[]}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [open,setOpen]=useState(false);
 function close(){dialog.current?.close();setOpen(false);}
 return <div className="md:hidden"><button type="button" aria-label="القائمة" aria-expanded={open} aria-controls="mobile-menu" onClick={()=>{dialog.current?.showModal();setOpen(true);}} className="flex h-11 w-11 items-center justify-center rounded-full border border-border"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
 <dialog ref={dialog} id="mobile-menu" className="store-menu" aria-label="القائمة" onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close();}}><div className="p-6"><div className="flex items-center justify-between"><span className="font-heading text-xl">{siteConfig.name}</span><button type="button" onClick={close} className="min-h-11 rounded-full border border-border px-4">إغلاق</button></div><SearchSuggestions products={products} drawer onNavigate={close}/><nav className="grid gap-2">{siteConfig.nav.map(item=><Link key={item.href} href={item.href} onClick={close} className="rounded-xl px-4 py-3 hover:bg-background">{item.label}</Link>)}<Link href="/wishlist" onClick={close} className="rounded-xl px-4 py-3">{siteConfig.savedLists.title}</Link><Link href="/scent-finder" onClick={close} className="rounded-xl px-4 py-3">اعثر على عطرك</Link></nav></div></dialog></div>;
}
