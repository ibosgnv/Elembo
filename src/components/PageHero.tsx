import Image from "next/image";
import type { ReactNode } from "react";
import { fruits, type FruitKey } from "@/data/assets";
import { Splash } from "./Icons";

/** Rounded colour panel that opens every inner page, in the spirit of the home hero. */
export function PageHero({
  eyebrow,
  title,
  intro,
  bg,
  ink = "var(--cream)",
  decor = [],
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  bg: string;
  ink?: string;
  decor?: FruitKey[];
  children?: ReactNode;
}) {
  const spots = [
    "right-[4%] top-[18%] w-[clamp(90px,14vw,210px)] rotate-12",
    "right-[20%] bottom-[8%] w-[clamp(70px,10vw,150px)] -rotate-12",
    "left-[58%] top-[16%] w-[clamp(40px,5vw,80px)]",
  ];
  return (
    <section className="p-[var(--gutter)]">
      <div className="panel relative overflow-hidden px-6 pb-14 pt-36 md:px-14 md:pb-20 md:pt-44" style={{ backgroundColor: bg, color: ink }}>
        <div aria-hidden className="splatter absolute inset-x-0 bottom-0 h-1/2 text-paper opacity-25" />
        {decor.map((k, i) => {
          const f = fruits[k];
          return (
            <div key={k} aria-hidden className={`pointer-events-none absolute hidden sm:block ${spots[i]}`}>
              <Image src={f.src} width={f.width} height={f.height} alt="" sizes="210px" className="bob h-auto w-full" style={{ ["--delay" as string]: `${i * -1.3}s` }} />
            </div>
          );
        })}
        <Splash aria-hidden className="absolute left-[46%] top-[30%] hidden w-14 opacity-70 md:block" />
        <div className="relative max-w-[56rem]">
          <p className="hand text-[1.9rem]">{eyebrow}</p>
          <h1 className="display mt-1 text-[clamp(3.6rem,10vw,9.5rem)]">{title}</h1>
          {intro && <div className="mt-6 max-w-[40rem] text-[1.125rem] font-medium leading-relaxed opacity-95">{intro}</div>}
          {children}
        </div>
      </div>
    </section>
  );
}
