import Contact from "../components/sections/Contact";
import PageSections from "../components/sections/PageSections";
import SectionGate from "../components/sections/SectionGate";

export default function FindMe() {
  return (
    <>
      <SectionGate id="contact"><Contact /></SectionGate>
      <PageSections page="find-me" />
    </>
  );
}
