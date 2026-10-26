import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { IconFacebook, IconInstagram, IconMail, IconPhone, IconPin, IconTiktok } from "@/components/Icons";
import { contacts, formatPhone, site, socials } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Commander, se faire livrer ou devenir revendeur Elembo : téléphones, e-mail et formulaire de contact.",
};

const socialIcons = { Instagram: IconInstagram, TikTok: IconTiktok, Facebook: IconFacebook } as const;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="On se parle ?"
        title={<>Contact</>}
        bg="var(--gold)"
        ink="var(--ink)"
        decor={["pineappleWedge", "mangoCube1", "leaf3"]}
        intro={<p>Une question, une commande à livrer ou l’envie de proposer Elembo dans votre commerce : appelez-nous ou laissez un message.</p>}
      />

      <section className="px-[var(--gutter)] py-[clamp(3.5rem,7vw,6rem)]">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <aside aria-labelledby="direct-title" className="space-y-5">
            <h2 id="direct-title" className="display text-[clamp(2.6rem,5vw,4rem)]">
              En direct
            </h2>
            <ul className="space-y-3">
              {contacts.map((c) => (
                <li key={c.role + (c.name ?? "")} className="panel bg-paper p-5">
                  <p className="eyebrow text-ink-soft">{c.role}</p>
                  {c.name && <p className="mt-1 text-[1.15rem] font-extrabold">{c.name}</p>}
                  <p className="mt-1 flex flex-wrap gap-x-4">
                    {c.phones.map((n) => (
                      <a key={n} href={`tel:${n}`} className="inline-flex min-h-11 items-center gap-2 font-semibold underline">
                        <IconPhone width={16} height={16} /> {formatPhone(n)}
                      </a>
                    ))}
                  </p>
                </li>
              ))}
              <li className="panel bg-paper p-5">
                <p className="eyebrow text-ink-soft">E-mail</p>
                <a href={`mailto:${site.email}`} className="mt-1 inline-flex min-h-11 items-center gap-2 font-semibold underline">
                  <IconMail width={16} height={16} /> {site.email}
                </a>
              </li>
              <li className="panel bg-paper p-5">
                <p className="eyebrow text-ink-soft">{site.office.label}</p>
                <p className="mt-1 flex gap-2">
                  <IconPin width={16} height={16} className="mt-1 shrink-0" /> {site.office.address}
                </p>
              </li>
            </ul>
            <ul className="flex flex-wrap gap-2">
              {socials.map((s) => {
                const Icon = socialIcons[s.name];
                return (
                  <li key={s.name}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline !min-h-11 !px-4 !text-[0.8125rem] text-ink">
                      <Icon width={18} height={18} /> <span>{s.name}</span>
                      <span className="sr-only">(nouvel onglet)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="text-sm text-ink-soft">
              Vous cherchez un point de vente ? <Link href="/points-de-vente" className="font-semibold text-ink underline">Voir les adresses</Link>.
            </p>
          </aside>

          <div aria-labelledby="form-title">
            <h2 id="form-title" className="display text-[clamp(2.6rem,5vw,4rem)]">
              Écrire un message
            </h2>
            <div className="panel mt-5 bg-cream-deep/60 p-6 md:p-9">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
