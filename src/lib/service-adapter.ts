import {serviceConfig} from "../config/service-adapter";
export type ServiceKind="contact"|"newsletter"|"order";
export type ServiceReceipt={id:string;kind:ServiceKind;createdAt:string;demo:boolean;status:"received";payload:Record<string,unknown>};
export class ServiceError extends Error {constructor(public code:"validation"|"storage"|"network"|"configuration"|"response"){super(code);}}
export function readDemoReceipts():ServiceReceipt[]{
 const raw=sessionStorage.getItem(serviceConfig.storageKey);
 if(!raw)return [];
 const value:unknown=JSON.parse(raw);
 if(!Array.isArray(value))return [];
 return value.filter((v):v is ServiceReceipt=>!!v&&typeof v==="object"&&typeof v.id==="string"&&typeof v.createdAt==="string"&&["contact","newsletter","order"].includes(v.kind)&&v.demo===true&&v.payload&&typeof v.payload==="object").slice(0,50);
}
export function validateSubmission(kind:ServiceKind,payload:Record<string,unknown>){
 const field=(key:string)=>typeof payload[key]==="string"?String(payload[key]).trim():"";
 if(kind==="newsletter"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field("email")))throw new ServiceError("validation");
 if(kind==="contact"&&(!field("name")||field("message").length<5||(field("email")&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field("email")))))throw new ServiceError("validation");
 if(kind==="order"){
  if(!field("name")||!/^[0-9]{8,15}$/.test(field("phone").replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[+ ()-]/g,""))||!Array.isArray(payload.items)||!payload.items.length)throw new ServiceError("validation");
  for(const line of payload.items){if(!line||typeof line!=="object"||typeof line.productId!=="string"||!Number.isSafeInteger(line.quantity)||line.quantity<1)throw new ServiceError("validation");}
 }
}
export async function submitService(kind:ServiceKind,payload:Record<string,unknown>,idempotencyKey:string):Promise<ServiceReceipt>{
 validateSubmission(kind,payload);
 if(serviceConfig.mode==="demo"){
  await new Promise(resolve=>setTimeout(resolve,250));
  try{
   const saved=readDemoReceipts();const existing=saved.find(r=>r.id===idempotencyKey);if(existing)return existing;
   const receipt:ServiceReceipt={id:idempotencyKey,kind,createdAt:new Date().toISOString(),demo:true,status:"received",payload};
   sessionStorage.setItem(serviceConfig.storageKey,JSON.stringify([receipt,...saved].slice(0,50)));
   return receipt;
  }catch{throw new ServiceError("storage");}
 }
 if(!serviceConfig.baseUrl)throw new ServiceError("configuration");
 const url=new URL(serviceConfig.baseUrl.replace(/\/$/,"")+serviceConfig.paths[kind],location.origin);
 if(url.origin!==location.origin)throw new ServiceError("configuration");
 // Prices are display data, never client authority for live order creation.
 const body=kind==="order"?{...payload,items:(payload.items as Record<string,unknown>[]).map(l=>({productId:l.productId,variantId:l.variantId,quantity:l.quantity,...(typeof l.swatch==="string"?{options:{swatch:l.swatch}}:{})})),shipping:undefined,total:undefined}:payload;
 const csrf=document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
 let response:Response;
 try{response=await fetch(url,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","Accept":"application/json","Idempotency-Key":idempotencyKey,...(csrf?{"X-CSRF-TOKEN":csrf}:{})},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});}catch{throw new ServiceError("network");}
 if(!response.ok)throw new ServiceError(response.status===422?"validation":"network");
 let data:unknown;try{data=await response.json();}catch{throw new ServiceError("response");}
 if(!data||typeof data!=="object"||!("id" in data)||typeof data.id!=="string")throw new ServiceError("response");
 return {id:data.id,kind,createdAt:new Date().toISOString(),demo:false,status:"received",payload};
}
