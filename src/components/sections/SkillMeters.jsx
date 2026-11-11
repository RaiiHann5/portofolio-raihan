import { useEffect, useRef, useState } from "react";
import { Code2, Users } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { technicalLevels, softLevels } from "../../data/skills";
import SpotlightCard from "../ui/SpotlightCard";

/** Angka persen naik dari 0 saat bar terisi. Langsung final kalau reduced-motion. */
function useCountUp(target, active, delay) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return undefined;
    }
    let raf;
    let start;
    const timeout = setTimeout(() => {
      const tick = (now) => {
        start ??= now;
        const p = Math.min((now - start) / 1000, 1);
        setValue(Math.round(target * (1 - (1 - p) ** 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [active, target, delay]);

  return value;
}

function Meter({ name, level, visible, delay }) {
  const shown = useCountUp(level, visible, delay);

  return (
    <li className="dim-item group/row flex cursor-default flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="text-[var(--text)] transition-transform duration-300 group-hover/row:translate-x-1">
          {name}
        </span>
        <span className="font-mono tabular-nums text-[var(--text-muted)] transition-colors duration-300 group-hover/row:text-[var(--accent-1)]">
          {shown}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={name}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={level}
        className="h-2 w-full rounded-full bg-[var(--border)]"
      >
        <div
          className="relative h-full rounded-full transition-[width] duration-1000 ease-out motion-reduce:transition-none"
          style={{
            width: visible ? `${level}%` : "0%",
            transitionDelay: `${delay}ms`,
            background: "linear-gradient(90deg, var(--accent-1), var(--accent-2))",
          }}
        >
          {/* Titik di ujung bar menyala saat baris di-hover. */}
          <span
            aria-hidden
            className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 scale-0 rounded-full bg-[var(--accent-2)] transition-transform duration-300 group-hover/row:scale-100"
            style={{ boxShadow: "0 0 0 3px var(--card-bg), 0 0 14px var(--accent-2)" }}
          />
        </div>
      </div>
    </li>
  );
}

function Panel({ Icon, title, note, children }) {
  return (
    <SpotlightCard
      className="rounded-2xl border border-[var(--border)] p-6 sm:p-8"
      style={{ background: "var(--card-bg)" }}
    >
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--accent-1)]">
            <Icon size={18} strokeWidth={1.8} />
          </span>
          <h3 className="text-xl font-medium sm:text-2xl">{title}</h3>
        </div>
        <span className="hidden text-xs text-[var(--text-faint)] sm:block">{note}</span>
      </div>
      {children}
    </SpotlightCard>
  );
}

/**
 * Bar persentase keahlian teknis dan non-teknis. Data ada di data/skills.js.
 * Bar terisi sekali saat masuk viewport (IntersectionObserver). Hover satu
 * baris: baris lain meredup dan titik di ujung bar menyala.
 */
export default function SkillMeters() {
  const { t, tx } = useLanguage();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-16 grid grid-cols-1 gap-5 sm:mt-24 lg:grid-cols-2 lg:gap-6">
      <Panel Icon={Code2} title={t("profile.skillTech")} note={t("profile.skillNote")}>
        <ul className="dim-siblings flex flex-col gap-6">
          {technicalLevels.map((s, i) => (
            <Meter key={i} name={tx(s.name)} level={s.level} visible={visible} delay={i * 70} />
          ))}
        </ul>
      </Panel>

      <Panel Icon={Users} title={t("profile.skillSoft")} note={t("profile.skillNote")}>
        <ul className="dim-siblings flex flex-col gap-6">
          {softLevels.map((s, i) => (
            <Meter key={s.key} name={t(s.key)} level={s.level} visible={visible} delay={i * 70} />
          ))}
        </ul>
      </Panel>
    </div>
  );
}
