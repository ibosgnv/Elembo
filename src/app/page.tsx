import { Hero } from "@/components/home/Hero";
import { FlavourCollection } from "@/components/home/FlavourCollection";
import { EditorialIntro, Lifestyle, Origin, Social, WhereToFind } from "@/components/home/Sections";
import { Marquee } from "@/components/Marquee";

export default function Home() {
  return (
    <>
      <Hero />
      <EditorialIntro />
      <FlavourCollection />
      <div className="overflow-hidden py-8">
        <Marquee
          items={["Orange", "Ananas", "Mangue", "Orange–Ananas", "Mangue–Ananas"]}
          className="display -mx-8 bg-paper py-4 text-[clamp(2.6rem,6vw,5rem)] text-ink shadow-[0_8px_30px_-18px_rgba(42,26,14,.5)]"
          tilt={-2.2}
        />
      </div>
      <Lifestyle />
      <Origin />
      <WhereToFind />
      <Social />
    </>
  );
}
