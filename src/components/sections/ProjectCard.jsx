import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useCursor } from "../../context/CursorContext";
import { useLanguage } from "../../context/LanguageContext";

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const { setCursor, clearCursor } = useCursor();
  const { t } = useLanguage();

  function handleMove(e) {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: relX * 8,
      rotateX: -relY * 8,
      duration: 0.6,
      ease: "power3.out",
      transformPerspective: 900,
    });
    gsap.to(imgRef.current, {
      x: relX * 14,
      y: relY * 14,
      duration: 0.6,
      ease: "power3.out",
    });
  }

  function handleLeave() {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power3.out" });
    gsap.to(imgRef.current, { x: 0, y: 0, duration: 0.8, ease: "power3.out" });
    clearCursor();
  }

  return (
    <article
      data-reveal
      className="group border-b border-[var(--border)] py-14 first:pt-0 last:border-b-0"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <Link
          to={`/project/${project.slug}`}
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          onMouseEnter={() => setCursor("View", "view")}
          className="focus-ring relative order-1 block aspect-[4/3] overflow-hidden rounded-2xl lg:order-2 lg:col-span-6"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            ref={imgRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: project.gradient }}
          >
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span className="font-display text-5xl font-medium text-white/15 sm:text-7xl">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        </Link>

        <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-6">
          <div className="mb-4 flex items-center gap-4">
            <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
            <span className="eyebrow text-[var(--text-faint)]">{project.year}</span>
          </div>
          <h3 className="text-3xl font-medium tracking-tight sm:text-4xl">
            <Link
              to={`/project/${project.slug}`}
              onMouseEnter={() => setCursor("View", "view")}
              onMouseLeave={clearCursor}
              className="focus-ring transition-colors duration-300 hover:text-[var(--accent-1)]"
            >
              {project.title}
            </Link>
          </h3>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--text-muted)]">
            {project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[var(--border)] px-3 py-1 font-mono text-xs text-[var(--text-faint)]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              to={`/project/${project.slug}`}
              onMouseEnter={() => setCursor("View", "view")}
              onMouseLeave={clearCursor}
              className="focus-ring group/link inline-flex items-center gap-1.5 text-sm font-medium"
            >
              <span className="relative">
                {t("detail.viewCaseStudy")}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[var(--accent-1)] transition-all duration-300 group-hover/link:w-full" />
              </span>
              <ArrowRight size={15} strokeWidth={2.2} />
            </Link>

            {/* Link demo cuma dirender kalau URL-nya beneran ada — beberapa
                proyek belum punya versi live yang bisa dibuka. */}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCursor("Open", "label")}
                onMouseLeave={clearCursor}
                className="focus-ring inline-flex items-center gap-1.5 text-sm text-[var(--text-faint)] transition-colors hover:text-[var(--accent-1)]"
              >
                {t("detail.liveDemo")} <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}