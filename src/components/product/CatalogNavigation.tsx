"use client";
import Link from "next/link";
import {useEffect,useState,type ReactNode} from "react";
import {navigationUi as ui} from "@/config/navigation";
const key="dar-al-abeer-catalog-return";
type Position={href:string;top:number};
function read():Position|null{try{const value=JSON.parse(sessionStorage.getItem(key)||"null");if(!value||typeof value.href!=="string"||!Number.isFinite(value.top))return null;const url=new URL(value.href,location.origin);return url.origin===location.origin&&/^\/(products$|notes\/|perfumes\/|occasions\/)/.test(url.pathname)?value:null;}catch{return null;}}
export function CatalogLink({href,children,className}:{href:string;children:ReactNode;className?:string}){return <Link href={href} className={className} onClick={()=>{if(/^\/(products$|notes\/|perfumes\/|occasions\/)/.test(location.pathname)){try{sessionStorage.setItem(key,JSON.stringify({href:location.pathname+location.search,top:scrollY}));}catch{}}}}>{children}</Link>;}
export function BackToResults(){const [position,setPosition]=useState<Position|null>(null);useEffect(()=>{const frame=requestAnimationFrame(()=>setPosition(read()));return()=>cancelAnimationFrame(frame);},[]);if(!position)return null;return <Link href={position.href} className="mb-5 inline-block rounded-full border border-border px-5 py-3 text-sm" onClick={()=>{try{sessionStorage.setItem(key+"-restore","1");}catch{}}}>{ui.back}</Link>;}
export function RestoreBrowsePosition(){useEffect(()=>{const position=read();if(!position)return;try{if(sessionStorage.getItem(key+"-restore")!=="1"||position.href!==location.pathname+location.search)return;sessionStorage.removeItem(key+"-restore");}catch{return;}const frame=requestAnimationFrame(()=>scrollTo({top:Math.max(0,position.top),behavior:"instant"}));return()=>cancelAnimationFrame(frame);},[]);return null;}
