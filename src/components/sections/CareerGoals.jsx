import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useLanguage } from "../../context/LanguageContext";
import SectionHeading from "../ui/SectionHeading";

const GOALS = [
  { title: "profile.goalShortTitle", body: "profile.goalShortBody" },
  { title: "profile.goalLongTitle", body: "profile.goalLongBody" },
];

/** Cita-cita dan tujuan karier: jangka dekat dan jangka panjang. */
export default function CareerGoals() {
  const containerRef = useScrollReveal();
  const { t } = useLanguage();

  return (
    <section id="career" ref={containerRef} className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div data-reveal>
          <SectionHeading index="09" label={t("profile.careerLabel")} title={t("profile.careerTitle")} />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {GOALS.map((g, i) => (
            <div
              key={g.title}
              data-reveal
              className="rounded-2xl border border-[var(--border)] p-6 sm:p-8 md:p-10"
              style={{ background: "var(--card-bg)" }}
            >
              <span className="eyebrow tabular-nums text-[var(--text-faint)]">0{i + 1}</span>
              <h3 className="mt-6 text-xl font-medium sm:text-2xl">{t(g.title)}</h3>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-muted)]">{t(g.body)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
