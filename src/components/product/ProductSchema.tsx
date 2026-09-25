import {jsonLd,siteUrl} from "@/lib/seo";
import type {Product} from "@/lib/types";
export function ProductSchema({name,description,images,price,available,path,variants,category}:{name:string;description:string;images:string[];price:number;available:boolean;path:string;variants?:Product["variants"];category?:string}){
 const url=new URL(path,siteUrl).href,offer=(price:number,stock:boolean,url:string)=>({"@type":"Offer",url,priceCurrency:"SAR",price,availability:`https://schema.org/${stock?"InStock":"OutOfStock"}`});
 const product=variants?.length?{"@type":"ProductGroup",name,description,url,productGroupID:path,variesBy:["https://schema.org/size"],hasVariant:variants.map(v=>({"@type":"Product",sku:v.id,name:`${name} — ${v.label}`,description,size:v.label,image:(v.gallery?.length?v.gallery:v.image?[v.image]:images).map(i=>new URL(i,siteUrl).href),offers:offer(v.price,v.stock>0,`${url}?variant=${encodeURIComponent(v.id)}`)}))}:{"@type":"Product",name,description,image:images.map(i=>new URL(i,siteUrl).href),offers:offer(price,available,url)};
 const crumbs=[{name:"الرئيسية",url:siteUrl.href},...(category?[{name:category,url:new URL(`/perfumes/${encodeURIComponent(category)}`,siteUrl).href}]:[]),{name,url}];
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({"@context":"https://schema.org","@graph":[product,{"@type":"BreadcrumbList",itemListElement:crumbs.map((c,i)=>({"@type":"ListItem",position:i+1,name:c.name,item:c.url}))}]})}}/>;
}
