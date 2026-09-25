"use client";
import {useRef,useState} from "react";
import {submitService,ServiceError,type ServiceKind,type ServiceReceipt} from "./service-adapter";
import {serviceMessages,serviceConfig} from "@/config/service-adapter";
export function useServiceSubmission(locale:"ar"|"en"="ar"){
 const [pending,setPending]=useState(false),[receipt,setReceipt]=useState<ServiceReceipt|null>(null),[error,setError]=useState("");
 const busy=useRef(false),request=useRef({body:"",key:""});
 async function submit(kind:ServiceKind,payload:Record<string,unknown>){
  if(busy.current)return null;busy.current=true;setPending(true);setError("");
  const body=JSON.stringify({kind,payload});if(request.current.body!==body)request.current={body,key:`${serviceConfig.mode==="demo"?"DEMO":"REQ"}-${crypto.randomUUID()}`};
  try{const result=await submitService(kind,payload,request.current.key);setReceipt(result);return result;}
  catch(e){const code=e instanceof ServiceError?e.code:"network";setError(serviceMessages.errors[code][locale]);return null;}
  finally{busy.current=false;setPending(false);}
 }
 return {pending,receipt,error,submit};
}
