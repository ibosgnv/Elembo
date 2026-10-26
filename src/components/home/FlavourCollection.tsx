"use client";

import Link from "next/link";
import { useRef } from "react";
import { products } from "@/data/products";
import { FlavourCard } from "../FlavourCard";
import { ProductDialog, type ProductDialogHandle } from "../ProductDialog";
import { SunScribble, IconArrow } from "../Icons";
import { Reveal } from "../Reveal";

export function FlavourCollection() {
  const dialog = useRef<ProductDialogHandle>(null);
  const open: Parameters<typeof FlavourCard>[0]["onOpen"] = (slug, trigger) => dialog.current?.open(slug, trigger);

  return (
    <section id="saveurs" aria-labelledby="saveurs-title" className="scroll-mt-24 px-[var(--gutter)] py-[clamp(4rem,9vw,8rem)]">
      <div className="mx-auto max-w-[1360px]">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-14">
          <div>
            <p className="hand text-[1.9rem] text-orange">Cinq saveurs, un seul soleil</p>
            <h2 id="saveurs-title" className="display text-[clamp(3.4rem,8vw,7rem)]">
              Nos saveurs
            </h2>
          </div>
          <Link href="/produits" className="btn btn-outline text-ink">
            <span>Toute la gamme</span>
          </Link>
        </Reveal>

        <Reveal
          stagger
          className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-14 md:overflow-visible md:px-0 lg:grid-cols-3"
        >
          {products.map((p) => (
            <div key={p.slug} className="w-[78vw] max-w-[360px] shrink-0 snap-center md:w-auto md:max-w-none">
              <FlavourCard p={p} onOpen={open} />
            </div>
          ))}
          <div className="w-[78vw] max-w-[360px] shrink-0 snap-center md:w-auto md:max-w-none">
            <div className="panel torn-bottom on-dark relative flex aspect-[4/4.6] flex-col items-center justify-center bg-leaf-deep p-8 text-center text-cream">
              <SunScribble className="mb-4 w-20 text-gold" />
              <p className="hand text-[2.2rem] leading-tight">Chaque fruit a sa saison.</p>
              <p className="mt-3 max-w-[18rem] text-[0.9375rem] opacity-90">
                Nos jus suivent les récoltes du Kongo-Central : selon le moment de l’année, certaines saveurs peuvent manquer en rayon.
              </p>
              <Link href="/contact?sujet=client" className="mt-6 inline-flex items-center gap-2 border-b-2 border-current pb-0.5 text-sm font-bold uppercase tracking-wider">
                Demander les saveurs du moment <IconArrow width={16} height={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
      <ProductDialog ref={dialog} />
    </section>
  );
}
