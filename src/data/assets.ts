/**
 * Central asset manifest.
 *
 * Every image used on the site is declared here once, with its intrinsic
 * size (so layout never shifts) and its provenance. Components import from
 * this file instead of hard-coding paths.
 *
 * Provenance values:
 * - "official"  : downloaded from elembo-rdc.com (brand-owned files)
 * - "mockup"    : generated marketing mockup supplied by the client
 * - "extracted" : cut out from a supplied mockup (see assets-source/README)
 * - "original"  : drawn/generated for this site (textures, accents)
 */

export type Provenance = "official" | "mockup" | "extracted" | "original";

export type Asset = {
  src: string;
  width: number;
  height: number;
  alt: string;
  provenance: Provenance;
  /** Smaller variant for mobile / thumbnails, same aspect ratio. */
  small?: string;
};

export const logo: Asset = {
  src: "/images/brand/elembo-logo.png",
  width: 1200,
  height: 413,
  alt: "Elembo",
  provenance: "official",
};

/** All five bottles share one crop box (380×1504) so they align when swapped. */
const bottle = (slug: string, label: string): Asset => ({
  src: `/images/bottles/${slug}.webp`,
  small: `/images/bottles/${slug}-sm.webp`,
  width: 380,
  height: 1504,
  alt: `Bouteille Elembo ${label}, 30 cl`,
  provenance: "mockup",
});

export const bottles = {
  orange: bottle("orange", "Jus d’orange"),
  ananas: bottle("ananas", "Jus d’ananas"),
  mangue: bottle("mangue", "Jus de mangue"),
  "orange-ananas": bottle("orange-ananas", "Orange–Ananas"),
  "mangue-ananas": bottle("mangue-ananas", "Mangue–Ananas"),
} as const;

const fruit = (name: string, width: number, height: number): Asset => ({
  src: `/images/fruit/${name}.webp`,
  width,
  height,
  alt: "",
  provenance: "extracted",
});

/** Individual pieces extracted from the supplied fruit composition. */
export const fruits = {
  orangeWhole: fruit("orange-whole", 437, 430),
  orangeHalf: fruit("orange-half", 397, 400),
  orangeWedge: fruit("orange-wedge", 449, 347),
  mangoCut: fruit("mango-cut", 464, 418),
  mangoCube1: fruit("mango-cube-1", 170, 156),
  mangoCube2: fruit("mango-cube-2", 101, 109),
  mangoCube3: fruit("mango-cube-3", 180, 160),
  mangoCube4: fruit("mango-cube-4", 146, 152),
  pineappleCrown: fruit("pineapple-crown", 450, 566),
  pineappleWedge: fruit("pineapple-wedge", 428, 423),
  leaf1: fruit("leaf-1", 259, 317),
  leaf2: fruit("leaf-2", 187, 137),
  leaf3: fruit("leaf-3", 186, 118),
  leaf4: fruit("leaf-4", 293, 226),
  leaf5: fruit("leaf-5", 354, 164),
  droplet1: fruit("droplet-1", 45, 47),
  droplet2: fruit("droplet-2", 67, 78),
  drip1: fruit("drip-1", 131, 152),
  drip2: fruit("drip-2", 95, 59),
} as const;

export type FruitKey = keyof typeof fruits;

export const campaign = {
  bannerTrio: {
    src: "/images/campaign/banner-trio.webp",
    small: "/images/campaign/banner-trio-sm.webp",
    width: 1774,
    height: 887,
    alt: "Trois bouteilles Elembo — orange, mangue et ananas — entourées de fruits frais",
    provenance: "mockup",
  },
  lifestyleCafe: {
    src: "/images/campaign/lifestyle-cafe.webp",
    small: "/images/campaign/lifestyle-cafe-sm.webp",
    width: 1536,
    height: 1024,
    alt: "Une bouteille de jus d’orange Elembo tenue en terrasse, sous le soleil",
    provenance: "mockup",
  },
} satisfies Record<string, Asset>;

/**
 * Authentic photographs published on elembo-rdc.com (shoot with the real,
 * current Elembo bottles). Captions must not claim who the people are.
 */
export const photos = {
  stand: {
    src: "/images/photos/img-0003.webp",
    small: "/images/photos/img-0003-sm.webp",
    width: 1600,
    height: 1063,
    alt: "Deux personnes trinquent avec des bouteilles Elembo devant un étal de fruits",
    provenance: "official",
  },
  drinking: {
    src: "/images/photos/img-0011.webp",
    small: "/images/photos/img-0011-sm.webp",
    width: 1600,
    height: 1068,
    alt: "Une jeune femme boit un jus Elembo au bord d’un terrain de sport",
    provenance: "official",
  },
  cheers: {
    src: "/images/photos/img-0015.webp",
    small: "/images/photos/img-0015-sm.webp",
    width: 1600,
    height: 1068,
    alt: "Deux bouteilles Elembo levées pour trinquer",
    provenance: "official",
  },
  founders: {
    src: "/images/photos/founders.webp",
    width: 902,
    height: 873,
    alt: "Christopher Inembe et Pauline, fondateurs d’Elembo, en t-shirts Elembo, une bouteille à la main",
    provenance: "official",
  },
  offering: {
    src: "/images/photos/img-0018.webp",
    small: "/images/photos/img-0018-sm.webp",
    width: 1600,
    height: 1068,
    alt: "Une jeune femme souriante tend une bouteille Elembo vers l’objectif",
    provenance: "official",
  },
} satisfies Record<string, Asset>;

/** Brand pictograms published on elembo-rdc.com. */
export const pictos = {
  mango: { src: "/images/brand/picto-bon-pour-la-sante.webp", width: 600, height: 600, alt: "", provenance: "official" },
  recycle: { src: "/images/brand/picto-photo2.webp", width: 600, height: 600, alt: "", provenance: "official" },
  factory: { src: "/images/brand/picto-qualite.webp", width: 600, height: 600, alt: "", provenance: "official" },
} satisfies Record<string, Asset>;

export const textures = {
  splatter: "/images/texture/splatter.svg",
};
