import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { technicalLevels, softLevels } from "../../data/skills";

function Meter({ name, level, visible, delay }) {
  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="text-[var(--text)]">{name}</span>
        <span className="tabular-nums text-[var(--text-muted)]">{level}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={name}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={level}
        className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]"
      >
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-out motion-reduce:transition-none"
          style={{
            width: visible ? `${level}%` : "0%",
            transitionDelay: `${delay}ms`,
            background: "linear-gradient(90deg, var(--accent-1), var(--accent-2))",
          }}
        />
      </div>
    </li>
  );
}

/**
 * Bar persentase keahlian teknis dan non-teknis. Data ada di data/skills.js.
 * Bar terisi sekali saat masuk viewport (IntersectionObserver), tanpa
 * render ulang berulang. Pengguna dengan reduced-motion langsung melihat
 * hasil akhirnya.
 */
export default function SkillMeters() {
  const { t } = useLanguage();
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
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-16 grid grid-cols-1 gap-12 sm:mt-24 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-[var(--border)] pb-4">
          <h3 className="text-xl font-medium sm:text-2xl">{t("profile.skillTech")}</h3>
          <span className="text-xs text-[var(--text-faint)]">{t("profile.skillNote")}</span>
        </div>
        <ul className="flex flex-col gap-6">
          {technicalLevels.map((s, i) => (
            <Meter key={s.name} name={s.name} level={s.level} visible={visible} delay={i * 70} />
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-[var(--border)] pb-4">
          <h3 className="text-xl font-medium sm:text-2xl">{t("profile.skillSoft")}</h3>
          <span className="text-xs text-[var(--text-faint)]">{t("profile.skillNote")}</span>
        </div>
        <ul className="flex flex-col gap-6">
          {softLevels.map((s, i) => (
            <Meter key={s.key} name={t(s.key)} level={s.level} visible={visible} delay={i * 70} />
          ))}
        </ul>
      </div>
    </div>
  );
}
