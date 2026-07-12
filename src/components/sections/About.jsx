import { useRef, useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import SectionHeading from "../ui/SectionHeading";
import Raihan3 from "../../assets/Raihan3.jpg";

const focusItems = [
  {
    title: "User Centric Approach",
    body: "Developing interfaces where every layout, button, and interaction serves a clear, intuitive purpose for the user.",
    detail: "Prioritizing clear navigation, readable typography, and logical user journeys that make complex tasks feel effortless.",
  },
  {
    title: "Responsive & Accessible",
    body: "Ensuring that every user, regardless of their device or ability, gets a flawless and inclusive web experience.",
    detail: "Implementing fluid layouts that adapt gracefully to any screen size, alongside strict adherence to WCAG standards and semantic HTML.",
  },
  {
    title: "Seamless Integration",
    body: "Connecting beautiful front-end interfaces with robust back-end systems to create dynamic, data-driven sites.",
    detail: "Efficiently managing API data fetching and global state to ensure real-time information flows smoothly without breaking the UI.",
  }
];

// Foto diimport langsung dari src/assets (bukan string path biasa),
// supaya ikut di-bundle & dioptimasi oleh Vite/webpack.
const PROFILE_IMAGE_SRC = Raihan3;

export default function About() {
  const containerRef = useScrollReveal();
  const [activeIndex, setActiveIndex] = useState(null);
  const imageRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [imgError, setImgError] = useState(false);

  function handlePointerMove(e) {
    const rect = imageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 12 });
  }

  function resetTilt() {
    setHovering(false);
    setTilt({ x: 0, y: 0 });
  }

  return (
    <section id="about" ref={containerRef} className="relative px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div data-reveal>
          <SectionHeading index="01" label="About" title="A developer who thinks like a designer." />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Photo */}
          <div data-reveal className="lg:col-span-4">
            <div
              ref={imageRef}
              onMouseEnter={() => setHovering(true)}
              onMouseMove={handlePointerMove}
              onMouseLeave={resetTilt}
              className="group relative aspect-[4/5] w-full cursor-default overflow-hidden rounded-2xl border border-[var(--border)]"
              style={{
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovering ? 1.02 : 1})`,
                transition: hovering ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {!imgError ? (
                // Foto asli — akan otomatis fallback ke placeholder gradient kalau gagal load
                <img
                  src={PROFILE_IMAGE_SRC}
                  alt="Profile photo"
                  onError={() => setImgError(true)}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    transform: `translate(${tilt.y * -0.6}px, ${tilt.x * 0.6}px) scale(1.08)`,
                    transition: hovering ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
              ) : (
                // Fallback placeholder — tampil otomatis kalau PROFILE_IMAGE_SRC belum ada / 404
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 20% 15%, rgba(255,255,255,0.10), transparent 55%), linear-gradient(160deg, #2a2a2a, #0c0c0c)",
                  }}
                >
                  <span
                    className="select-none text-7xl font-semibold tracking-tight text-white/10"
                    style={{ transform: `translate(${tilt.y * -0.6}px, ${tilt.x * 0.6}px)` }}
                  >
                    JS
                  </span>
                </div>
              )}

              {/* Grain overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
              />

              {/* Darkening scrim so badge/corners stay legible over any photo */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent 40%)",
                }}
              />

              {/* Viewfinder corners */}
              {["top-4 left-4 border-t border-l", "top-4 right-4 border-t border-r", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map(
                (pos, i) => (
                  <span
                    key={i}
                    className={`absolute h-5 w-5 border-white/30 transition-all duration-500 ${pos} ${
                      hovering ? "opacity-100 scale-110" : "opacity-50 scale-100"
                    }`}
                  />
                )
              )}

              {/* Status badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs text-white/80">Available for work</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div data-reveal className="lg:col-span-8">
            <p className="text-xl leading-relaxed text-[var(--text-muted)] sm:text-2xl">
              Hey there, I'm Raihan Rezki Ramadhan. What started as a fun experiment with code has grown into a genuine passion for building digital experiences. I specialize in creating interfaces for teams who believe that how a product feels is just as important as how it functions under the hood.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-faint)]">
              My current focus is on motion-driven interfaces — the kind of
              detail that turns a good product into a memorable one. When
              I'm not building, I'm usually reverse-engineering interactions
              from sites I admire, or sketching new ones of my own.
            </p>

            {/* Interactive focus list */}
            <div className="mt-12 border-t border-[var(--border)]">
              {focusItems.map((item, i) => {
                const isActive = activeIndex === i;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={() => setActiveIndex(isActive ? null : i)}
                    className="group flex w-full items-start gap-5 border-b border-[var(--border)] py-6 text-left transition-colors"
                  >
                    <span
                      className={`shrink-0 pt-0.5 text-sm tabular-nums transition-colors duration-300 ${
                        isActive ? "text-white" : "text-[var(--text-faint)]"
                      }`}
                    >
                      0{i + 1}
                    </span>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`text-lg font-medium transition-transform duration-300 ${
                            isActive ? "translate-x-1" : "translate-x-0"
                          }`}
                        >
                          {item.title}
                        </h3>
                        <span
                          className={`text-[var(--text-faint)] transition-transform duration-300 ${
                            isActive ? "rotate-45" : "rotate-0"
                          }`}
                        >
                          +
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                        {item.body}
                      </p>

                      <div
                        className="overflow-hidden transition-all duration-300 ease-out"
                        style={{ maxHeight: isActive ? 60 : 0, opacity: isActive ? 1 : 0 }}
                      >
                        <p className="mt-3 text-sm leading-relaxed text-[var(--text-faint)]">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}