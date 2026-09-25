"use client";
import Image, {type ImageProps} from "next/image";
import {useState} from "react";
import {imageUi} from "@/config/image";
export default function ProductImage(props:ImageProps){
 const [failed,setFailed]=useState<string|null>(null);
 const source=typeof props.src==='string'?props.src:JSON.stringify(props.src);
 if(!source||failed===source)return <span role="img" aria-label={props.alt||imageUi.unavailable} className={`flex items-center justify-center bg-surface-2 p-4 text-center text-sm text-muted ${props.fill?'absolute inset-0':'min-h-20'}`}>{imageUi.unavailable}</span>;
 return <Image {...props} alt={props.alt} onError={event=>{setFailed(source);props.onError?.(event);}}/>;
}
