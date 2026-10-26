"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { IconInfo, Splash } from "./Icons";

export function FlavourCard({ p, onOpen }: { p: Product; onOpen: (slug: Product["slug"], trigger: HTMLElement) => void }) {
  return (
    <article className="group flex h-full flex-col" aria-labelledby={`card-${p.slug}`}>
      <div className="panel torn-bottom relative aspect-[4/4.6] overflow-hidden" style={{ backgroundColor: p.theme.bg, color: p.theme.ink }}>
        <p className="eyebrow absolute inset-x-0 top-5 text-center">Selon la saison</p>
        <button
          type="button"
          onClick={(e) => onOpen(p.slug, e.currentTarget)}
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink transition-transform hover:scale-110"
          aria-label={`Informations sur le jus ${p.name}`}
        >
          <IconInfo />
        </button>
        <Splash aria-hidden className="absolute left-[14%] top-[30%] w-12 opacity-80" />
        <Splash aria-hidden className="absolute right-[12%] top-[52%] w-9 -scale-x-100 opacity-80" />
        <div className="absolute inset-x-0 bottom-[7%] top-[13%] flex justify-center">
          <Image
            src={p.bottle.src}
            alt={p.bottle.alt}
            width={p.bottle.width}
            height={p.bottle.height}
            sizes="(max-width: 768px) 120px, 160px"
            className="h-full w-auto -rotate-[5deg] object-contain drop-shadow-[0_24px_22px_rgba(42,26,14,.28)] transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-2 group-hover:rotate-[2deg]"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-1 pt-4">
        <h3 id={`card-${p.slug}`} className="display text-[2.6rem]">
          {p.name}
        </h3>
        <p className="mt-1 text-[0.9375rem] text-ink-soft">{p.tagline} 30 cl, bouteille en verre.</p>
        <div className="mt-4 flex flex-wrap gap-2 pt-1">
          <button type="button" onClick={(e) => onOpen(p.slug, e.currentTarget)} className="btn btn-ink !min-h-11 !px-4 !text-[0.8125rem]">
            Découvrir
          </button>
          <Link href="/points-de-vente" className="btn btn-outline !min-h-11 !px-4 !text-[0.8125rem] text-ink">
            <span>Trouver ce jus</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
