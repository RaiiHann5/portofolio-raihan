import { useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { useCursor } from "../../context/CursorContext";

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const { setCursor, clearCursor } = useCursor();

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
        <div
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          onMouseEnter={() => setCursor("View", "view")}
          className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl lg:order-2 lg:col-span-6"
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
        </div>

        <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-6">
          <div className="mb-4 flex items-center gap-4">
            <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
            <span className="eyebrow text-[var(--text-faint)]">{project.year}</span>
          </div>
          <h3 className="text-3xl font-medium tracking-tight sm:text-4xl">{project.title}</h3>
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

          <div className="mt-8 flex items-center gap-6">
            <a
              href={project.demo}
              onMouseEnter={() => setCursor("Open", "label")}
              onMouseLeave={clearCursor}
              className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[var(--accent-1)]"
            >
              Live demo <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}