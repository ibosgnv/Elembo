"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { SoundToggle } from "./SoundToggle";
import { IconArrow, IconClose, IconInstagram, IconMenu, IconTiktok, IconFacebook } from "./Icons";
import { nav, socials } from "@/data/site";

const socialIcon = { Instagram: IconInstagram, TikTok: IconTiktok, Facebook: IconFacebook } as const;

/**
 * Charlie's-style chrome: centred logo in a cream "notch", a social link on
 * the left, the "Où nous trouver" action on the right, and a compact
 * navigation pill pinned to the bottom of the screen on desktop.
 * On mobile the pill becomes a full-screen menu.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // The panel notch is ~100px tall; swap to the pill once it has mostly scrolled out
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    // Close the menu after navigation
    menuRef.current?.close();
  }, [pathname]);

  const openMenu = () => menuRef.current?.showModal();
  const closeMenu = () => menuRef.current?.close();

  return (
    <>
      <header data-scrolled={scrolled || undefined} className="group/header pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="relative mx-auto flex items-start justify-between px-[calc(var(--gutter)+12px)] pt-[calc(var(--gutter)+12px)]">
          {/* Left: social + music */}
          <div className="pointer-events-auto flex items-center gap-2">
          <a
            href={socials[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto hidden h-11 w-11 items-center justify-center rounded-full border-2 border-current bg-paper/90 text-ink transition hover:bg-ink hover:text-cream md:inline-flex"
            aria-label={`Elembo sur ${socials[0].name} (nouvel onglet)`}
          >
            <IconInstagram width={20} height={20} />
          </a>
          <SoundToggle />
          </div>

          {/* Centre: compact logo pill, shown once the panel notch has scrolled away */}
          <div
            className="pointer-events-auto invisible absolute left-1/2 top-[calc(var(--gutter)+8px)] -translate-x-1/2 -translate-y-3 opacity-0 transition-all duration-300 group-data-[scrolled]/header:visible group-data-[scrolled]/header:translate-y-0 group-data-[scrolled]/header:opacity-100"
          >
            <Link href="/" aria-label="Elembo — accueil" className="block rounded-full bg-cream px-5 py-2.5 shadow-[0_6px_24px_-10px_rgba(42,26,14,.45)]">
              <Logo width={96} className="md:!w-[104px]" />
            </Link>
          </div>

          {/* Right: where to buy / menu */}
          <div className="pointer-events-auto ml-auto flex items-center gap-2">
            <Link href="/points-de-vente" className="btn btn-cream hidden !min-h-11 !px-4 !text-[0.8125rem] md:inline-flex">
              Où nous trouver
            </Link>
            <button
              type="button"
              onClick={openMenu}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink shadow-[0_2px_0_rgba(42,26,14,.15)] md:hidden"
              aria-label="Ouvrir le menu"
              aria-haspopup="dialog"
              aria-expanded={open}
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom navigation pill — desktop */}
      <nav
        aria-label="Navigation principale"
        className="fixed bottom-[calc(var(--gutter)+10px)] left-1/2 z-50 hidden -translate-x-1/2 md:block"
      >
        <ul className="flex items-center gap-1 rounded-[14px] bg-paper/95 p-1.5 shadow-[0_6px_24px_-10px_rgba(42,26,14,.45)] backdrop-blur">
          {[{ href: "/", label: "Accueil" }, ...nav].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`block whitespace-nowrap rounded-[10px] px-3.5 py-2.5 text-[0.8125rem] font-bold uppercase tracking-[0.06em] transition-colors ${
                  isActive(item.href) ? "bg-ink text-cream" : "text-ink hover:bg-cream-deep"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile menu */}
      <dialog
        ref={menuRef}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        // showModal toggles `open`; mirror it for aria-expanded
        onToggle={(e) => setOpen((e.target as HTMLDialogElement).open)}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-cream p-0 text-ink backdrop:bg-transparent"
      >
        <div className="flex min-h-dvh flex-col px-6 pb-8 pt-5">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={closeMenu} aria-label="Elembo — accueil">
              <Logo width={120} />
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-cream"
              aria-label="Fermer le menu"
              autoFocus
            >
              <IconClose />
            </button>
          </div>

          <nav aria-label="Navigation mobile" className="mt-10 flex-1">
            <ul className="space-y-1">
              <li>
                <Link href="/" onClick={closeMenu} className="display block py-2 text-[3.25rem]" aria-current={pathname === "/" ? "page" : undefined}>
                  Accueil
                </Link>
              </li>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`display block py-2 text-[3.25rem] ${isActive(item.href) ? "text-orange" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/points-de-vente" onClick={closeMenu} className="btn btn-ink w-full">
            Où nous trouver <IconArrow width={18} height={18} />
          </Link>
          <ul className="mt-6 flex justify-center gap-3">
            {socials.map((s) => {
              const Icon = socialIcon[s.name];
              return (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink"
                    aria-label={`${s.name} ${s.handle} (nouvel onglet)`}
                  >
                    <Icon width={20} height={20} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </dialog>
    </>
  );
}
