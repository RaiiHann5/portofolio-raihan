import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import GithubActivity from "../components/sections/GithubActivity";
import Experience from "../components/sections/Experience";
import Certificates from "../components/sections/Certificates";
import Lab from "../components/sections/Lab";
import PageSections from "../components/sections/PageSections";

export default function AboutMe() {
  return (
    <>
      <About />
      <Skills />
      <GithubActivity />
      <Experience />
      <Certificates />
      <Lab />
      <PageSections page="about" />
    </>
  );
}
