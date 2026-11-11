import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import TechMarquee from "../components/sections/TechMarquee";
import Services from "../components/sections/Services";
import FeaturedWork from "../components/sections/FeaturedWork";
import Process from "../components/sections/Process";
import Testimonials from "../components/sections/Testimonials";
import PageSections from "../components/sections/PageSections";
import SectionGate from "../components/sections/SectionGate";

export default function Home() {
  return (
    <>
      <SectionGate id="hero"><Hero /></SectionGate>
      <SectionGate id="home-profile"><About /></SectionGate>
      <SectionGate id="tech-marquee"><TechMarquee /></SectionGate>
      <SectionGate id="services"><Services /></SectionGate>
      <SectionGate id="featured-work"><FeaturedWork /></SectionGate>
      <SectionGate id="process"><Process /></SectionGate>
      <SectionGate id="testimonials"><Testimonials /></SectionGate>
      {/* Section yang ditambahkan lewat panel admin menempel di bawah. */}
      <PageSections page="home" />
    </>
  );
}
