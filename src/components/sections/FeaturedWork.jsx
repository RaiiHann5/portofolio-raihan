import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useCursor } from "../../context/CursorContext";
import { useLanguage } from "../../context/LanguageContext";

function isLiveDemo(url) {
  return typeof url === "string" && url.startsWith("http");
}

export default function FeaturedWork() {
  const containerRef = useScrollReveal({ y: 24, stagger: 0.08 });
  const previewRef = useRef(null);
  const moveXRef = useRef(null);
  const moveYRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [pointerFine, setPointerFine] = useState(false);
  const { setCursor, clearCursor } = useCursor();
  const { t } = useLanguage();
  const { projects } = useContent();
  const featured = projects.slice(0, 3);

  // Preview yang ngikut kursor cuma masuk akal kalau ada kursor beneran.
  // Di layar sentuh, tiap baris nampilin thumbnail kecil sebagai gantinya.
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setPointerFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!pointerFine || !previewRef.current) return undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // quickTo nyimpen satu tween yang dipakai ulang, jadi mousemove gak
    // bikin tween baru tiap frame.
    moveXRef.current = gsap.quickTo(previewRef.current, "x", {
      duration: reduceMotion ? 0 : 0.5,
      ease: "power3.out",
    });
    moveYRef.current = gsap.quickTo(previewRef.current, "y", {
      duration: reduceMotion ? 0 : 0.62,
      ease: "power3.out",
    });

    return () => {
      moveXRef.current = null;
      moveYRef.current = null;
    };
  }, [pointerFine]);

  function handleMouseMove(e) {
    if (!moveXRef.current) return;
    moveXRef.current(e.clientX + 28);
    moveYRef.current(e.clientY - 110);
  }

  // Tanpa ini, hover pertama bikin preview meluncur dari pojok kiri atas
  // layar karena posisi awalnya masih 0,0.
  function handleMouseEnter(e) {
    if (!previewRef.current) return;
    gsap.set(previewRef.current, { x: e.clientX + 28, y: e.clientY - 110 });
  }

  const activeProject = activeIndex === null ? null : featured[activeIndex];

  return (
    <section
      id="work"
      ref={containerRef}
      onMouseEnter={pointerFine ? handleMouseEnter : undefined}
      onMouseMove={pointerFine ? handleMouseMove : undefined}
      className="relative px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p data-reveal className="eyebrow mb-6">
              {t("work.label")}
            </p>
            <h2
              data-reveal
              className="font-display text-4xl font-medium leading-[1.06] sm:text-5xl"
            >
              {t("work.title")}
            </h2>
          </div>

          {pointerFine && (
            <p
              data-reveal
              className="max-w-[34ch] text-sm leading-relaxed text-[var(--text-faint)]"
            >
              {t("work.description")}
            </p>
          )}
        </div>

        <ul className="mt-14 border-t border-[var(--border)]">
          {featured.map((project, i) => (
            <li key={project.id} data-reveal className="border-b border-[var(--border)]">
              <Link
                to={`/project/${project.slug}`}
                onMouseEnter={() => {
                  setActiveIndex(i);
                  setCursor("View", "view");
                }}
                onMouseLeave={() => {
                  setActiveIndex(null);
                  clearCursor();
                }}
                className="focus-ring group flex items-center gap-5 py-8 sm:gap-8"
              >
                {!pointerFine && (
                  <span
                    className="h-14 w-14 shrink-0 overflow-hidden rounded-lg"
                    style={{ background: project.gradient }}
                  >
                    {project.image && (
                      <img
                        src={project.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </span>
                )}

                <span className="min-w-0 flex-1">
                  <span className="font-display block truncate text-2xl font-medium leading-tight tracking-tight transition-colors duration-300 group-hover:text-[var(--accent-1)] sm:text-4xl">
                    {project.title}
                  </span>
                  <span className="mt-2 block font-mono text-xs text-[var(--text-faint)]">
                    {project.year} · {project.stack.slice(0, 3).join(" / ")}
                  </span>
                </span>

                {isLiveDemo(project.demo) && (
                  <span className="hidden shrink-0 font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-faint)] sm:block">
                    live
                  </span>
                )}

                <ArrowUpRight
                  size={22}
                  strokeWidth={1.6}
                  aria-hidden
                  className="shrink-0 text-[var(--text-faint)] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--text)]"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-10">
          <Link
            to="/project"
            onMouseEnter={() => setCursor("All", "label")}
            onMouseLeave={clearCursor}
            className="focus-ring group inline-flex items-center gap-2 text-sm font-medium"
          >
            <span className="relative">
              {t("work.viewAll")}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[var(--accent-1)] transition-all duration-300 group-hover:w-full" />
            </span>
            <ArrowUpRight size={15} strokeWidth={2.2} aria-hidden />
          </Link>
        </div>
      </div>

      {/* Preview melayang. Selalu ada di DOM supaya transisinya halus,
          tapi gak pernah nangkep pointer dan gak dibaca screen reader. */}
      {pointerFine && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40 h-[220px] w-[300px] overflow-hidden rounded-xl border border-[var(--border-strong)] transition-opacity duration-300 ease-out"
          style={{
            opacity: activeProject ? 1 : 0,
            background: activeProject?.gradient || "var(--surface-1)",
          }}
        >
          {activeProject?.image && (
            <img
              src={activeProject.image}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
        </div>
      )}
    </section>
  );
}
