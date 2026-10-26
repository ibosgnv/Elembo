import { bottles, type Asset, type FruitKey } from "./assets";

/**
 * Product catalogue. Facts here are limited to what elembo-rdc.com/produits
 * and the client brief state. Anything not yet confirmed lives in
 * `OPEN_QUESTIONS.md`, never in this file.
 */

export type FlavourTheme = {
  /** Panel background */
  bg: string;
  /** Text drawn directly on the panel */
  ink: string;
  /** Secondary accent (buttons, swatches) */
  accent: string;
};

export type Product = {
  slug: "orange" | "ananas" | "mangue" | "orange-ananas" | "mangue-ananas";
  name: string;
  /** Label wording as printed on the bottle */
  label: string;
  fruits: string[];
  tagline: string;
  description: string;
  bottle: Asset;
  theme: FlavourTheme;
  /** Fruit pieces floating around the bottle in the hero */
  decor: FruitKey[];
};

export const products: Product[] = [
  {
    slug: "orange",
    name: "Orange",
    label: "Jus d’orange",
    fruits: ["Orange"],
    tagline: "Le classique ensoleillé.",
    description:
      "Un jus d’orange élaboré à Kimpese avec des oranges du Kongo-Central, pour une pause fraîche à tout moment de la journée.",
    bottle: bottles.orange,
    theme: { bg: "#F2701D", ink: "#2A1A0E", accent: "#FFD23F" },
    decor: ["orangeHalf", "orangeWedge", "leaf1", "leaf3", "droplet2"],
  },
  {
    slug: "ananas",
    name: "Ananas",
    label: "Jus d’ananas",
    fruits: ["Ananas"],
    tagline: "Doré comme une fin d’après-midi.",
    description:
      "Un jus d’ananas préparé dans notre fabrique de Kimpese, à partir de fruits de la région.",
    bottle: bottles.ananas,
    theme: { bg: "#F6C928", ink: "#2A1A0E", accent: "#FFFFFF" },
    decor: ["pineappleWedge", "pineappleCrown", "leaf4", "droplet1", "drip1"],
  },
  {
    slug: "mangue",
    name: "Mangue",
    label: "Jus de mangue",
    fruits: ["Mangue"],
    tagline: "La saison des mangues, en bouteille.",
    description:
      "Un jus de mangue né des récoltes du Kongo-Central, disponible quand la saison des mangues le permet.",
    bottle: bottles.mangue,
    theme: { bg: "#FFA329", ink: "#2A1A0E", accent: "#FFF1D6" },
    decor: ["mangoCut", "mangoCube1", "mangoCube4", "leaf2", "droplet2"],
  },
  {
    slug: "orange-ananas",
    name: "Orange–Ananas",
    label: "Orange-Ananas",
    fruits: ["Orange", "Ananas"],
    tagline: "Deux fruits, un même soleil.",
    description:
      "Le mélange de l’orange et de l’ananas, deux fruits que nous travaillons avec les producteurs du Kongo-Central.",
    bottle: bottles["orange-ananas"],
    theme: { bg: "#E8492E", ink: "#2A1A0E", accent: "#FFD23F" },
    decor: ["orangeWedge", "pineappleWedge", "leaf5", "droplet1", "drip2"],
  },
  {
    slug: "mangue-ananas",
    name: "Mangue–Ananas",
    label: "Mangue-Ananas",
    fruits: ["Mangue", "Ananas"],
    tagline: "Le duo tropical de Kimpese.",
    description:
      "La mangue et l’ananas réunis dans une même bouteille, selon les fruits disponibles au fil des saisons.",
    bottle: bottles["mangue-ananas"],
    theme: { bg: "#357A32", ink: "#FFF6E6", accent: "#FFC93C" },
    decor: ["mangoCut", "pineappleCrown", "mangoCube3", "leaf1", "droplet2"],
  },
];

/** Facts that apply to the whole range (source: elembo-rdc.com/produits). */
export const rangeFacts = {
  format: "Bouteille en verre de 30 cl",
  seasonal:
    "Les saveurs disponibles peuvent varier selon la saison : chaque fruit a la sienne.",
  conservation:
    "Grâce à une pasteurisation maîtrisée, nos jus se conservent jusqu’à un an sans conservateur, à l’abri de la chaleur et du soleil.",
  control: "Notre usine et nos jus sont contrôlés et attestés par l’Office Congolais de Contrôle (OCC).",
  returnSystem:
    "Les bouteilles vides sont récupérées et recyclées grâce à un système de retour des vidanges.",
};

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
