import { useRef } from "react";
import { useMagnetic } from "../../hooks/useMagnetic";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import SectionHeading from "../ui/SectionHeading";
import SkillPill from "./SkillPill";
import { skillGroups } from "../../data/skills";

const ACCENTS = [
  { from: "#FF6B6B", to: "#FFD93D" },
  { from: "#6BCBFF", to: "#8B7DFF" },
  { from: "#4EE1A0", to: "#3DDCFF" },
  { from: "#FF8FE0", to: "#FF6B6B" },
  { from: "#FFB84E", to: "#FF6BCB" },
  { from: "#7CFFCB", to: "#6BCBFF" },
];

function SkillCard({ group, index }) {
  const magneticRef = useMagnetic(0.06);
  const cardRef = useRef(null);
  const pillWrapRef = useRef(null);
  const accent = ACCENTS[index % ACCENTS.length];

  const setRefs = (node) => {
    cardRef.current = node;
    if (typeof magneticRef === "function") magneticRef(node);
    else if (magneticRef) magneticRef.current = node;
  };

  // Tilt + pill-pull cuma jalan kalau device punya "fine pointer" (mouse).
  // Di HP, event mousemove nggak nyala pas sentuh layar jadi ini otomatis no-op,
  // tapi kita cek eksplisit biar nggak ada sisa transform aneh kalau ada hybrid device (touch + mouse).
  const handleMouseMove = (e) => {
    if (window.matchMedia && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);
    el.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 8}deg`);

    if (pillWrapRef.current) {
      const pills = pillWrapRef.current.querySelectorAll("[data-pill]");
      pills.forEach((pill) => {
        const pr = pill.getBoundingClientRect();
        const cx = pr.left + pr.width / 2 - rect.left;
        const cy = pr.top + pr.height / 2 - rect.top;
        const dist = Math.hypot(x - cx, y - cy);
        const pull = Math.max(0, 1 - dist / 160);
        const dx = (x - cx) * pull * 0.15;
        const dy = (y - cy) * pull * 0.15;
        pill.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    }
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    if (pillWrapRef.current) {
      pillWrapRef.current.querySelectorAll("[data-pill]").forEach((pill) => {
        pill.style.transform = "translate(0px, 0px)";
      });
    }
  };

  return (
    <div
      ref={setRefs}
      data-reveal
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)] p-6 transition-[transform,border-color,background-color] duration-300 ease-out will-change-transform active:scale-[0.99] sm:p-8 md:p-10 md:hover:border-[var(--border-strong)]"
      style={{
        background: "var(--card-bg)",
        transform: "perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
        "--spot-x": "50%",
        "--spot-y": "50%",
      }}
    >
      {/* Dot-grid reveal — di desktop ngikutin cursor, di mobile fallback nongol pelan dari tengah pas card ke-tap */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-active:opacity-100"
        style={{
          backgroundImage: `radial-gradient(${accent.from} 1px, transparent 1px)`,
          backgroundSize: "14px 14px",
          maskImage: `radial-gradient(220px circle at var(--spot-x) var(--spot-y), black 0%, black 35%, transparent 75%)`,
          WebkitMaskImage: `radial-gradient(220px circle at var(--spot-x) var(--spot-y), black 0%, black 35%, transparent 75%)`,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-100"
        style={{
          background: `radial-gradient(320px circle at var(--spot-x) var(--spot-y), ${accent.from}1a, transparent 70%)`,
        }}
      />

      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-all duration-500 group-hover:scale-110 sm:-right-16 sm:-top-16 sm:h-48 sm:w-48"
        style={{
          background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
          opacity: "var(--card-glow-opacity)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full group-active:w-full"
        style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}
      />

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between sm:mb-8">
          <span className="eyebrow">
            <span
              className="bg-clip-text text-sm font-semibold text-transparent transition-all duration-300 group-hover:tracking-wider sm:text-base"
              style={{ backgroundImage: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}
            >
              0{index + 1}
            </span>
          </span>
          <span className="text-[11px] text-[var(--text-faint)] sm:text-xs">{group.note}</span>
        </div>

        <h3 className="mb-4 text-xl font-medium transition-transform duration-300 group-hover:translate-x-1 sm:mb-6 sm:text-2xl">
          {group.label}
        </h3>

        <div ref={pillWrapRef} className="flex flex-wrap gap-2 sm:gap-3">
          {group.skills.map((skill, i) => (
            <div
              key={skill}
              data-pill
              data-reveal
              style={{ transitionDelay: `${i * 40}ms` }}
              className="transition-transform duration-150 ease-out"
            >
              <SkillPill name={skill} />
            </div>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute right-5 top-5 h-1.5 w-1.5 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-100 sm:right-6 sm:top-6 sm:h-2 sm:w-2"
        style={{ background: accent.to, boxShadow: `0 0 12px 4px ${accent.to}` }}
      />

      <span className="pointer-events-none absolute bottom-6 right-6 z-10 text-[11px] text-[var(--text-faint)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-100 sm:bottom-10 sm:right-10 sm:text-xs">
        {group.skills.length} tools
      </span>
    </div>
  );
}

export default function Skills() {
  const containerRef = useScrollReveal();

  return (
    <section id="skills" ref={containerRef} className="relative px-4 py-20 sm:px-6 sm:py-28 md:px-10 md:py-36">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] opacity-[0.06] blur-3xl sm:opacity-[0.07]"
        style={{
          background:
            "radial-gradient(600px circle at 20% 0%, #FF6B6B, transparent 60%), radial-gradient(600px circle at 80% 20%, #6BCBFF, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-[1400px]">
        <div data-reveal>
          <SectionHeading
            index="02"
            label="Skills"
            title="Tools I reach for."
            description="A focused set of technologies I use daily to design and build interactive products."
          />
        </div>

        {/* Grid rata 1 / 2 / 3 kolom — semua card sama besar, nggak ada yang gantung
            di breakpoint manapun, termasuk pas jumlah grup ganjil/genap ganti-ganti nanti. */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <div key={group.label} data-reveal style={{ perspective: "1000px" }}>
              <SkillCard group={group} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}