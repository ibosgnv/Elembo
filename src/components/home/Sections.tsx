import Image from "next/image";
import Link from "next/link";
import { campaign, photos, pictos } from "@/data/assets";
import { cities } from "@/data/locations";
import { socials } from "@/data/site";
import { Reveal } from "../Reveal";
import { IconArrow, IconFacebook, IconInstagram, IconPin, IconTiktok, Squiggle, SunScribble } from "../Icons";

/* ------------------------------------------------------------------ */
/* B. Editorial introduction on the three-bottle banner                */
/* ------------------------------------------------------------------ */
export function EditorialIntro() {
  return (
    <section aria-labelledby="intro-title" className="px-[var(--gutter)] pt-[clamp(3rem,7vw,6rem)]">
      <div className="mx-auto max-w-[1360px]">
        {/* One text block: above the image on small screens, inside its empty left area on desktop */}
        <Reveal className="relative">
          <div className="relative z-10 mb-6 lg:absolute lg:inset-y-0 lg:left-0 lg:mb-0 lg:flex lg:w-[44%] lg:items-center lg:pl-[5%]">
            <IntroText />
          </div>
          <div className="panel tilt-l relative overflow-hidden bg-[#fbe7b6] shadow-[0_30px_60px_-30px_rgba(42,26,14,.45)]">
            <Image
              src={campaign.bannerTrio.src}
              width={campaign.bannerTrio.width}
              height={campaign.bannerTrio.height}
              alt={campaign.bannerTrio.alt}
              sizes="(max-width: 1400px) 100vw, 1360px"
              className="untilt-l h-auto w-full scale-[1.04]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function IntroText() {
  return (
    <div className="max-w-[34rem]">
      <p className="hand text-[1.9rem] text-orange">Jus na biso</p>
      <h2 id="intro-title" className="display text-[clamp(2.8rem,5.2vw,5.2rem)]">
        Des fruits d’ici, pressés ici.
      </h2>
      <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-soft lg:text-[1.125rem]">
        Elembo, ce sont des jus d’orange, d’ananas et de mangue — seuls ou en duo — élaborés dans notre fabrique de Kimpese avec les fruits des producteurs du
        Kongo-Central. En bouteille de verre de 30 cl, pour toute la famille.
      </p>
      <Link href="/produits" className="btn btn-ink mt-7">
        Découvrir la gamme <IconArrow width={18} height={18} />
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* E. Lifestyle                                                        */
/* ------------------------------------------------------------------ */
export function Lifestyle() {
  return (
    <section aria-labelledby="pause-title" className="px-[var(--gutter)] py-[clamp(4rem,9vw,8rem)]">
      <Reveal className="panel tilt-r on-dark mx-auto grid max-w-[1360px] overflow-hidden bg-leaf-deep text-cream lg:grid-cols-[0.95fr_1.05fr]">
        <div className="untilt-r flex flex-col justify-center p-8 md:p-14">
          <p className="eyebrow text-gold">— Au soleil —</p>
          <h2 id="pause-title" className="display mt-4 text-[clamp(3rem,6.4vw,6.2rem)]">
            Une pause pleine de saveur.
          </h2>
          <p className="mt-6 max-w-[30rem] text-[1.0625rem] leading-relaxed opacity-90">
            À la terrasse, à la maison, après le sport ou à la sortie de l’école : une bouteille d’Elembo bien fraîche, et la journée prend des couleurs.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <SunScribble className="w-14 text-gold" />
            <p className="hand text-[1.9rem] leading-none">Tongo etani na mboka !</p>
          </div>
        </div>
        <div className="relative min-h-[320px] lg:min-h-[560px]">
          <Image
            src={campaign.lifestyleCafe.src}
            alt={campaign.lifestyleCafe.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 720px"
            // Keep the bottle (right of centre in the source) in frame on narrow crops
            className="object-cover object-[62%_50%]"
          />
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* F. Origin & production                                              */
/* ------------------------------------------------------------------ */
const steps = [
  {
    n: "01",
    title: "Les vergers du Kongo-Central",
    text: "Oranges, ananas et mangues viennent des producteurs de la région, au rythme des saisons.",
    picto: pictos.mango,
  },
  {
    n: "02",
    title: "La fabrique de Kimpese",
    text: "Construite fin 2024 et inaugurée en mai 2025, notre fabrique dispose d’une ligne complète de production de jus.",
    picto: pictos.factory,
  },
  {
    n: "03",
    title: "En verre, et ça revient",
    text: "Pasteurisés, nos jus se conservent jusqu’à un an sans conservateur. Les bouteilles vides sont récupérées et recyclées.",
    picto: pictos.recycle,
  },
];

export function Origin() {
  return (
    <section aria-labelledby="origine-title" className="px-[var(--gutter)] py-[clamp(4rem,9vw,8rem)]">
      <div className="mx-auto max-w-[1360px]">
        <Reveal className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="hand text-[1.9rem] text-leaf">Du verger à la bouteille</p>
            <h2 id="origine-title" className="display text-[clamp(3.2rem,7.5vw,7rem)]">
              Né à Kimpese.
            </h2>
          </div>
          <p className="max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-soft">
            En RDC, les fruits ne manquent pas, mais beaucoup se perdent faute d’acheteurs et de routes. Elembo achète et transforme ces fruits sur place, à
            Kimpese, pour proposer une alternative locale aux sodas.
          </p>
        </Reveal>

        <Reveal stagger as="ol" className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="panel relative bg-paper p-7 shadow-[0_1px_0_rgba(42,26,14,.08)]">
              <div className="flex items-start justify-between">
                <span className="display text-[3.5rem] text-orange">{s.n}</span>
                <Image src={s.picto.src} width={s.picto.width} height={s.picto.height} alt="" sizes="72px" className="h-[72px] w-[72px] rounded-2xl" />
              </div>
              <h3 className="mt-4 text-[1.375rem] font-extrabold leading-tight">{s.title}</h3>
              <p className="mt-2 text-ink-soft">{s.text}</p>
            </li>
          ))}
        </Reveal>

        <Reveal className="mt-6 grid gap-5 md:grid-cols-[1.25fr_0.75fr]">
          <figure className="panel relative aspect-[16/10] overflow-hidden">
            <Image src={photos.stand.src} alt={photos.stand.alt} fill sizes="(max-width: 768px) 100vw, 820px" className="object-cover" />
          </figure>
          <div className="panel flex flex-col justify-between bg-orange p-8 text-ink">
            <p className="hand text-[2rem] leading-tight">« Avec tout ce que le Congo possède comme fruits, ce sont ces jus que vous consommez ? »</p>
            <div>
              <p className="mt-6 text-[0.9375rem] opacity-95">Le constat qui a lancé Elembo, en 2020.</p>
              <Link href="/notre-histoire" className="mt-4 inline-flex items-center gap-2 border-b-2 border-current pb-0.5 text-sm font-bold uppercase tracking-wider">
                Lire notre histoire <IconArrow width={16} height={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* G. Where to find Elembo                                             */
/* ------------------------------------------------------------------ */
export function WhereToFind() {
  return (
    <section aria-labelledby="ou-title" className="px-[var(--gutter)] pb-[clamp(4rem,9vw,8rem)]">
      <div className="mx-auto max-w-[1360px]">
        <Reveal className="mb-10 text-center">
          <p className="hand text-[1.9rem] text-orange">Kinshasa · Kongo-Central</p>
          <h2 id="ou-title" className="display text-[clamp(3.2rem,7.5vw,7rem)]">
            Où nous trouver
          </h2>
          <Squiggle className="mx-auto mt-2 h-4 w-56 text-gold" />
        </Reveal>
        <Reveal stagger as="ul" className="grid gap-5 md:grid-cols-3">
          {cities.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/points-de-vente/${c.slug}`}
                className={`panel group relative flex min-h-[260px] flex-col justify-between overflow-hidden p-7 transition-transform duration-300 hover:-translate-y-1.5 md:min-h-[340px] ${i === 1 ? "md:translate-y-6 md:hover:translate-y-4" : ""}`}
                style={{ backgroundColor: c.color, color: c.slug === "kimpese" ? "var(--cream)" : "var(--ink)" }}
              >
                <span className="eyebrow flex items-center gap-2 opacity-90">
                  <IconPin width={18} height={18} /> {c.province}
                </span>
                <div>
                  <span className="display block text-[clamp(3.2rem,5.5vw,5.2rem)]">{c.name}</span>
                  <span className="mt-2 flex items-center justify-between text-[0.9375rem] font-semibold">
                    {c.locations.length} {c.locations.length > 1 ? "adresses" : "adresse"} · livraison
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink transition-transform group-hover:translate-x-1">
                      <IconArrow width={18} height={18} />
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* H. Social                                                           */
/* ------------------------------------------------------------------ */
const socialIcons = { Instagram: IconInstagram, TikTok: IconTiktok, Facebook: IconFacebook } as const;

export function Social() {
  const tiles = [photos.offering, photos.drinking, photos.cheers];
  return (
    <section aria-labelledby="social-title" className="px-[var(--gutter)] pb-[clamp(4rem,9vw,8rem)] pt-[clamp(2rem,5vw,4rem)]">
      <div className="mx-auto max-w-[1360px]">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="social-title" className="display text-[clamp(3rem,6.5vw,6rem)]">
            Sur nos réseaux
          </h2>
          <ul className="flex flex-wrap gap-2">
            {socials.map((s) => {
              const Icon = socialIcons[s.name];
              return (
                <li key={s.name}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline !min-h-11 !px-4 !text-[0.8125rem] text-ink">
                    <Icon width={18} height={18} />
                    <span>{s.handle}</span>
                    <span className="sr-only">(nouvel onglet)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>
        <Reveal stagger className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {tiles.map((t, i) => (
            <a
              key={t.src}
              href={socials[i % 2 === 0 ? 0 : 1].url}
              target="_blank"
              rel="noopener noreferrer"
              className={`panel group relative block overflow-hidden ${i === 0 ? "col-span-2 aspect-[16/10] md:col-span-1 md:aspect-[4/5]" : "aspect-[4/5]"}`}
              aria-label={`${t.alt} — voir Elembo sur ${socials[i % 2 === 0 ? 0 : 1].name} (nouvel onglet)`}
            >
              <Image src={t.small ?? t.src} alt="" fill sizes="(max-width: 768px) 50vw, 440px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </a>
          ))}
        </Reveal>
        <p className="mt-4 text-sm text-ink-soft">Suivez-nous pour les coulisses, les nouveautés de saison et les points de vente.</p>
      </div>
    </section>
  );
}
