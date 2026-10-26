/**
 * Brand-wide information. Sources: elembo-rdc.com (pages "A propos",
 * "Produits", "Points de vente", "Contact") and the Elembo B2B flyer.
 */

export const site = {
  name: "Elembo",
  url: "https://elembo-rdc.com",
  baseline: "Jus na biso",
  description:
    "Elembo, jus de fruits élaborés à Kimpese, au Kongo-Central (RDC). Orange, ananas, mangue et mélanges, en bouteilles de verre de 30 cl.",
  email: "info@elembo-rdc.com",
  office: {
    label: "ONGD Elembo",
    address: "Av. Bundimbu, Q. Lukengezi, Kimpese, Kongo-Central, RDC",
  },
};

export type Contact = {
  role: string;
  name?: string;
  phones: string[];
  email?: string;
};

export const contacts: Contact[] = [
  { role: "Commandes à Kinshasa", phones: ["+243894830974", "+243819538261"] },
  { role: "Livraison Kimpese, Lukala, Kisantu, Matadi", phones: ["+243820584606"] },
  { role: "Directeur exécutif", name: "Alexandre Isekama", phones: ["+243820584606"], email: "info@elembo-rdc.com" },
  { role: "CEO Elembo", name: "Christopher Inembe", phones: ["+243987399531", "+41792095572"] },
  { role: "Marketing", phones: ["+243823484993"] },
];

/**
 * WhatsApp is only offered once a number is confirmed as a WhatsApp line.
 * Set it (international format, digits only) to enable WhatsApp buttons.
 */
export const whatsappNumber: string | null = null;

export const socials = [
  { name: "Instagram", handle: "@jus_elembo", url: "https://www.instagram.com/jus_elembo/" },
  { name: "TikTok", handle: "@jus.elembo6", url: "https://www.tiktok.com/@jus.elembo6" },
  { name: "Facebook", handle: "Jus Elembo", url: "https://www.facebook.com/profile.php?id=61557771192085" },
] as const;

export const association = {
  name: "Association des Amis d’Elembo (AdEL)",
  city: "Lausanne, Suisse",
  url: "https://adelembo.ch/",
};

export const nav = [
  { href: "/produits", label: "Produits" },
  { href: "/notre-histoire", label: "Notre histoire" },
  { href: "/points-de-vente", label: "Points de vente" },
  { href: "/contact", label: "Contact" },
];

/** "+243894830974" → "+243 894 830 974", "+41792095572" → "+41 79 209 55 72" */
export function formatPhone(n: string) {
  if (n.startsWith("+243")) return `+243 ${n.slice(4, 7)} ${n.slice(7, 10)} ${n.slice(10)}`;
  if (n.startsWith("+41")) return `+41 ${n.slice(3, 5)} ${n.slice(5, 8)} ${n.slice(8, 10)} ${n.slice(10)}`;
  return n;
}
