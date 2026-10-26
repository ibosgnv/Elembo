"use client";

import { Suspense, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { IconMail, IconPhone, IconWhatsapp } from "./Icons";
import { site, whatsappNumber, formatPhone } from "@/data/site";

type Field = "sujet" | "nom" | "telephone" | "email" | "ville" | "message";
type Values = Record<Field, string>;
type Status = "idle" | "sending" | "sent" | "unavailable" | "error";

const SUBJECTS = [
  { value: "client", label: "Une question sur nos jus", hint: "Saveurs du moment, conservation, points de vente…" },
  { value: "livraison", label: "Commander une livraison", hint: "Kinshasa, Kimpese, Lukala, Kisantu, Matadi" },
  { value: "revendeur", label: "Devenir revendeur", hint: "Kiosque, bar, restaurant, hôtel, supermarché" },
];

const LABELS: Record<Field, string> = {
  sujet: "Type de demande",
  nom: "Nom complet",
  telephone: "Téléphone",
  email: "E-mail",
  ville: "Ville",
  message: "Message",
};

function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (!v.sujet) e.sujet = "Choisissez le type de demande.";
  if (v.nom.trim().length < 2) e.nom = "Indiquez votre nom.";
  if (!/^\+?[0-9 ().-]{8,20}$/.test(v.telephone.trim())) e.telephone = "Indiquez un numéro valide, par exemple +243 89 000 00 00.";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Cette adresse e-mail n’est pas valide.";
  if (v.message.trim().length < 10) e.message = "Écrivez au moins 10 caractères.";
  return e;
}

function summary(v: Values) {
  const subject = SUBJECTS.find((s) => s.value === v.sujet)?.label ?? "Demande";
  const lines = [`${subject}`, `Nom : ${v.nom}`, `Téléphone : ${v.telephone}`];
  if (v.email) lines.push(`E-mail : ${v.email}`);
  if (v.ville) lines.push(`Ville : ${v.ville}`);
  lines.push("", v.message);
  return { subject: `[Site Elembo] ${subject}`, body: lines.join("\n") };
}

/** Pre-selects the subject from ?sujet=… links used across the site. */
export function ContactForm() {
  return (
    <Suspense fallback={<Form initialSujet="" />}>
      <FormFromParams />
    </Suspense>
  );
}

function FormFromParams() {
  const s = useSearchParams().get("sujet") ?? "";
  const initial = SUBJECTS.some((x) => x.value === s) ? s : "";
  return <Form key={initial} initialSujet={initial} />;
}

