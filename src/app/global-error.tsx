"use client";
import {stateUi as ui} from "@/config/states";
export default function GlobalError({reset}:{error:Error;reset:()=>void}){return <html lang="ar" dir="rtl"><body style={{fontFamily:"sans-serif",padding:"40px",lineHeight:1.8}}><h1>{ui.error}</h1><p>{ui.errorHelp}</p><button onClick={reset} style={{padding:"12px 24px",borderRadius:"24px"}}>{ui.retry}</button></body></html>;}
