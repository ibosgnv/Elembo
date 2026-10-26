import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ProductsList } from "@/components/ProductsList";
import { Reveal } from "@/components/Reveal";
import { ContactStrip } from "@/components/ContactStrip";
import { rangeFacts } from "@/data/products";

export const metadata: Metadata = {
  title: "Nos jus",
  description: "Orange, ananas, mangue, orange–ananas et mangue–ananas : les jus Elembo en bouteille de verre de 30 cl, au fil des saisons.",
};

const facts = [
  { title: "Au rythme des saisons", text: rangeFacts.seasonal + " Orange, ananas, mangue et nos deux mélanges se relaient selon les récoltes." },
  { title: "30 cl, en verre", text: `${rangeFacts.format}. ${rangeFacts.conservation}` },
  { title: "Contrôlé", text: rangeFacts.control },
  { title: "La bouteille revient", text: rangeFacts.returnSystem },
];

export default function ProduitsPage() {
  return (
    <>
      <PageHero
        eyebrow="La gamme Elembo"
        title={<>Nos jus</>}
        bg="var(--mango)"
        ink="var(--ink)"
        decor={["mangoCut", "orangeHalf", "leaf1"]}
        intro={<p>Cinq saveurs élaborées à Kimpese avec les fruits du Kongo-Central. Trois fruits, deux mélanges, une bouteille de verre de 30 cl.</p>}
      />

      <section aria-label="Les cinq saveurs" className="px-[var(--gutter)] py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto max-w-[1240px]">
          <ProductsList />
        </div>
      </section>

      <section aria-labelledby="savoir-title" className="px-[var(--gutter)] pb-[clamp(4rem,8vw,7rem)]">
        <Reveal className="panel tilt-l mx-auto max-w-[1240px] bg-paper p-8 shadow-[0_20px_60px_-40px_rgba(42,26,14,.6)] md:p-14">
          <div className="untilt-l">
            <p className="hand text-[1.9rem] text-orange">Bon à savoir</p>
            <h2 id="savoir-title" className="display text-[clamp(2.8rem,6vw,5rem)]">
              À savoir sur nos jus
            </h2>
            <dl className="mt-10 grid gap-x-12 gap-y-9 md:grid-cols-2">
              {facts.map((f) => (
                <div key={f.title}>
                  <dt className="text-[1.375rem] font-extrabold leading-tight">{f.title}</dt>
                  <dd className="mt-2 leading-relaxed text-ink-soft">{f.text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 border-t-2 border-dashed border-ink/15 pt-6 text-sm text-ink-soft">
              La composition détaillée et les valeurs nutritionnelles de chaque jus seront publiées ici dès qu’elles nous seront transmises. Une question
              d’ici là ? <Link href="/contact?sujet=client" className="font-semibold text-ink underline">Écrivez-nous</Link>.
            </p>
          </div>
        </Reveal>
      </section>

      <ContactStrip />
    </>
  );
}
