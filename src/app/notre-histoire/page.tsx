import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";
import { IconArrow, SunScribble } from "@/components/Icons";
import { photos, pictos } from "@/data/assets";
import { association } from "@/data/site";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "Comment un couple suisso-congolais a lancé une fabrique de jus à Kimpese : le constat de 2020, l’usine inaugurée en 2025, les engagements d’Elembo et le rôle de l’association AdEL.",
};

/* Source for every date and figure: elembo-rdc.com/about-us (March 2026). */
const timeline = [
  { when: "2020", title: "Le constat", text: "En pleine crise du coronavirus, Christopher et Pauline constatent que la RDC regorge de fruits, mais que les « jus » les plus bus sont des sodas sucrés, souvent importés." },
  { when: "Sept. 2022", title: "L’ONGD Elembo voit le jour", text: "Les projets agroalimentaires sont réunis sous le nom d’Elembo, une ONG de développement fondée à Kimpese." },
  { when: "2023 – 2025", title: "Des soutiens solides", text: "La Confédération suisse (plateforme REPIC), l’Ambassade de Suisse en RDC et plusieurs fondations privées soutiennent le projet." },
  { when: "2024", title: "Un prix et une usine", text: "Le couple remporte le 1er Prix Diaspora et Développement de la Fédération Vaudoise de la Coopération. Fin 2024, la fabrique semi-industrielle est construite." },
  { when: "Mai 2025", title: "Inauguration", text: "La fabrique de Kimpese est officiellement inaugurée. Depuis, la marque est en plein essor." },
];

const commitments = [
  "Lutter contre les pertes post-récoltes de fruits",
  "Soutenir les familles de paysans-producteurs",
  "Créer de nouveaux emplois localement",
  "Promouvoir les produits naturels made in RDC",
];

