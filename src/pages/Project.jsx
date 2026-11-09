import Projects from "../components/sections/Projects";
import PageSections from "../components/sections/PageSections";
import SectionGate from "../components/sections/SectionGate";

export default function Project() {
  return (
    <>
      <SectionGate id="projects"><Projects /></SectionGate>
      <PageSections page="project" />
    </>
  );
}
