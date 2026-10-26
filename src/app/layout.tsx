import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Caveat_Brush } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { site } from "@/data/site";

const body = Bricolage_Grotesque({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

const hand = Caveat_Brush({
  variable: "--font-hand",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Elembo — Le goût du Congo",
    template: "%s — Elembo",
  },
  description: site.description,
  icons: {
    icon: [{ url: "/images/brand/favicon-32.png", sizes: "32x32" }],
    apple: "/images/brand/icon-192.png",
  },
  openGraph: {
    title: "Elembo — Le goût du Congo",
    description: site.description,
    images: ["/images/campaign/banner-trio.webp"],
    locale: "fr_CD",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fdf5e8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${body.variable} ${hand.variable} antialiased`}>
      <body>
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
        <SiteHeader />
        <main id="contenu" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
