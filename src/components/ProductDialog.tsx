"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { products, rangeFacts, type Product } from "@/data/products";
import { IconClose, IconArrow } from "./Icons";

export type ProductDialogHandle = { open: (slug: Product["slug"], trigger?: HTMLElement | null) => void };

/**
 * Product information overlay (native <dialog>: Esc closes it, focus is
 * contained while open and returned to the trigger afterwards).
 */
export const ProductDialog = forwardRef<ProductDialogHandle>(function ProductDialog(_, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [slug, setSlug] = useState<Product["slug"]>("orange");
  const p = products.find((x) => x.slug === slug)!;

  useImperativeHandle(ref, () => ({
    open(s, trigger) {
      triggerRef.current = trigger ?? null;
      setSlug(s);
      dialogRef.current?.showModal();
    },
  }));

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="product-dialog-title"
      onClose={() => triggerRef.current?.focus()}
      onClick={(e) => {
        if (e.target === dialogRef.current) close(); // click on backdrop
      }}
      className="m-auto w-[min(1040px,calc(100vw-24px))] max-w-none overflow-visible bg-transparent p-0"
    >
      <div className="panel relative grid max-h-[calc(100dvh-24px)] overflow-y-auto md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" style={{ backgroundColor: p.theme.bg, color: p.theme.ink }}>
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-cream"
          aria-label="Fermer la fiche produit"
        >
          <IconClose />
        </button>

        <div className="relative flex items-center justify-center px-6 pb-2 pt-10 md:py-10">
          <div className="relative h-[min(52vh,520px)]" style={{ aspectRatio: "380 / 1504" }}>
            <Image src={p.bottle.src} alt={p.bottle.alt} width={p.bottle.width} height={p.bottle.height} sizes="160px" className="h-full w-full -rotate-3 object-contain drop-shadow-[0_26px_26px_rgba(42,26,14,.3)]" />
          </div>
        </div>

        <div className="rounded-t-[inherit] bg-paper p-6 text-ink md:rounded-l-none md:rounded-r-[inherit] md:p-10">
          <p className="eyebrow text-ink-soft">{p.label} · 30 cl</p>
          <h2 id="product-dialog-title" className="display mt-2 text-[clamp(3rem,6vw,5rem)]">
            {p.name}
          </h2>
          <span aria-hidden className="mt-3 block h-2 w-20 rounded-full" style={{ backgroundColor: p.theme.bg }} />
          <p className="hand mt-3 text-[1.6rem] leading-tight text-ink-soft">
            {p.tagline}
          </p>
          <p className="mt-4 max-w-prose">{p.description}</p>

          <dl className="mt-6 grid gap-x-6 gap-y-4 border-t-2 border-dashed border-ink/20 pt-6 text-[0.9375rem] sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-ink-soft">Fruits</dt>
              <dd className="mt-1 font-semibold">{p.fruits.join(" et ")}</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-soft">Format</dt>
              <dd className="mt-1 font-semibold">{rangeFacts.format}</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-soft">Disponibilité</dt>
              <dd className="mt-1">{rangeFacts.seasonal}</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-soft">Conservation</dt>
              <dd className="mt-1">Jusqu’à un an sans conservateur, à l’abri de la chaleur et du soleil.</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-soft">Contrôle</dt>
              <dd className="mt-1">Usine et jus contrôlés et attestés par l’OCC.</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-soft">Bouteille</dt>
              <dd className="mt-1">Verre, récupéré via le retour des vidanges.</dd>
            </div>
          </dl>
          <p className="mt-5 rounded-xl bg-cream-deep/70 px-4 py-3 text-sm text-ink-soft">
            Composition détaillée et valeurs nutritionnelles : bientôt disponibles sur cette fiche.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/points-de-vente" className="btn btn-ink" onClick={close}>
              Trouver ce jus <IconArrow width={18} height={18} />
            </Link>
            <Link href="/contact?sujet=livraison" className="btn btn-outline text-ink" onClick={close}>
              <span>Se faire livrer</span>
            </Link>
          </div>
        </div>
      </div>
    </dialog>
  );
});
