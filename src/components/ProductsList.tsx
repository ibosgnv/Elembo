"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { products } from "@/data/products";
import { fruits } from "@/data/assets";
import { ProductDialog, type ProductDialogHandle } from "./ProductDialog";
import { IconArrow, IconInfo } from "./Icons";
import { Reveal } from "./Reveal";

/** Spacious alternating rows: big bottle on its colour, name set large beside it. */
export function ProductsList() {
  const dialog = useRef<ProductDialogHandle>(null);
  return (
    <div className="space-y-[clamp(3rem,7vw,6rem)]">
      {products.map((p, i) => {
        const deco = fruits[p.decor[0]];
        return (
          <Reveal as="article" key={p.slug} id={p.slug} aria-labelledby={`p-${p.slug}`} className="grid scroll-mt-28 items-center gap-8 md:grid-cols-2 md:gap-14">
            <div className={`panel torn-bottom relative aspect-[5/5.4] overflow-hidden ${i % 2 ? "md:order-2" : ""}`} style={{ backgroundColor: p.theme.bg }}>
              <div aria-hidden className="splatter absolute inset-x-0 bottom-0 h-1/2 text-paper opacity-25" />
              <Image src={deco.src} width={deco.width} height={deco.height} alt="" aria-hidden sizes="220px" className="absolute -right-6 top-8 w-[38%] rotate-12" />
              <div className="absolute inset-x-0 bottom-[8%] top-[8%] flex justify-center">
                <Image src={p.bottle.src} alt={p.bottle.alt} width={p.bottle.width} height={p.bottle.height} sizes="(max-width: 768px) 140px, 200px" className="h-full w-auto -rotate-[4deg] object-contain drop-shadow-[0_30px_26px_rgba(42,26,14,.3)]" />
              </div>
            </div>
            <div>
              <p className="eyebrow text-ink-soft">
                {p.label} · 30 cl · selon la saison
              </p>
              <h2 id={`p-${p.slug}`} className="display mt-2 text-[clamp(3.6rem,9vw,8rem)]">
                {p.name}
              </h2>
              <span aria-hidden className="mt-3 block h-2.5 w-28 rounded-full" style={{ backgroundColor: p.theme.bg }} />
              <p className="hand mt-1 text-[1.8rem] leading-tight">{p.tagline}</p>
              <p className="mt-4 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-soft">{p.description}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button type="button" className="btn btn-ink" onClick={(e) => dialog.current?.open(p.slug, e.currentTarget)}>
                  <IconInfo width={18} height={18} /> Fiche produit
                </button>
                <Link href="/points-de-vente" className="btn btn-outline text-ink">
                  <span>Trouver ce jus</span> <IconArrow width={18} height={18} />
                </Link>
              </div>
            </div>
          </Reveal>
        );
      })}
      <ProductDialog ref={dialog} />
    </div>
  );
}
