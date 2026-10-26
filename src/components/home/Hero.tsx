"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { products } from "@/data/products";
import { fruits } from "@/data/assets";
import { getGsap, prefersReducedMotion } from "@/lib/motion";
import { Splash } from "../Icons";
import { PanelNotch } from "../PanelNotch";

/** Where the five fruit pieces sit around the bottle (percent of the panel). */
const SLOTS = [
  { left: "17%", top: "15%", mLeft: "2%", mTop: "45%", size: "clamp(96px, 15vw, 250px)", r: -14, d: "7s" },
  { left: "63%", top: "60%", mLeft: "60%", mTop: "57%", size: "clamp(88px, 13vw, 220px)", r: 18, d: "8s" },
  { left: "64%", top: "13%", mLeft: "72%", mTop: "37%", size: "clamp(54px, 7vw, 120px)", r: 24, d: "6.5s" },
  { left: "31%", top: "68%", mLeft: "22%", mTop: "70%", size: "clamp(26px, 2.6vw, 44px)", r: 0, d: "5.5s" },
  { left: "76%", top: "35%", mLeft: "84%", mTop: "50%", size: "clamp(36px, 4.4vw, 76px)", r: -10, d: "7.5s" },
];

export function Hero() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0); // flavour whose decor/text is currently displayed
  const panelRef = useRef<HTMLDivElement>(null);
  const bottleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const decorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const parallaxRefs = useRef<{ decor?: HTMLDivElement | null; bottle?: HTMLDivElement | null; title?: HTMLDivElement | null }>({});
  const radioRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const busy = useRef(false);
  const tapRef = useRef<HTMLButtonElement>(null);
  const tapInnerRef = useRef<HTMLSpanElement>(null);
  const goNext = useRef<() => void>(() => {});

  const product = products[shown];
  const theme = products[active].theme;

  // Initial state: only the first bottle visible
  useLayoutEffect(() => {
    bottleRefs.current.forEach((el, i) => {
      if (el) el.style.opacity = i === 0 ? "1" : "0";
    });
  }, []);

  const select = useCallback(
    (next: number) => {
      if (next === active || busy.current) return;
      const reduce = prefersReducedMotion();
      const prev = active;
      setActive(next);

      const out = bottleRefs.current[prev];
      const inc = bottleRefs.current[next];
      if (!out || !inc) {
        setShown(next);
        return;
      }
      if (reduce) {
        out.style.opacity = "0";
        inc.style.opacity = "1";
        setShown(next);
        return;
      }

      busy.current = true;
      const { gsap } = getGsap();
      const tl = gsap.timeline({ onComplete: () => (busy.current = false) });
      tl.to(out, { yPercent: 14, rotate: 12, opacity: 0, duration: 0.38, ease: "power2.in" }, 0)
        .to([decorRef.current, textRef.current], { opacity: 0, y: 12, duration: 0.25, ease: "power1.in" }, 0)
        .add(() => setShown(next))
        .fromTo(
          inc,
          { yPercent: -18, rotate: -22, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 0.85, ease: "back.out(1.6)" },
          0.3,
        )
        .set(out, { yPercent: 0, rotate: 0 });
    },
    [active],
  );

  // Bring decor + texts back in after the content swapped
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const pieces = decorRef.current?.querySelectorAll("[data-piece]");
    gsap.set([decorRef.current, textRef.current], { opacity: 1, y: 0 });
    if (pieces?.length) {
      gsap.fromTo(
        pieces,
        { scale: 0.4, opacity: 0, rotate: -30 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: "back.out(1.8)", stagger: 0.06 },
      );
    }
    if (textRef.current) gsap.fromTo(textRef.current, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
  }, [shown]);

  // Restrained pointer parallax on desktop
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const { gsap } = getGsap();
    const { decor, bottle, title } = parallaxRefs.current;
    const q = (el: HTMLElement | null | undefined, prop: "x" | "y") =>
      el ? gsap.quickTo(el, prop, { duration: 0.9, ease: "power3.out" }) : () => {};
    const moves = [
      [q(decor, "x"), q(decor, "y"), 22],
      [q(bottle, "x"), q(bottle, "y"), 9],
      [q(title, "x"), q(title, "y"), -7],
    ] as const;

    // "Goûter" disc follows the pointer with a soft lag and leans into the
    // direction of travel, like the reference's TAP badge. Its resting
    // place (set in CSS) is where keyboard and touch users find it.
    const tap = tapRef.current;
    const inner = tapInnerRef.current;
    const tx = tap ? gsap.quickTo(tap, "x", { duration: 0.65, ease: "power3.out" }) : () => {};
    const ty = tap ? gsap.quickTo(tap, "y", { duration: 0.65, ease: "power3.out" }) : () => {};
    const tr = tap ? gsap.quickTo(tap, "rotation", { duration: 0.5, ease: "power2.out" }) : () => {};
    // quickTo can't drive the "scale" shorthand, so tween only when the state flips
    let shrunk = false;
    const ts = (v: number) => {
      if (!inner || shrunk === v < 1) return;
      shrunk = v < 1;
      gsap.to(inner, { scale: v, duration: 0.35, ease: "power2.out", overwrite: true });
    };
    let lastX = 0;
    let straighten: ReturnType<typeof gsap.delayedCall> | null = null;
    const interactive = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest("a, button:not([data-follower]), [role='radio'], input, select, textarea");

    const onMove = (e: PointerEvent) => {
      const r = panel.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      moves.forEach(([mx, my, f]) => {
        mx(nx * f * 2);
        my(ny * f * 2);
      });

      if (!tap) return;
      // Offset from the disc's resting centre (its rect minus the current translation)
      const b = tap.getBoundingClientRect();
      const restX = b.left + b.width / 2 - (gsap.getProperty(tap, "x") as number);
      const restY = b.top + b.height / 2 - (gsap.getProperty(tap, "y") as number);
      tx(e.clientX - restX);
      ty(e.clientY - restY);
      const vx = e.clientX - lastX;
      lastX = e.clientX;
      tr(Math.max(-28, Math.min(28, vx * 1.6)));
      straighten?.kill();
      straighten = gsap.delayedCall(0.14, () => tr(0));
      // Make way for real controls under the pointer
      ts(interactive(e.target) ? 0.3 : 1);
    };
    const onEnter = (e: PointerEvent) => {
      lastX = e.clientX;
      if (tap) tap.style.pointerEvents = "none";
      panel.dataset.following = "";
    };
    const onLeave = () => {
      moves.forEach(([mx, my]) => (mx(0), my(0)));
      tx(0);
      ty(0);
      tr(0);
      ts(1);
      if (tap) tap.style.pointerEvents = "";
      delete panel.dataset.following;
    };
    // While following, a click anywhere on the hero (except real controls) tastes the next flavour
    const onClick = (e: MouseEvent) => {
      if (panel.dataset.following === undefined || interactive(e.target)) return;
      goNext.current();
      if (inner) gsap.fromTo(inner, { scale: 0.86 }, { scale: 1, duration: 0.45, ease: "back.out(3)" });
    };
    panel.addEventListener("pointermove", onMove);
    panel.addEventListener("pointerenter", onEnter);
    panel.addEventListener("pointerleave", onLeave);
    panel.addEventListener("click", onClick);
    return () => {
      straighten?.kill();
      panel.removeEventListener("pointermove", onMove);
      panel.removeEventListener("pointerenter", onEnter);
      panel.removeEventListener("pointerleave", onLeave);
      panel.removeEventListener("click", onClick);
    };
  }, []);

  // Entrance
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-line]", { yPercent: 40, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out" });
      gsap.from(bottleRefs.current[0], { yPercent: 12, rotate: 10, opacity: 0, duration: 1.1, ease: "back.out(1.4)", delay: 0.15 });
      gsap.from("[data-hero-ui]", { y: 20, opacity: 0, duration: 0.7, stagger: 0.08, delay: 0.5, ease: "power2.out", clearProps: "transform,opacity" });
    }, panelRef);
    return () => ctx.revert();
  }, []);

  const onRadioKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = (i + map[e.key] + products.length) % products.length;
    select(n);
    radioRefs.current[n]?.focus();
  };

  const nextIndex = (active + 1) % products.length;
  useEffect(() => {
    goNext.current = () => select(nextIndex);
  }, [select, nextIndex]);

  return (
    <section aria-labelledby="hero-title" className="relative h-[100svh] min-h-[600px] p-[var(--gutter)] md:min-h-[680px]">
      <div
        ref={panelRef}
        className="panel relative h-full overflow-hidden group/hero transition-colors duration-700 data-[following]:cursor-pointer"
        style={{ backgroundColor: theme.bg, color: theme.ink }}
      >
        <PanelNotch />

        {/* Paint splatter texture */}
        <div aria-hidden className="splatter absolute inset-x-0 bottom-0 h-[48%] text-paper opacity-35" />

        {/* Oversized headline behind the bottle */}
        <div ref={(el) => { parallaxRefs.current.title = el; }} className="absolute inset-0 flex items-start justify-center pt-[15svh] md:items-center md:pt-0">
          <h1 id="hero-title" className="hand relative select-none text-center leading-[0.82]">
            <svg aria-hidden viewBox="0 0 600 30" className="mx-auto mb-[1.5vh] h-[2.2vw] min-h-3 w-[78%]" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
              <path d="M6 22C120 8 330 4 594 12" />
            </svg>
            <span data-hero-line className="block text-[clamp(4.6rem,15.5vw,15rem)]">Le goût</span>
            <span data-hero-line className="block text-[clamp(4.6rem,15.5vw,15rem)]">du Congo.</span>
            <svg aria-hidden viewBox="0 0 600 30" className="mx-auto mt-[1vh] h-[2.2vw] min-h-3 w-[86%]" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
              <path d="M8 10c160 14 400 16 586 4" />
            </svg>
          </h1>
          <Splash className="absolute left-[24%] top-[20%] hidden w-[5vw] min-w-10 opacity-90 md:block" />
          <Splash className="absolute right-[22%] top-[24%] hidden w-[3.4vw] min-w-8 -scale-x-100 opacity-90 md:block" />
        </div>

        {/* Fruit decor for the displayed flavour */}
        <div ref={(el) => { decorRef.current = el; parallaxRefs.current.decor = el; }} aria-hidden className="pointer-events-none absolute inset-0">
          {product.decor.map((key, i) => {
            const f = fruits[key];
            const s = SLOTS[i];
            return (
              <div
                key={`${product.slug}-${key}-${i}`}
                data-piece
                className="absolute left-[var(--ml)] top-[var(--mt)] md:left-[var(--l)] md:top-[var(--t)]"
                style={{ ["--l" as string]: s.left, ["--t" as string]: s.top, ["--ml" as string]: s.mLeft, ["--mt" as string]: s.mTop, width: s.size }}
              >
                <div className="bob" style={{ ["--r" as string]: `${s.r}deg`, ["--d" as string]: s.d, ["--delay" as string]: `${i * -0.8}s` }}>
                  <Image src={f.src} width={f.width} height={f.height} alt="" sizes="250px" className="h-auto w-full" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottles — all five share one crop box so they line up exactly */}
        <div ref={(el) => { parallaxRefs.current.bottle = el; }} className="pointer-events-none absolute inset-0 flex items-end justify-center pb-[19svh] md:items-center md:pb-0">
          <div className="float relative h-[min(45svh,400px)] md:h-[min(70svh,720px)] md:max-h-[86%]" style={{ aspectRatio: "380 / 1504", ["--tilt" as string]: "-7deg" }}>
            {products.map((p, i) => (
              <div key={p.slug} ref={(el) => { bottleRefs.current[i] = el; }} className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                <Image
                  src={p.bottle.src}
                  width={p.bottle.width}
                  height={p.bottle.height}
                  alt={i === active ? p.bottle.alt : ""}
                  aria-hidden={i !== active}
                  priority={i === 0}
                  loading={i === 0 ? undefined : "eager"}
                  sizes="(max-width: 768px) 140px, 200px"
                  className="h-full w-full object-contain drop-shadow-[0_40px_40px_rgba(42,26,14,.28)]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Supporting copy — desktop left column */}
        <div data-hero-ui className="absolute left-[4%] top-[30%] hidden max-w-[14rem] xl:block">
          <p className="eyebrow mb-3 opacity-80">Jus de fruits · Kimpese, RDC</p>
          <p className="text-[1.0625rem] font-semibold leading-snug">Découvrez les saveurs d’Elembo, des jus élaborés au Kongo-Central.</p>
          <Link href="#saveurs" className="mt-4 inline-flex items-center gap-2 border-b-2 border-current pb-0.5 text-sm font-bold uppercase tracking-wider">
            Voir les 5 saveurs
          </Link>
        </div>

        {/* Tap to taste the next flavour */}
        <button
          ref={tapRef}
          type="button"
          data-hero-ui
          data-follower
          onClick={() => select(nextIndex)}
          className="group absolute bottom-[calc(var(--gutter)+96px)] right-[4%] z-20 aspect-square w-[clamp(88px,10vw,144px)] rounded-full md:bottom-auto md:right-[16%] md:top-[56%]"
          aria-label={`Goûter la saveur suivante : ${products[nextIndex].name}`}
        >
          <span
            ref={tapInnerRef}
            className="flex h-full w-full flex-col items-center justify-center rounded-full text-ink shadow-[0_10px_30px_-10px_rgba(42,26,14,.5)] transition-colors duration-700"
            style={{ backgroundColor: theme.accent === "#FFFFFF" ? "#FFF6E6" : theme.accent }}
          >
            <span aria-hidden className="absolute inset-0 rounded-full border-2 border-current opacity-0 group-hover:animate-[pulse-ring_1.2s_ease-out_infinite] group-data-[following]/hero:animate-[pulse-ring_1.6s_ease-out_infinite]" />
            <span className="display text-[clamp(1.5rem,2.4vw,2.2rem)]">Goûter</span>
            <span className="mt-1 text-[0.6875rem] font-bold uppercase tracking-wider opacity-70">saveur suivante</span>
          </span>
        </button>

        {/* Flavour selector — bottom left */}
        <div data-hero-ui className="absolute bottom-[calc(var(--gutter)+4px)] left-[calc(var(--gutter)+4px)] right-[calc(var(--gutter)+4px)] md:bottom-[calc(var(--gutter)+78px)] md:right-auto min-[1400px]:bottom-[calc(var(--gutter)+4px)]">
          <div className="flex items-end gap-3">
            <span className="display text-[1.35rem]">Saveur :</span>
            <span aria-live="polite" className="hand min-w-[9.5rem] border-b-2 border-current pb-0.5 text-[1.6rem] leading-none md:text-[1.8rem]">
              {products[active].name}
            </span>
          </div>
          <div role="radiogroup" aria-label="Choisir une saveur" className="mt-3 flex gap-2">
            {products.map((p, i) => (
              <button
                key={p.slug}
                ref={(el) => { radioRefs.current[i] = el; }}
                type="button"
                role="radio"
                aria-checked={i === active}
                tabIndex={i === active ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(e) => onRadioKey(e, i)}
                className={`relative h-12 w-12 overflow-hidden rounded-full border-2 transition-transform hover:-translate-y-0.5 ${i === active ? "scale-110 border-current" : "border-transparent"}`}
                style={{ backgroundColor: p.theme.bg, boxShadow: "inset 0 0 0 2px rgba(255,250,241,.85)" }}
              >
                <span className="sr-only">{p.name}</span>
                <Image src={p.bottle.small ?? p.bottle.src} alt="" width={190} height={752} sizes="24px" className="absolute left-1/2 top-[6%] h-[190%] w-auto -translate-x-1/2" />
              </button>
            ))}
          </div>
        </div>

        {/* Flavour tagline — bottom right (desktop) */}
        <div
          ref={textRef}
          className="absolute bottom-[calc(var(--gutter)+70px)] right-[var(--gutter)] hidden max-w-[19rem] rounded-2xl px-4 py-3 text-right transition-colors duration-700 lg:block min-[1400px]:bottom-[var(--gutter)]"
          style={{ backgroundColor: theme.bg }}
        >
          <p className="hand text-[1.75rem] leading-tight">{product.tagline}</p>
          <p className="mt-1 text-[0.9375rem] font-medium leading-snug opacity-90">{product.description}</p>
        </div>
      </div>
    </section>
  );
}
