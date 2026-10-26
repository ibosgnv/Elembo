import Link from "next/link";
import { Logo } from "./Logo";
import { Marquee } from "./Marquee";
import { IconFacebook, IconInstagram, IconMail, IconPhone, IconTiktok } from "./Icons";
import { association, formatPhone, nav, site, socials } from "@/data/site";

const socialIcons = { Instagram: IconInstagram, TikTok: IconTiktok, Facebook: IconFacebook } as const;

export function SiteFooter() {
  return (
    <footer className="px-[var(--gutter)] pb-[calc(var(--gutter)+76px)] md:pb-[calc(var(--gutter)+84px)]">
      <div className="panel on-dark relative overflow-hidden bg-leaf-deep pt-12 text-cream md:pt-16">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 md:px-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            {/* The logo keeps its own colours: it sits on a cream badge */}
            <Link href="/" aria-label="Elembo — accueil" className="inline-block rounded-[22px] bg-cream px-6 py-4">
              <Logo width={170} />
            </Link>
            <p className="hand mt-8 max-w-[24rem] text-[2rem] leading-tight">
              Des fruits du Congo, pressés au Congo, pour le Congo — et pour tous ceux qui l’aiment.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-1">
            <nav aria-label="Liens du pied de page">
              <p className="eyebrow text-gold">Explorer</p>
              <ul className="mt-4 space-y-2.5">
                <li><Link href="/" className="font-semibold hover:underline">Accueil</Link></li>
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="font-semibold hover:underline">{n.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="eyebrow text-gold">Suivre</p>
              <ul className="mt-4 space-y-2.5">
                {socials.map((s) => {
                  const Icon = socialIcons[s.name];
                  return (
                    <li key={s.name}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold hover:underline">
                        <Icon width={18} height={18} /> {s.name}
                        <span className="sr-only">(nouvel onglet)</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div>
            <p className="eyebrow text-gold">Nous contacter</p>
            <ul className="mt-4 space-y-3 text-[0.9375rem]">
              <li>
                <span className="block opacity-75">Commandes à Kinshasa</span>
                <a href="tel:+243894830974" className="inline-flex min-h-8 items-center gap-2 font-semibold hover:underline">
                  <IconPhone width={16} height={16} /> {formatPhone("+243894830974")}
                </a>
              </li>
              <li>
                <span className="block opacity-75">Livraison Kongo-Central</span>
                <a href="tel:+243820584606" className="inline-flex min-h-8 items-center gap-2 font-semibold hover:underline">
                  <IconPhone width={16} height={16} /> {formatPhone("+243820584606")}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex min-h-8 items-center gap-2 font-semibold hover:underline">
                  <IconMail width={16} height={16} /> {site.email}
                </a>
              </li>
              <li className="opacity-80">{site.office.label}, {site.office.address}</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-[1360px] px-6 md:px-12">
          <p className="max-w-[52rem] border-t border-cream/20 pt-6 text-sm leading-relaxed opacity-80">
            Elembo est une marque de jus produite à Kimpese (Kongo-Central, RDC). Elle est née des projets de l’ONGD Elembo, soutenus par l’<a href={association.url} target="_blank" rel="noopener noreferrer" className="underline">
              {association.name}
            </a>{" "}
            à {association.city}.
          </p>
        </div>

        <Marquee
          items={["Elembo", "Jus na biso", "Made in RDC", "Kimpese", "Kongo-Central"]}
          className="display mt-10 py-2 text-[clamp(4.5rem,13vw,12rem)] text-cream"
          tilt={0}
          duration={46}
        />

        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-3 px-6 pb-6 pt-4 text-xs opacity-75 md:px-12">
          <p>© 2026 Elembo. Tous droits réservés.</p>
          <p>Jus élaborés à Kimpese, Kongo-Central, RDC.</p>
        </div>
      </div>
    </footer>
  );
}
