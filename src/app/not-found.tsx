import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export default function NotFound() {
  return (
    <PageHero eyebrow="Oups" title={<>Page introuvable</>} bg="var(--orange)" ink="var(--ink)" decor={["orangeWedge"]} intro={<p>Cette page n’existe pas ou a été déplacée.</p>}>
      <Link href="/" className="btn btn-ink mt-8">
        Retour à l’accueil
      </Link>
    </PageHero>
  );
}
