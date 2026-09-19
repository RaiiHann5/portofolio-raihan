import Hero from "../components/sections/Hero";
import TechMarquee from "../components/sections/TechMarquee";
import Services from "../components/sections/Services";
import FeaturedWork from "../components/sections/FeaturedWork";
import Process from "../components/sections/Process";
import PageSections from "../components/sections/PageSections";

export default function Home() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <Services />
      <FeaturedWork />
      <Process />
      {/* Section yang ditambahkan lewat panel admin menempel di bawah. */}
      <PageSections page="home" />
    </>
  );
}
