import { useScrollReveal } from "../../hooks/useScrollReveal";
import SectionHeading from "../ui/SectionHeading";
import ProjectCard from "./ProjectCard";
import { projects } from "../../data/projects";

export default function Projects() {
  const containerRef = useScrollReveal({ y: 36 });

  return (
    <section id="work" ref={containerRef} className="relative px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div data-reveal>
          <SectionHeading
            index="03"
            label="Selected work"
            title="Featured projects."
            description="A handful of projects where design and engineering met somewhere in the middle."
          />
        </div>

        <div className="mt-16">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
