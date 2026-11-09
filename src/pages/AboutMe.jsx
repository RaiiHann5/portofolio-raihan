import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import GithubActivity from "../components/sections/GithubActivity";
import Experience from "../components/sections/Experience";
import Certificates from "../components/sections/Certificates";
import Lab from "../components/sections/Lab";
import PageSections from "../components/sections/PageSections";
import SectionGate from "../components/sections/SectionGate";

export default function AboutMe() {
  return (
    <>
      <SectionGate id="about"><About /></SectionGate>
      <SectionGate id="skills"><Skills /></SectionGate>
      <SectionGate id="github-activity"><GithubActivity /></SectionGate>
      <SectionGate id="experience"><Experience /></SectionGate>
      <SectionGate id="certificates"><Certificates /></SectionGate>
      <SectionGate id="lab"><Lab /></SectionGate>
      <PageSections page="about" />
    </>
  );
}
