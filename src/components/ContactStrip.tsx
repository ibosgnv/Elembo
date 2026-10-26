import Link from "next/link";
import { IconMail, IconPhone, IconArrow } from "./Icons";
import { formatPhone, site } from "@/data/site";
import { Reveal } from "./Reveal";

/** "Nous contacter" block with explicit phone and mail icons (UX review, Produits #6–7). */
export function ContactStrip() {
  return (
    <section aria-labelledby="contact-strip-title" className="px-[var(--gutter)] pb-[clamp(4rem,8vw,7rem)]">
      <Reveal className="panel on-dark mx-auto grid max-w-[1240px] gap-8 bg-ink p-8 text-cream md:grid-cols-[1fr_auto] md:items-center md:p-12">
        <div>
          <h2 id="contact-strip-title" className="display text-[clamp(2.6rem,5vw,4.2rem)]">
            Nous contacter
          </h2>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-[1.0625rem] font-semibold">
            <li>
              <a href="tel:+243894830974" className="inline-flex min-h-11 items-center gap-2 hover:underline">
                <IconPhone /> Commandes Kinshasa : {formatPhone("+243894830974")}
              </a>
            </li>
            <li>
              <a href="tel:+243820584606" className="inline-flex min-h-11 items-center gap-2 hover:underline">
                <IconPhone /> Kongo-Central : {formatPhone("+243820584606")}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-2 hover:underline">
                <IconMail /> {site.email}
              </a>
            </li>
          </ul>
        </div>
        <Link href="/contact" className="btn btn-cream">
          Écrire un message <IconArrow width={18} height={18} />
        </Link>
      </Reveal>
    </section>
  );
}
