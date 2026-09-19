import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { brands } from "../data/brands";
import BrandGlyph from "../components/ui/BrandGlyph";
import Gallery from "../components/ui/Gallery";
import MagneticButton from "../components/ui/MagneticButton";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTheme } from "../context/ThemeContext";
import { useCursor } from "../context/CursorContext";
import { useLanguage } from "../context/LanguageContext";

function MetaRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 border-t border-[var(--border)] py-4">
      <dt className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
        {label}
      </dt>
      <dd className="text-sm text-[var(--text)]">{value}</dd>
    </div>
  );
}

function StackPill({ name, isDark }) {
  const brand = brands[name];
  const color = brand ? (isDark && brand.hexDark ? brand.hexDark : brand.hex) : undefined;

  return (
    <li
      className="stack-pill group flex items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-1.5 transition-colors duration-300 hover:border-[var(--brand)]"
      style={{ "--brand": color || "var(--border-strong)" }}
    >
      <BrandGlyph
        name={name}
        size={15}
        className="text-[var(--text-faint)] transition-colors duration-300 group-hover:text-[var(--brand)]"
      />
      <span className="font-mono text-xs text-[var(--text-muted)] transition-colors duration-300 group-hover:text-[var(--text)]">
        {name}
      </span>
    </li>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { getProject, getNextProject, loading } = useContent();
  const project = getProject(slug);
  const containerRef = useScrollReveal({ y: 24, stagger: 0.07 });
  const { theme } = useTheme();
  const { setCursor, clearCursor } = useCursor();
  const { t } = useLanguage();

  // Jangan buru-buru mengalihkan selagi data masih dimuat dari database,
  // kalau tidak tautan langsung ke halaman detail akan terlempar balik
  // sebelum datanya sempat tiba.
  if (!project) {
    if (loading) return null;
    return <Navigate to="/project" replace />;
  }

  const isDark = theme !== "light";
  const nextProject = getNextProject(slug);

  return (
    <article ref={containerRef} className="relative px-6 pb-28 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-[1400px]">
        <Link
          to="/project"
          onMouseEnter={() => setCursor("Back", "label")}
          onMouseLeave={clearCursor}
          className="focus-ring group inline-flex items-center gap-2 text-sm text-[var(--text-faint)] transition-colors duration-300 hover:text-[var(--text)]"
        >
          <ArrowLeft
            size={15}
            strokeWidth={2.2}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          {t("detail.backToProjects")}
        </Link>

        <header className="mt-10 flex flex-col gap-6">
          <div data-reveal className="flex flex-wrap items-center gap-3">
            <span className="eyebrow text-[var(--accent-1)]">{project.type}</span>
            <span aria-hidden className="h-3 w-px bg-[var(--border)]" />
            <span className="eyebrow text-[var(--text-faint)]">{project.year}</span>
          </div>

          <h1
            data-reveal
            className="font-display max-w-4xl text-4xl font-medium leading-[1.05] sm:text-6xl"
          >
            {project.title}
          </h1>

          <p
            data-reveal
            className="max-w-[62ch] text-base leading-relaxed text-[var(--text-muted)] sm:text-lg"
          >
            {project.description}
          </p>

          {(project.demo || project.repo) && (
            <div data-reveal className="mt-2 flex flex-wrap items-center gap-4">
              {project.demo && (
                <MagneticButton
                  as="a"
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="solid"
                  cursorLabel="Open"
                >
                  {t("detail.liveDemo")}
                  <ArrowUpRight size={16} strokeWidth={2.2} />
                </MagneticButton>
              )}
              {project.repo && (
                <MagneticButton
                  as="a"
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  cursorLabel="Code"
                >
                  {t("detail.sourceCode")}
                  <ArrowUpRight size={16} strokeWidth={2.2} />
                </MagneticButton>
              )}
            </div>
          )}
        </header>

        <div data-reveal className="mt-16">
          <Gallery
            images={project.gallery}
            title={project.title}
            fallbackGradient={project.gradient}
          />
        </div>

        <div className="mt-20 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <section data-reveal>
              <h2 className="font-display text-2xl font-medium tracking-tight">
                {t("detail.overview")}
              </h2>
              <p className="mt-5 max-w-[68ch] text-base leading-relaxed text-[var(--text-muted)]">
                {project.overview}
              </p>
            </section>

            {project.features?.length > 0 && (
              <section data-reveal className="mt-16">
                <h2 className="font-display text-2xl font-medium tracking-tight">
                  {t("detail.features")}
                </h2>
                <ul className="mt-8 flex flex-col">
                  {project.features.map((feature) => (
                    <li
                      key={feature.title}
                      className="flex flex-col gap-2 border-t border-[var(--border)] py-6 last:border-b"
                    >
                      <h3 className="text-base font-medium tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="max-w-[62ch] text-sm leading-relaxed text-[var(--text-muted)]">
                        {feature.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-32">
              <section data-reveal>
                <h2 className="font-display text-lg font-medium tracking-tight">
                  {t("detail.techStack")}
                </h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <StackPill key={tech} name={tech} isDark={isDark} />
                  ))}
                </ul>
              </section>

              <dl data-reveal className="mt-10">
                <MetaRow label={t("detail.role")} value={project.role} />
                <MetaRow label={t("detail.type")} value={project.type} />
                <MetaRow label={t("detail.year")} value={project.year} />
              </dl>
            </div>
          </aside>
        </div>

        {nextProject && (
          <Link
            to={`/project/${nextProject.slug}`}
            onMouseEnter={() => setCursor("Next", "view")}
            onMouseLeave={clearCursor}
            className="focus-ring group mt-24 flex items-center justify-between gap-6 border-t border-[var(--border)] pt-10"
          >
            <span className="min-w-0">
              <span className="eyebrow block text-[var(--text-faint)]">
                {t("detail.nextProject")}
              </span>
              <span className="font-display mt-3 block truncate text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-[var(--accent-1)] sm:text-4xl">
                {nextProject.title}
              </span>
            </span>
            <ArrowRight
              size={26}
              strokeWidth={1.6}
              aria-hidden
              className="shrink-0 text-[var(--text-faint)] transition-all duration-300 group-hover:translate-x-2 group-hover:text-[var(--text)]"
            />
          </Link>
        )}
      </div>
    </article>
  );
}
