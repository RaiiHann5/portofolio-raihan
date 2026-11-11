import { GraduationCap, Briefcase } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useLanguage } from "../../context/LanguageContext";
import SectionHeading from "../ui/SectionHeading";
import SpotlightCard from "../ui/SpotlightCard";

const ICONS = { edu: GraduationCap, plk: Briefcase };

/**
 * Pisahkan "2024 – sekarang · Jurusan" jadi periode (pil) + keterangan.
 * Kalau bagian pertama bukan tahun (mis. "Frontend Developer Intern"),
 * seluruhnya jadi keterangan.
 */
function splitMeta(meta) {
  const parts = String(meta || "").split(" · ");
  if (/^\d/.test(parts[0])) return { period: parts[0], sub: parts.slice(1).join(" · ") };
  return { period: "", sub: meta || "" };
}

/**
 * Timeline berurutan untuk pendidikan dan PLK. Satu komponen untuk
 * keduanya: yang beda hanya `prefix` dan daftar slot `items`.
 *
 * Semua teks diambil dari translations.js (namespace `profile`):
 *   profile.{prefix}Label / {prefix}Title      -> judul section
 *   profile.{item}Title / {item}Meta / {item}Body -> isi tiap kartu
 * Kartu dengan Body kosong tetap tampil tanpa paragraf.
 */
export default function ProfileList({ sectionId, index, prefix, items }) {
  const containerRef = useScrollReveal({ y: 24, stagger: 0.1 });
  const { t } = useLanguage();
  const Icon = ICONS[prefix];

  return (
    <section id={sectionId} ref={containerRef} className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div data-reveal>
          <SectionHeading
            index={index}
            label={t(`profile.${prefix}Label`)}
            title={t(`profile.${prefix}Title`)}
          />
        </div>

        <ol className="dim-siblings relative mt-14 flex list-none flex-col gap-5 p-0 pl-10 before:absolute before:bottom-6 before:left-[11.5px] before:top-6 before:w-px before:bg-[var(--border-strong)] sm:pl-14 sm:before:left-[15.5px]">
          {items.map((item, i) => {
            const body = t(`profile.${item}Body`);
            const { period, sub } = splitMeta(t(`profile.${item}Meta`));
            return (
              <li key={item} data-reveal className="dim-item group/item relative">
                {/* Titik di garis timeline */}
                <span
                  aria-hidden
                  className="absolute -left-[34px] top-9 h-3 w-3 rounded-full border-2 border-[var(--accent-1)] bg-[var(--bg)] transition-all duration-300 group-hover/item:bg-[var(--accent-1)] group-hover/item:shadow-[0_0_14px_var(--accent-1)] sm:-left-[46px]"
                />

                <SpotlightCard
                  className="rounded-2xl border border-[var(--border)] p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] sm:p-8"
                  style={{ background: "var(--card-bg)" }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-faint)] transition-colors duration-300 group-hover/spot:border-[var(--accent-1)] group-hover/spot:text-[var(--accent-1)]">
                          <Icon size={16} strokeWidth={1.8} />
                        </span>
                      )}
                      <span className="font-mono text-xs tracking-[0.18em] text-[var(--accent-1)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    {period && (
                      <span className="rounded-full border border-[var(--border-strong)] px-3 py-1 font-mono text-[11px] text-[var(--text-muted)]">
                        {period}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 text-xl font-medium tracking-tight sm:text-2xl">
                    {t(`profile.${item}Title`)}
                  </h3>
                  {sub && <p className="mt-2 text-sm text-[var(--text-muted)]">{sub}</p>}
                  {body && (
                    <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--text-muted)]">
                      {body}
                    </p>
                  )}
                </SpotlightCard>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
