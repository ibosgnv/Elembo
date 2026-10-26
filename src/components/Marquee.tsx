import { Fragment } from "react";
import { SunScribble } from "./Icons";

/**
 * Looping typographic strip. The text is duplicated once for a seamless
 * loop; the copy is hidden from assistive tech. With reduced motion the
 * strip simply stands still.
 */
export function Marquee({
  items,
  className = "",
  tilt = -2,
  duration = 38,
  reverse = false,
}: {
  items: string[];
  className?: string;
  tilt?: number;
  duration?: number;
  reverse?: boolean;
}) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <Fragment key={i}>
          <span className="whitespace-nowrap px-[0.35em]">{t}</span>
          <SunScribble className="mx-[0.25em] h-[0.7em] w-[0.7em] shrink-0 opacity-90" />
        </Fragment>
      ))}
    </div>
  );

  return (
    <div className={`marquee-wrap relative overflow-hidden ${className}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <p className="sr-only">{items.join(", ")}</p>
      <div className="marquee" data-direction={reverse ? "reverse" : undefined} style={{ ["--marquee-duration" as string]: `${duration}s` }} aria-hidden>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