export default function HistoirePage() {
  return (
    <>
      <PageHero
        eyebrow="Notre histoire"
        title={<>Le symbole<br />d’un nouveau départ</>}
        bg="var(--leaf)"
        decor={["pineappleCrown", "orangeWhole", "leaf4"]}
        intro={
          <p>
            En lingala, <em>elembo</em> signifie « le signe, le symbole ». Notre rêve : faire de ce nom le symbole d’un nouveau départ pour le Congo, en
            valorisant ses fruits et celles et ceux qui les cultivent.
          </p>
        }
      />

      {/* The brand first */}
      <section aria-labelledby="marque-title" className="px-[var(--gutter)] py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="hand text-[1.9rem] text-orange">D’abord, des jus</p>
            <h2 id="marque-title" className="display text-[clamp(3rem,6.5vw,6rem)]">
              Une marque née à Kimpese
            </h2>
            <p className="mt-6 text-[1.125rem] leading-relaxed text-ink-soft">
              Elembo est une marque de jus basée à Kimpese, dans le Kongo-Central. Notre fabrique semi-industrielle, construite fin 2024, dispose d’une ligne
              complète de production de jus de fruits.
            </p>
            <p className="mt-4 text-[1.125rem] leading-relaxed text-ink-soft">
              Plus de 12 personnes y travaillent, pour une capacité de près de 1 000 litres par jour. Notre ambition : une alternative locale, saine et
              accessible aux sodas industriels.
            </p>
          </Reveal>
          <Reveal className="relative">
            <figure className="panel tilt-r relative aspect-[4/3] overflow-hidden">
              <Image src={photos.offering.src} alt={photos.offering.alt} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
            </figure>
            <Image src={pictos.factory.src} width={600} height={600} alt="" aria-hidden className="absolute -bottom-8 -left-6 w-28 rotate-[-8deg] rounded-3xl shadow-lg" />
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section aria-labelledby="dates-title" className="px-[var(--gutter)] pb-[clamp(4rem,8vw,7rem)]">
        <div className="panel on-dark mx-auto max-w-[1360px] bg-ink px-6 py-14 text-cream md:px-14 md:py-20">
          <Reveal className="max-w-[44rem]">
            <p className="hand text-[1.9rem] text-gold">« Avec tout ce que le Congo possède comme fruits, ce sont ces jus que vous consommez ? »</p>
            <h2 id="dates-title" className="display mt-4 text-[clamp(3rem,6.5vw,6rem)]">
              De l’idée à l’usine
            </h2>
          </Reveal>
          <Reveal stagger as="ol" className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {timeline.map((t) => (
              <li key={t.when} className="border-t-2 border-cream/25 pt-5">
                <p className="display text-[2.4rem] text-gold">{t.when}</p>
                <h3 className="mt-2 text-[1.2rem] font-extrabold leading-tight">{t.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed opacity-85">{t.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* People */}
      <section aria-labelledby="gens-title" className="px-[var(--gutter)] pb-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <p className="hand text-[1.9rem] text-orange">Des visages derrière chaque bouteille</p>
            <h2 id="gens-title" className="display text-[clamp(3rem,6.5vw,6rem)]">
              Les gens d’Elembo
            </h2>
          </Reveal>
          <Reveal stagger className="mt-10 grid gap-5 md:grid-cols-3 md:grid-rows-2">
            <article className="panel overflow-hidden bg-paper md:col-span-2 md:row-span-2 md:grid md:grid-cols-[1.05fr_0.95fr]">
              <figure className="relative aspect-[902/873] md:aspect-auto md:h-full">
                <Image src={photos.founders.src} alt={photos.founders.alt} fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover object-[50%_30%]" />
              </figure>
              <div className="flex flex-col justify-center p-7 md:p-9">
                <p className="eyebrow text-ink-soft">Fondateurs</p>
                <h3 className="mt-2 text-[1.8rem] font-extrabold leading-tight">Christopher Inembe et Pauline</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  Un jeune couple suisso-congolais vivant en Suisse, à l’origine de l’association des Amis d’Elembo à Lausanne et du projet Elembo.
                </p>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  Né en 1990 en RDC, Christopher a grandi entre Kinshasa et le Kongo-Central avant de rejoindre la Suisse en 2016. Il est aujourd’hui
                  CEO d’Elembo.
                </p>
              </div>
            </article>
            <article className="panel bg-paper p-7">
              <p className="eyebrow text-ink-soft">Direction</p>
              <h3 className="mt-2 text-[1.6rem] font-extrabold leading-tight">Alexandre Isekama</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">Directeur exécutif d’Elembo. C’est aussi votre contact pour la livraison à Kimpese, Lukala, Kisantu et Matadi.</p>
            </article>
            <article className="panel bg-gold p-7">
              <p className="eyebrow">Producteurs</p>
              <h3 className="mt-2 text-[1.6rem] font-extrabold leading-tight">Les paysans du Kongo-Central</h3>
              <p className="mt-3 leading-relaxed">
                Ils cultivent les oranges, ananas et mangues que nous transformons. Leur offrir un débouché stable est au cœur du projet.
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      <div className="overflow-hidden py-6">
        <Marquee items={["Tongo etani na mboka", "Jus na biso", "Made in RDC"]} className="display -mx-8 bg-orange py-4 text-[clamp(2.4rem,5.5vw,4.6rem)] text-ink" tilt={1.6} reverse />
      </div>

      {/* Commitments */}
      <section aria-labelledby="engagements-title" className="px-[var(--gutter)] py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <SunScribble className="w-16 text-orange" />
            <h2 id="engagements-title" className="display mt-4 text-[clamp(3rem,6.5vw,6rem)]">
              Nos engagements
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              En RDC, une grande partie des fruits est laissée à l’abandon dans les villages, faute d’acheteurs fiables, de routes adaptées et de structure
              qui regroupe les producteurs. Elembo veut changer cela.
            </p>
          </Reveal>
          <Reveal stagger as="ol" className="grid gap-4 sm:grid-cols-2">
            {commitments.map((c, i) => (
              <li key={c} className="panel flex min-h-[150px] flex-col justify-between bg-paper p-6">
                <span className="display text-[2.6rem] text-orange">0{i + 1}</span>
                <span className="text-[1.2rem] font-extrabold leading-tight">{c}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Brand vs association — kept explicit to avoid the confusion noted in the UX review */}
      <section aria-labelledby="structures-title" className="px-[var(--gutter)] pb-[clamp(4rem,8vw,7rem)]">
        <Reveal className="panel tilt-l mx-auto max-w-[1240px] bg-cream-deep p-8 md:p-14">
          <div className="untilt-l">
            <p className="hand text-[1.9rem] text-leaf">Qui fait quoi ?</p>
            <h2 id="structures-title" className="display text-[clamp(2.8rem,6vw,5rem)]">
              La marque et l’association
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl bg-paper p-6">
                <p className="eyebrow text-orange">La marque</p>
                <h3 className="mt-2 text-[1.4rem] font-extrabold">Elembo</h3>
                <p className="mt-2 text-ink-soft">Les jus que vous achetez. Produits à Kimpese, vendus à Kinshasa et dans le Kongo-Central.</p>
              </div>
              <div className="rounded-2xl bg-paper p-6">
                <p className="eyebrow text-leaf">En RDC</p>
                <h3 className="mt-2 text-[1.4rem] font-extrabold">ONGD Elembo</h3>
                <p className="mt-2 text-ink-soft">
                  Organisation non gouvernementale de développement fondée en septembre 2022 à Kimpese. Elle réunit les projets agroalimentaires et
                  accompagne les producteurs.
                </p>
              </div>
              <div className="rounded-2xl bg-paper p-6">
                <p className="eyebrow text-ink-soft">En Suisse</p>
                <h3 className="mt-2 text-[1.4rem] font-extrabold">AdEL</h3>
                <p className="mt-2 text-ink-soft">
                  L’{association.name}, à Lausanne, soutient financièrement et supervise ces projets, avec des agronomes locaux.
                </p>
                <a href={association.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 font-semibold underline">
                  adelembo.ch <span className="sr-only">(nouvel onglet)</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-[var(--gutter)] pb-[clamp(4rem,8vw,7rem)] text-center">
        <Reveal>
          <h2 className="display text-[clamp(2.8rem,6vw,5rem)]">Envie de goûter ?</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/produits" className="btn btn-ink">
              Voir nos jus <IconArrow width={18} height={18} />
            </Link>
            <Link href="/points-de-vente" className="btn btn-outline text-ink">
              <span>Où nous trouver</span>
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