function Form({ initialSujet }: { initialSujet: string }) {
  const [values, setValues] = useState<Values>({ sujet: initialSujet, nom: "", telephone: "", email: "", ville: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const set = (f: Field, val: string) => {
    const next = { ...values, [f]: val };
    setValues(next);
    if (touched[f]) setErrors(validate(next));
  };
  const blur = (f: Field) => {
    setTouched((t) => ({ ...t, [f]: true }));
    setErrors(validate(values));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ sujet: true, nom: true, telephone: true, email: true, ville: true, message: true });
    const first = (Object.keys(LABELS) as Field[]).find((f) => errs[f]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const website = (formRef.current?.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website }),
      });
      setStatus(res.ok ? "sent" : res.status === 503 ? "unavailable" : "error");
    } catch {
      setStatus("error");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  const { subject, body } = summary(values);
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const whatsapp = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(body)}` : null;
  const phone = values.sujet === "livraison" && /kimpese|matadi|lukala|kisantu/i.test(values.ville) ? "+243820584606" : "+243894830974";

  if (status === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="panel bg-leaf p-8 text-cream on-dark">
        <p className="display text-[2.6rem]">Message envoyé</p>
        <p className="mt-2">Merci {values.nom.split(" ")[0]} ! Nous vous répondrons par téléphone ou par e-mail.</p>
      </div>
    );
  }

  const errorList = (Object.keys(LABELS) as Field[]).filter((f) => errors[f] && touched[f]);
  const fieldCls = (f: Field) =>
    `mt-2 block w-full rounded-2xl border-2 bg-paper px-4 py-3 text-[1rem] outline-none transition focus:border-ink focus-visible:outline-none focus:ring-4 focus:ring-gold/60 ${
      errors[f] && touched[f] ? "border-red" : "border-ink/20"
    }`;
  const describe = (f: Field) => (errors[f] && touched[f] ? `${f}-error` : undefined);

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="space-y-6" aria-describedby="form-note">
      {errorList.length > 1 && (
        <div role="alert" className="rounded-2xl border-2 border-red bg-red/10 p-4 text-sm">
          <p className="font-bold">Merci de corriger {errorList.length} champs :</p>
          <ul className="mt-1 list-disc pl-5">
            {errorList.map((f) => (
              <li key={f}>
                <a href={`#${f}`} className="underline">{LABELS[f]}</a> — {errors[f]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset aria-describedby={describe("sujet")}>
        <legend className="font-extrabold">
          {LABELS.sujet} <span aria-hidden className="text-red">*</span>
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {SUBJECTS.map((s, i) => (
            <label
              key={s.value}
              className={`flex cursor-pointer flex-col rounded-2xl border-2 p-4 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ink/70 ${values.sujet === s.value ? "border-ink bg-gold" : "border-ink/20 bg-paper hover:border-ink/50"}`}
            >
              <input
                type="radio"
                name="sujet"
                id={i === 0 ? "sujet" : undefined}
                value={s.value}
                checked={values.sujet === s.value}
                onChange={(e) => set("sujet", e.target.value)}
                onBlur={() => blur("sujet")}
                className="sr-only"
              />
              <span className="font-bold">{s.label}</span>
              <span className="mt-1 text-sm text-ink-soft">{s.hint}</span>
            </label>
          ))}
        </div>
        {errors.sujet && touched.sujet && (
          <p id="sujet-error" className="mt-2 text-sm font-semibold text-red">{errors.sujet}</p>
        )}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="nom" className="font-extrabold">
            {LABELS.nom} <span aria-hidden className="text-red">*</span>
          </label>
          <input id="nom" name="nom" autoComplete="name" required value={values.nom} onChange={(e) => set("nom", e.target.value)} onBlur={() => blur("nom")} aria-invalid={!!(errors.nom && touched.nom)} aria-describedby={describe("nom")} className={fieldCls("nom")} />
          {errors.nom && touched.nom && <p id="nom-error" className="mt-2 text-sm font-semibold text-red">{errors.nom}</p>}
        </div>
        <div>
          <label htmlFor="telephone" className="font-extrabold">
            {LABELS.telephone} <span aria-hidden className="text-red">*</span>
          </label>
          <input id="telephone" name="telephone" type="tel" inputMode="tel" autoComplete="tel" required value={values.telephone} onChange={(e) => set("telephone", e.target.value)} onBlur={() => blur("telephone")} aria-invalid={!!(errors.telephone && touched.telephone)} aria-describedby={describe("telephone") ?? "telephone-hint"} className={fieldCls("telephone")} />
          {errors.telephone && touched.telephone ? (
            <p id="telephone-error" className="mt-2 text-sm font-semibold text-red">{errors.telephone}</p>
          ) : (
            <p id="telephone-hint" className="mt-2 text-sm text-ink-soft">Nous rappelons le plus souvent par téléphone.</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="font-extrabold">
            {LABELS.email} <span className="font-normal text-ink-soft">(facultatif)</span>
          </label>
          <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} aria-invalid={!!(errors.email && touched.email)} aria-describedby={describe("email")} className={fieldCls("email")} />
          {errors.email && touched.email && <p id="email-error" className="mt-2 text-sm font-semibold text-red">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="ville" className="font-extrabold">
            {LABELS.ville} <span className="font-normal text-ink-soft">(facultatif)</span>
          </label>
          <select id="ville" name="ville" value={values.ville} onChange={(e) => set("ville", e.target.value)} className={fieldCls("ville")}>
            <option value="">Choisir…</option>
            <option>Kinshasa</option>
            <option>Kimpese</option>
            <option>Matadi</option>
            <option>Lukala</option>
            <option>Kisantu</option>
            <option>Autre</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="font-extrabold">
          {LABELS.message} <span aria-hidden className="text-red">*</span>
        </label>
        <textarea id="message" name="message" rows={6} required value={values.message} onChange={(e) => set("message", e.target.value)} onBlur={() => blur("message")} aria-invalid={!!(errors.message && touched.message)} aria-describedby={describe("message")} className={fieldCls("message")} />
        {errors.message && touched.message && <p id="message-error" className="mt-2 text-sm font-semibold text-red">{errors.message}</p>}
      </div>

      {/* Honeypot, hidden from people */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label>
          Ne pas remplir <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <p id="form-note" className="text-sm text-ink-soft">
        <span aria-hidden className="text-red">*</span> Champs obligatoires. Vos coordonnées servent uniquement à vous répondre.
      </p>

      <button type="submit" disabled={status === "sending"} className="btn btn-ink disabled:cursor-wait disabled:opacity-60" aria-busy={status === "sending"}>
        {status === "sending" ? "Envoi en cours…" : "Envoyer le message"}
      </button>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {(status === "unavailable" || status === "error") && (
          <div role="alert" className="panel bg-gold p-6">
            <p className="text-[1.2rem] font-extrabold">
              {status === "unavailable" ? "L’envoi en ligne n’est pas encore activé." : "Votre message n’a pas pu être envoyé."}
            </p>
            <p className="mt-1">Il n’a pas été transmis. Envoyez-le directement — votre texte est déjà prêt :</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={mailto} className="btn btn-ink">
                <IconMail width={18} height={18} /> Envoyer par e-mail
              </a>
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-cream">
                  <IconWhatsapp width={18} height={18} /> WhatsApp
                </a>
              )}
              <a href={`tel:${phone}`} className="btn btn-cream">
                <IconPhone width={18} height={18} /> Appeler le {formatPhone(phone)}
              </a>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
