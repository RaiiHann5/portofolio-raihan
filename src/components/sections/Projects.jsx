import { useMemo, useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import SectionHeading from "../ui/SectionHeading";
import SearchInput from "../ui/SearchInput";
import FilterChips from "../ui/FilterChips";
import ProjectCard from "./ProjectCard";
import { useContent } from "../../context/ContentContext";
import { useLanguage } from "../../context/LanguageContext";

export default function Projects() {
  const containerRef = useScrollReveal({ y: 36 });
  const { projects } = useContent();
  const { t, tx } = useLanguage();
  const [query, setQuery] = useState("");
  const [tech, setTech] = useState("All");

  // Filter diturunkan dari data: teknologi baru di panel admin otomatis
  // muncul sebagai tombol.
  const techOptions = useMemo(() => {
    const names = [...new Set(projects.flatMap((p) => p.stack))].sort((a, b) =>
      a.localeCompare(b)
    );
    return [
      { value: "All", label: t("filters.all") },
      ...names.map((name) => ({ value: name, label: name })),
    ];
  }, [projects, t]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (tech !== "All" && !p.stack.includes(tech)) return false;
      if (!q) return true;
      const haystack = [p.title, tx(p.description), tx(p.type), p.year, ...p.stack]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, query, tech, tx]);

  return (
    <section id="work" ref={containerRef} className="relative px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div data-reveal>
          <SectionHeading
            index="03"
            label={t("projects.label")}
            title={t("projects.title")}
            description={t("projects.description")}
          />
        </div>

        <div data-reveal className="mt-10 flex flex-col gap-5">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={t("filters.searchProjects")}
          />
          {techOptions.length > 2 && (
            <FilterChips options={techOptions} value={tech} onChange={setTech} />
          )}
        </div>

        <div className="mt-16">
          {filtered.length > 0 ? (
            filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))
          ) : (
            <p className="text-sm text-[var(--text-muted)]">{t("filters.emptyProjects")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
