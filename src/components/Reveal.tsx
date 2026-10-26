"use client";

import { useEffect, useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/motion";

type RevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  /** Animate direct children one after another instead of the block as a whole */
  stagger?: boolean;
  y?: number;
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, "children">;

/**
 * Scroll reveal. Content is fully visible in the HTML; GSAP only adds a
 * "from" state once it has loaded, so a failed script never hides anything.
 */
export function Reveal<T extends ElementType = "div">({ as, children, stagger, y = 36, delay = 0, ...rest }: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const targets = stagger ? Array.from(el.children) : [el];
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 0.9,
        delay,
        ease: "power3.out",
        stagger: stagger ? 0.08 : 0,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [stagger, y, delay]);

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
