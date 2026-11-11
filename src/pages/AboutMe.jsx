import About from "../components/sections/About";
import Biodata from "../components/sections/Biodata";
import Skills from "../components/sections/Skills";
import ProfileList from "../components/sections/ProfileList";
import GithubActivity from "../components/sections/GithubActivity";
import Experience from "../components/sections/Experience";
import Certificates from "../components/sections/Certificates";
import CareerGoals from "../components/sections/CareerGoals";
import Lab from "../components/sections/Lab";
import PageSections from "../components/sections/PageSections";
import SectionGate from "../components/sections/SectionGate";

export default function AboutMe() {
  return (
    <>
      <SectionGate id="about"><About /></SectionGate>
      <SectionGate id="biodata"><Biodata /></SectionGate>
      <SectionGate id="skills"><Skills /></SectionGate>
      <SectionGate id="education">
        <ProfileList sectionId="education" index="04" prefix="edu" items={["edu1", "edu2"]} />
      </SectionGate>
      <SectionGate id="experience"><Experience /></SectionGate>
      <SectionGate id="plk">
        <ProfileList sectionId="plk" index="06" prefix="plk" items={["plk1", "plk2"]} />
      </SectionGate>
      <SectionGate id="github-activity"><GithubActivity /></SectionGate>
      <SectionGate id="certificates"><Certificates /></SectionGate>
      <SectionGate id="career"><CareerGoals /></SectionGate>
      <SectionGate id="lab"><Lab /></SectionGate>
      <PageSections page="about" />
    </>
  );
}
