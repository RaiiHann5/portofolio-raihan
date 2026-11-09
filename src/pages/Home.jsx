import Hero from "../components/sections/Hero";
import TechMarquee from "../components/sections/TechMarquee";
import Services from "../components/sections/Services";
import FeaturedWork from "../components/sections/FeaturedWork";
import Process from "../components/sections/Process";
import PageSections from "../components/sections/PageSections";
import SectionGate from "../components/sections/SectionGate";

export default function Home() {
  return (
    <>
      <SectionGate id="hero"><Hero /></SectionGate>
      <SectionGate id="tech-marquee"><TechMarquee /></SectionGate>
      <SectionGate id="services"><Services /></SectionGate>
      <SectionGate id="featured-work"><FeaturedWork /></SectionGate>
      <SectionGate id="process"><Process /></SectionGate>
      {/* Section yang ditambahkan lewat panel admin menempel di bawah. */}
      <PageSections page="home" />
    </>
  );
}
