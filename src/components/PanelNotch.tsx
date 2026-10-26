import Link from "next/link";
import { Logo } from "./Logo";

/**
 * Cream tab cut into the top of a colour panel, holding the logo.
 * It lives inside the panel so its curved shoulders always meet the
 * panel edge, and it scrolls away with it; the fixed header then shows
 * a compact logo pill instead.
 */
export function PanelNotch() {
  return (
    <div className="notch absolute left-1/2 top-0 z-30 -translate-x-1/2">
      <Link href="/" aria-label="Elembo — accueil" className="block rounded-b-[26px] bg-cream px-6 pb-3 pt-1.5 md:px-9 md:pb-4">
        <Logo width={128} priority className="md:!w-[150px]" />
      </Link>
    </div>
  );
}
