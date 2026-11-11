import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useLanguage } from "../../context/LanguageContext";
import { useContent } from "../../context/ContentContext";
import { site } from "../../data/site";
import SectionHeading from "../ui/SectionHeading";

/** Biodata singkat + minat dan bidang teknologi. */
export default function Biodata() {
  const containerRef = useScrollReveal();
  const { t } = useLanguage();
  const { settings } = useContent();

  // Alamat rumah sengaja tidak ditampilkan: halaman ini publik.
  const facts = [
    { label: t("profile.fName"), value: site.name },
    { label: t("profile.fClass"), value: t("profile.bioClass") },
    { label: t("profile.fProgram"), value: t("profile.bioProgram") },
    { label: t("profile.fSchool"), value: t("profile.bioSchool") },
    { label: t("profile.fLocation"), value: settings.location || site.location },
    { label: t("profile.fEmail"), value: settings.email || site.email },
  ];
  const areas = [1, 2, 3, 4].map((n) => t(`footer.expert${n}`));

  return (
    <section id="biodata" ref={containerRef} className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div data-reveal>
          <SectionHeading index="02" label={t("profile.bioLabel")} title={t("profile.bioTitle")} />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <dl data-reveal className="border-t border-[var(--border)] lg:col-span-6">
            {facts.map((f) => (
              <div
                key={f.label}
                className="grid grid-cols-3 gap-4 border-b border-[var(--border)] py-4 text-sm sm:text-base"
              >
                <dt className="text-[var(--text-faint)]">{f.label}</dt>
                <dd className="col-span-2 break-words text-[var(--text)]">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div data-reveal className="lg:col-span-6 lg:pl-10">
            <h3 className="text-xl font-medium sm:text-2xl">{t("profile.interestTitle")}</h3>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-muted)]">
              {t("profile.interestBody")}
            </p>
            <p className="eyebrow mt-10 text-[var(--text-faint)]">{t("profile.interestAreas")}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {areas.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm text-[var(--text)]"
                >
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
