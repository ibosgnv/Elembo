import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WhereToFind } from "@/components/home/Sections";
import { Reveal } from "@/components/Reveal";
import { ContactStrip } from "@/components/ContactStrip";
import { IconTruck } from "@/components/Icons";
import { cities, events } from "@/data/locations";
import { formatPhone } from "@/data/site";

export const metadata: Metadata = {
  title: "Points de vente",
  description: "Où acheter les jus Elembo à Kinshasa, Kimpese et Matadi : supermarchés, dépositaires, détaillants, et livraison.",
};

export default function PointsDeVentePage() {
  return (
    <>
      <PageHero
        eyebrow="Où trouver Elembo"
        title={<>Points de vente</>}
        bg="var(--orange)"
        ink="var(--ink)"
        decor={["orangeWhole", "pineappleWedge", "leaf2"]}
        intro={
          <p>
            Nos jus sont vendus à Kinshasa et dans le Kongo-Central, autour de notre fabrique de Kimpese. Vous les trouverez en supermarché, chez nos
            dépositaires, chez des détaillants de quartier, dans nos Espaces Elembo et dans certains hôtels.
            Choisissez votre ville pour voir les adresses.
          </p>
        }
      />

      <div className="pt-[clamp(3rem,7vw,6rem)]">
        <WhereToFind />
      </div>

      <section aria-labelledby="livraison-title" className="px-[var(--gutter)] pb-[clamp(4rem,8vw,7rem)]">
        <Reveal className="panel mx-auto max-w-[1360px] bg-paper p-8 md:p-12">
          <div className="flex items-center gap-3">
            <IconTruck width={32} height={32} className="text-orange" />
            <h2 id="livraison-title" className="display text-[clamp(2.4rem,5vw,4rem)]">
              Livraison
            </h2>
          </div>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {[cities[0], cities[1]].map((c) => (
              <li key={c.slug}>
                <p className="font-extrabold">{c.delivery.text}</p>
                <p className="mt-1 flex flex-wrap gap-x-4">
                  {c.delivery.phones.map((p) => (
                    <a key={p.number} href={`tel:${p.number}`} className="inline-flex min-h-11 items-center font-semibold text-ink underline">
                      {formatPhone(p.number)}
                    </a>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Events and sponsorships live here, apart from the store directory */}
      <section aria-labelledby="events-title" className="px-[var(--gutter)] pb-[clamp(4rem,8vw,7rem)]">
        <Reveal className="mx-auto max-w-[1360px]">
          <p className="hand text-[1.9rem] text-orange">Hors des rayons</p>
          <h2 id="events-title" className="display text-[clamp(2.8rem,6vw,5rem)]">
            Événements et partenariats
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {events.map((e) => (
              <li key={e.title} className="panel bg-cream-deep p-7">
                <h3 className="text-[1.4rem] font-extrabold">{e.title}</h3>
                <p className="mt-2 text-ink-soft">{e.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <ContactStrip />
    </>
  );
}
