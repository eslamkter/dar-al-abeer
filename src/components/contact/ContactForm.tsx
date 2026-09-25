"use client";

import { useState } from "react";
import {useServiceSubmission} from "@/lib/use-service-submission";
import {serviceMessages} from "@/config/service-adapter";
import {contactFormUi as ui} from "@/config/contact-form";

/** Validated contact submission through the configured demo/live adapter. */
export function ContactForm() {
  const {pending,receipt,error,submit}=useServiceSubmission();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [email,setEmail]=useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();await submit("contact",{name,message,email});
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2" aria-busy={pending}>
      {error&&<p role="alert" className="sm:col-span-2">{error}</p>}
      {receipt&&<p role="status" className="break-all sm:col-span-2">{receipt.demo?serviceMessages.demoSuccess.ar:serviceMessages.liveSuccess.ar} {receipt.id}</p>}
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-medium">{ui.name}</label>
        <input id="contact-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2 outline-none focus:border-gold"
        />
      </div>
      <label className="block text-sm font-medium">{ui.email}<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-border bg-surface px-4 py-2 outline-none focus:border-gold"/></label>
      <div className="sm:col-span-2">
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium">{ui.message}</label>
        <textarea id="contact-message" minLength={5}
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2 outline-none focus:border-gold"
        />
      </div>
      <button
        type="submit" disabled={pending}
        className="w-full rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark sm:col-span-2"
      >
        {pending?serviceMessages.pending.ar:serviceMessages.submit.ar}
      </button>
    </form>
  );
}
