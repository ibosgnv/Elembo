import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "./PageHero";
import { Reveal } from "./Reveal";
import { IconArrow, IconPhone, IconPin, IconTruck } from "./Icons";
import { cities, directionsUrl, getCity, retailerTypeLabels, type City, type Location, type RetailerType } from "@/data/locations";
import { formatPhone } from "@/data/site";

export function cityMetadata(slug: City["slug"]): Metadata {
  const city = getCity(slug)!;
  return {
    title: `Elembo à ${city.name}`,
    description: `Adresses des points de vente Elembo à ${city.name} et contacts de livraison.`,
  };
}

/** One page per city; each city route renders this with its slug. */
export function CityPage({ slug }: { slug: City["slug"] }) {
  const city = getCity(slug)!;

  const groups = city.locations.reduce<Partial<Record<RetailerType, Location[]>>>((acc, l) => {
    (acc[l.type] ??= []).push(l);
    return acc;
  }, {});
  const hasVerifiedPins = city.locations.some((l) => l.coordinates);
  const others = cities.filter((c) => c.slug !== city.slug);

  return (
    <>
      <PageHero
        eyebrow={city.province}
        title={city.name}
        bg={city.color}
        ink={city.slug === "kimpese" ? "var(--cream)" : "var(--ink)"}
        decor={city.slug === "kimpese" ? ["mangoCut", "leaf1"] : city.slug === "matadi" ? ["pineappleWedge", "leaf3"] : ["orangeHalf", "leaf5"]}
        intro={<p>{city.intro}</p>}
      >
        <nav aria-label="Fil d’Ariane" className="mt-8 text-sm font-semibold">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/points-de-vente" className="underline">Points de vente</Link> /
            </li>
            <li aria-current="page">{city.name}</li>
          </ol>
        </nav>
      </PageHero>

      <section aria-labelledby="adresses-title" className="px-[var(--gutter)] py-[clamp(3.5rem,7vw,6rem)]">
        <div className="mx-auto grid max-w-[1360px] gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <h2 id="adresses-title" className="display text-[clamp(2.8rem,6vw,5rem)]">
              Les adresses
            </h2>
            <div className="mt-8 space-y-12">
              {(Object.keys(groups) as RetailerType[]).map((type) => (
                <Reveal key={type} as="section" aria-labelledby={`g-${type}`}>
                  <h3 id={`g-${type}`} className="eyebrow border-b-2 border-ink/15 pb-3 text-ink-soft">
                    {retailerTypeLabels[type]}
                  </h3>
                  <ul className="mt-4 grid gap-4 md:grid-cols-2">
                    {groups[type]!.map((l) => (
                      <li key={l.name} className="panel flex flex-col bg-paper p-6">
                        <p className="text-[1.3rem] font-extrabold leading-tight">{l.name}</p>
                        <p className="mt-2 flex gap-2 text-ink-soft">
                          <IconPin width={18} height={18} className="mt-1 shrink-0" />
                          <span>
                            {l.address}
                            {l.landmark && <span className="block text-sm">{l.landmark}</span>}
                          </span>
                        </p>
                        {l.prices.length > 0 && (
                          <ul className="mt-3 text-sm">
                            {l.prices.map((p) => (
                              <li key={p.label}>
                                {p.label} : <strong>{p.price}</strong>
                              </li>
                            ))}
                          </ul>
                        )}
                        <a
                          href={directionsUrl(l)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline mt-5 self-start !min-h-11 !px-4 !text-[0.8125rem] text-ink"
                        >
                          <span>Itinéraire</span> <IconArrow width={16} height={16} />
                          <span className="sr-only">vers {l.name} dans Google Maps (nouvel onglet)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
              {city.upcoming.length > 0 && (
                <Reveal as="section" aria-labelledby="bientot">
                  <h3 id="bientot" className="eyebrow border-b-2 border-ink/15 pb-3 text-ink-soft">
                    Bientôt
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {city.upcoming.map((u) => (
                      <li key={u.type} className="text-ink-soft">
                        <strong className="text-ink">{retailerTypeLabels[u.type]} :</strong> {u.note}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="panel on-dark bg-ink p-7 text-cream">
              <IconTruck width={30} height={30} className="text-gold" />
              <h2 className="display mt-3 text-[2.4rem]">Livraison</h2>
              <p className="mt-2 opacity-90">{city.delivery.text}</p>
              <ul className="mt-4 space-y-2">
                {city.delivery.phones.map((p) => (
                  <li key={p.number}>
                    <a href={`tel:${p.number}`} className="btn btn-cream w-full !justify-start">
                      <IconPhone width={18} height={18} /> {formatPhone(p.number)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel bg-cream-deep p-6 text-sm text-ink-soft">
              <p className="font-extrabold text-ink">Carte et prix</p>
              {hasVerifiedPins ? null : (
                <p className="mt-2">
                  La carte interactive arrivera dès que les positions GPS des points de vente auront été vérifiées. En attendant, le bouton « Itinéraire » ouvre
                  une recherche par adresse.
                </p>
              )}
              <p className="mt-2">Les prix pratiqués peuvent varier d’un point de vente à l’autre : renseignez-vous sur place ou par téléphone.</p>
            </div>
            <div className="panel bg-paper p-6">
              <p className="font-extrabold">Autres villes</p>
              <ul className="mt-3 space-y-2">
                {others.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/points-de-vente/${c.slug}`} className="inline-flex min-h-11 items-center gap-2 font-semibold underline">
                      {c.name} <IconArrow width={16} height={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-[var(--gutter)] pb-[clamp(4rem,8vw,7rem)]">
        <Reveal className="panel mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-6 bg-gold p-8 md:p-12">
          <div>
            <h2 className="display text-[clamp(2.4rem,5vw,4rem)]">Vous tenez un commerce ?</h2>
            <p className="mt-2 max-w-[36rem]">Kiosque, bar, restaurant, hôtel ou supermarché : proposez Elembo à vos clients.</p>
          </div>
          <Link href="/contact?sujet=revendeur" className="btn btn-ink">
            Devenir revendeur <IconArrow width={18} height={18} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
