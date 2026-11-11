import { User, GraduationCap, Code2, School, MapPin, Mail } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useLanguage } from "../../context/LanguageContext";
import { useContent } from "../../context/ContentContext";
import { site } from "../../data/site";
import SectionHeading from "../ui/SectionHeading";
import SpotlightCard from "../ui/SpotlightCard";

/** Biodata singkat + minat dan bidang teknologi. */
export default function Biodata() {
  const containerRef = useScrollReveal({ y: 24, stagger: 0.06 });
  const { t } = useLanguage();
  const { settings } = useContent();

  // Alamat rumah sengaja tidak ditampilkan: halaman ini publik.
  const facts = [
    { Icon: User, label: t("profile.fName"), value: site.name },
    { Icon: GraduationCap, label: t("profile.fClass"), value: t("profile.bioClass") },
    { Icon: Code2, label: t("profile.fProgram"), value: t("profile.bioProgram") },
    { Icon: School, label: t("profile.fSchool"), value: t("profile.bioSchool") },
    { Icon: MapPin, label: t("profile.fLocation"), value: settings.location || site.location },
    { Icon: Mail, label: t("profile.fEmail"), value: settings.email || site.email },
  ];
  const areas = [1, 2, 3, 4].map((n) => t(`footer.expert${n}`));

  return (
    <section id="biodata" ref={containerRef} className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div data-reveal>
          <SectionHeading index="02" label={t("profile.bioLabel")} title={t("profile.bioTitle")} />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
            {facts.map(({ Icon, label, value }) => (
              <SpotlightCard
                key={label}
                data-reveal
                className="rounded-2xl border border-[var(--border)] p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                style={{ background: "var(--card-bg)" }}
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-faint)] transition-colors duration-300 group-hover/spot:border-[var(--accent-1)] group-hover/spot:text-[var(--accent-1)]">
                    <Icon size={17} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                      {label}
                    </dt>
                    <dd className="mt-1.5 break-words text-sm leading-snug text-[var(--text)] sm:text-base">
                      {value}
                    </dd>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </dl>

          <div data-reveal className="lg:col-span-5 lg:pl-8">
            <h3 className="text-xl font-medium sm:text-2xl">{t("profile.interestTitle")}</h3>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-muted)]">
              {t("profile.interestBody")}
            </p>
            <p className="eyebrow mt-10 text-[var(--text-faint)]">{t("profile.interestAreas")}</p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {areas.map((area, i) => (
                <li
                  key={area}
                  className="group/chip flex cursor-default items-center gap-2.5 rounded-full border border-[var(--border-strong)] py-2 pl-3 pr-4 text-sm text-[var(--text)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-1)]"
                >
                  <span className="font-mono text-[10px] text-[var(--text-faint)] transition-colors duration-300 group-hover/chip:text-[var(--accent-1)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
