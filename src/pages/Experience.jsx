import { useMemo, useState } from "react";
import { Briefcase, Users, Trophy } from "lucide-react";
import PageIntro from "../components/ui/PageIntro";
import FilterChips from "../components/ui/FilterChips";
import SpotlightCard from "../components/ui/SpotlightCard";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";

const ICONS = { plk: Briefcase, organisasi: Users, lomba: Trophy };

/**
 * Pengalaman: PLK, organisasi/kepanitiaan, lomba.
 * PLK bawaan diambil dari teks profil (profile.plk1/plk2) supaya satu
 * sumber dengan halaman About; entri tambahan datang dari admin.
 */
export default function Experience() {
  const { experiences, certificates } = useContent();
  const { t } = useLanguage();
  const [tab, setTab] = useState("plk");

  const groups = useMemo(() => {
    const builtInPlk = [1, 2]
      .map((n) => ({
        id: `plk${n}`,
        title: t(`profile.plk${n}Title`),
        role: t(`profile.plk${n}Meta`),
        period: "",
        description: t(`profile.plk${n}Body`),
        image: "",
      }))
      .filter((x) => x.title && !x.title.startsWith("profile."));

    // Penghargaan lomba dari sertifikat ikut tampil, tanpa input ganda.
    const fromCerts = (certificates || [])
      .filter((c) => c.category === "lomba" || c.category === "prestasi")
      .map((c) => ({
        id: `cert-${c.id}`,
        title: c.title,
        role: c.issuer,
        period: c.date,
        description: "",
        image: c.image,
      }));

    const db = (cat) => (experiences || []).filter((e) => e.category === cat);
    return {
      plk: [...builtInPlk, ...db("plk")],
      organisasi: db("organisasi"),
      lomba: [...db("lomba"), ...fromCerts],
    };
  }, [experiences, certificates, t]);

  const options = [
    { value: "plk", label: t("exp.tabPlk") },
    { value: "organisasi", label: t("exp.tabOrg") },
    { value: "lomba", label: t("exp.tabLomba") },
  ];
  const items = groups[tab];
  const Icon = ICONS[tab];

  return (
    <>
      <PageIntro label={t("exp.label")} title={t("exp.title")} description={t("exp.description")}>
        <FilterChips options={options} value={tab} onChange={setTab} />
      </PageIntro>

      <section className="px-6 pb-28 pt-10 sm:px-10 sm:pb-36">
        <div className="mx-auto max-w-[1400px]">
          {items.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">{t("exp.empty")}</p>
          ) : (
            <ul className="grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2">
              {items.map((item) => (
                <SpotlightCard
                  as="li"
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] sm:p-8"
                  style={{ background: "var(--card-bg)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--accent-1)]">
                      <Icon size={18} />
                    </span>
                    {item.period && (
                      <span className="rounded-full border border-[var(--border)] px-3 py-1 font-mono text-xs text-[var(--text-muted)]">
                        {item.period}
                      </span>
                    )}
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="aspect-[16/9] w-full rounded-xl border border-[var(--border)] object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-display text-xl font-medium tracking-tight">{item.title}</h3>
                    {item.role && (
                      <p className="mt-1 text-sm text-[var(--accent-1)]">{item.role}</p>
                    )}
                  </div>
                  {item.description && (
                    <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--text-muted)]">
                      {item.description}
                    </p>
                  )}
                </SpotlightCard>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
