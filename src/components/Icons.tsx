import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const IconInstagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);

export const IconTiktok = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 3c.4 2.6 2.2 4.4 5 4.6" />
  </svg>
);

export const IconFacebook = (p: P) => (
  <svg {...base(p)}>
    <path d="M15 3h-2.2A3.8 3.8 0 0 0 9 6.8V10H6.5v3.4H9V21h3.4v-7.6H15l.5-3.4h-3.1V7.3c0-.6.4-1 1-1H15z" />
  </svg>
);

export const IconPhone = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

export const IconMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const IconPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const IconArrow = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8h16M4 16h11" />
  </svg>
);

export const IconInfo = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 11v6M12 7.5v.01" strokeWidth={2.6} />
  </svg>
);

export const IconTruck = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);

export const IconWhatsapp = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
    <path d="M9 9.5c.3 2.2 2.3 4.3 4.6 4.8l1.2-1.2 1.7.8c-.2 1-1 1.7-2 1.7A6.5 6.5 0 0 1 8 9.1c0-1 .7-1.8 1.7-2l.8 1.7z" />
  </svg>
);

/** Hand-drawn sun, echoing the rays of the Elembo logo. Original drawing. */
export const SunScribble = (p: P) => (
  <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={6} strokeLinecap="round" aria-hidden {...p}>
    <path d="M60 8v18M60 94v18M8 60h18M94 60h18M23 23l12 12M85 85l12 12M97 23 85 35M35 85 23 97" />
    <path d="M60 42c11 0 19 7 18 18-1 10-9 17-19 16-10 0-17-8-16-18 1-9 8-16 17-16z" strokeWidth={5} />
  </svg>
);

/** Loose hand-drawn underline */
export const Squiggle = (p: P) => (
  <svg viewBox="0 0 300 24" fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" aria-hidden preserveAspectRatio="none" {...p}>
    <path d="M4 15c40-9 70-10 104-4 30 5 52 6 86-2 34-7 66-7 102 1" />
  </svg>
);

/** Little juice splash marks */
export const Splash = (p: P) => (
  <svg viewBox="0 0 80 60" fill="currentColor" aria-hidden {...p}>
    <path d="M10 44c-6-10 2-22 12-18 6 2 7 10 2 15-3 3-9 7-14 3z" />
    <path d="M36 20c-2-7 3-14 10-12 5 2 5 8 1 11-3 3-9 4-11 1z" />
    <circle cx="62" cy="34" r="6" />
    <circle cx="70" cy="14" r="3.5" />
  </svg>
);
