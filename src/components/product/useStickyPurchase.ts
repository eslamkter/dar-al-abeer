"use client";
import {useEffect,useRef,useState} from "react";
export function useStickyPurchase(){const anchor=useRef<HTMLDivElement>(null);const [visible,setVisible]=useState(false);useEffect(()=>{const node=anchor.current;if(!node||node.closest("dialog"))return;const observer=new IntersectionObserver(([entry])=>setVisible(!entry.isIntersecting&&entry.boundingClientRect.bottom<0),{threshold:0});observer.observe(node);return()=>observer.disconnect();},[]);return {anchor,visible};}
