/**
 * Points of sale, grouped by city then retailer type.
 * Source: elembo-rdc.com/points-de-vente (March 2026) and the Elembo B2B flyer.
 *
 * `coordinates` stays null until someone confirms a GPS position on site:
 * the map only shows markers for verified coordinates.
 * `prices` stays empty until location-specific prices are supplied.
 */

export type RetailerType =
  | "supermarche"
  | "depositaire"
  | "detaillant"
  | "espace-elembo"
  | "hotel"
  | "ecole";

export const retailerTypeLabels: Record<RetailerType, string> = {
  supermarche: "Supermarchés",
  depositaire: "Dépositaires",
  detaillant: "Détaillants privés",
  "espace-elembo": "Espaces Elembo",
  hotel: "Hôtels",
  ecole: "Écoles",
};

export type Location = {
  name: string;
  type: RetailerType;
  address: string;
  /** Landmark ("réf.") as given by Elembo — how people actually find places. */
  landmark?: string;
  commune?: string;
  coordinates: { lat: number; lng: number } | null;
  prices: { label: string; price: string }[];
};

export type Phone = { label: string; number: string };

export type City = {
  slug: "kinshasa" | "kimpese" | "matadi";
  name: string;
  province: string;
  intro: string;
  locations: Location[];
  /** Retailer categories announced but without a confirmed address yet. */
  upcoming: { type: RetailerType; note: string }[];
  delivery: { text: string; phones: Phone[] };
  color: string;
};

export const cities: City[] = [
  {
    slug: "kinshasa",
    name: "Kinshasa",
    province: "Ville-province de Kinshasa",
    intro:
      "Dans la capitale, Elembo se trouve en supermarché, chez nos dépositaires et chez des détaillants de quartier. Vous pouvez aussi vous faire livrer.",
    color: "#F2701D",
    locations: [
      {
        name: "Swissmart GB",
        type: "supermarche",
        commune: "Gombe",
        address: "Gombe, Kinshasa",
        landmark: "Réf. : UNHCR, en face de Mango",
        coordinates: null,
        prices: [],
      },
      {
        name: "Dépôt Elembo Kintambo",
        type: "depositaire",
        commune: "Kintambo",
        address: "Av. Boma n° 7c, Q. Lisala, Kintambo, Kinshasa",
        landmark: "Réf. : Staff Bronchant",
        coordinates: null,
        prices: [],
      },
      {
        name: "Dépositaire Kasa-Vubu",
        type: "depositaire",
        commune: "Kasa-Vubu",
        address: "Rue Kasangulu 23, Kasa-Vubu, Kinshasa",
        landmark: "Réf. : direction Birmanie, Légion PIR",
        coordinates: null,
        prices: [],
      },
      {
        name: "Détaillant Mont-Ngafula",
        type: "detaillant",
        commune: "Mont-Ngafula",
        address: "Av. Kikwit 2 n° 44/C, quartier Mazamba, Mont-Ngafula, Kinshasa",
        landmark: "Réf. : arrêt Habitat",
        coordinates: null,
        prices: [],
      },
      {
        name: "Carine Bondo",
        type: "detaillant",
        commune: "Bandalungwa",
        address: "Av. Kinvula n° 100, Bandal, Kinshasa",
        coordinates: null,
        prices: [],
      },
    ],
    upcoming: [
      { type: "supermarche", note: "D’autres supermarchés vont suivre." },
      { type: "ecole", note: "Partenariats en cours." },
    ],
    delivery: {
      text: "Livraison à Kinshasa : appelez pour passer commande.",
      phones: [
        { label: "Commandes Kinshasa", number: "+243894830974" },
        { label: "Commandes Kinshasa", number: "+243819538261" },
      ],
    },
  },
  {
    slug: "kimpese",
    name: "Kimpese",
    province: "Kongo-Central",
    intro:
      "Kimpese, c’est chez nous : la fabrique Elembo est installée ici. Retrouvez nos jus dans nos espaces et chez nos partenaires en ville.",
    color: "#357A32",
    locations: [
      {
        name: "Espace Elembo",
        type: "espace-elembo",
        address: "Av. Kadiazila 21, Kimpese",
        landmark: "Réf. : centre commercial, en face du Motel Dolbi",
        coordinates: null,
        prices: [],
      },
      {
        name: "Espace Nzilco",
        type: "detaillant",
        address: "Av. Mansa 1, Kimpese",
        coordinates: null,
        prices: [],
      },
      {
        name: "Hôtel Mont Sinaï",
        type: "hotel",
        address: "Av. Makanga, Quartier 4 IME, Kimpese",
        coordinates: null,
        prices: [],
      },
    ],
    upcoming: [],
    delivery: {
      text: "Livraison à Kimpese, Lukala, Kisantu et Matadi.",
      phones: [{ label: "Livraison Kongo-Central", number: "+243820584606" }],
    },
  },
  {
    slug: "matadi",
    name: "Matadi",
    province: "Kongo-Central",
    intro:
      "À Matadi, Elembo est disponible en Ville Basse. La livraison est assurée depuis Kimpese.",
    color: "#F6C928",
    locations: [
      {
        name: "Point de vente Kalankala",
        type: "detaillant",
        address: "Quartier Kalankala, Ville Basse, Matadi",
        landmark: "Réf. : entrée 4 maisons, en face de l’usine de l’eau pure",
        coordinates: null,
        prices: [],
      },
    ],
    upcoming: [],
    delivery: {
      text: "Livraison à Matadi depuis Kimpese.",
      phones: [{ label: "Livraison Kongo-Central", number: "+243820584606" }],
    },
  },
];

export const getCity = (slug: string) => cities.find((c) => c.slug === slug);

/** Kept apart from the store directory, as requested in the UX review. */
export const events = [
  {
    title: "SIDANSE",
    text: "Elembo est sponsor de SIDANSE, une compétition de danse à Kinshasa.",
  },
  {
    title: "Clubs et partenariats",
    text: "Des partenariats avec des clubs et des écoles sont en cours de préparation.",
  },
];

/** Google Maps search link built from the written address (no coordinates needed). */
export const directionsUrl = (loc: Location) =>
  loc.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates.lat},${loc.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${loc.name}, ${loc.address}, RDC`,
      )}`;
