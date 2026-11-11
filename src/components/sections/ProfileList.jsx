import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useLanguage } from "../../context/LanguageContext";
import SectionHeading from "../ui/SectionHeading";

/**
 * Daftar berurutan untuk pendidikan, organisasi, dan PLK. Satu komponen
 * untuk ketiganya: yang beda hanya `prefix` dan daftar slot `items`.
 *
 * Semua teks diambil dari translations.js (namespace `profile`):
 *   profile.{prefix}Label / {prefix}Title      -> judul section
 *   profile.{item}Title / {item}Meta / {item}Body -> isi tiap baris
 * Baris dengan Body kosong tetap tampil tanpa paragraf.
 */
export default function ProfileList({ sectionId, index, prefix, items }) {
  const containerRef = useScrollReveal();
  const { t } = useLanguage();

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

        <ol className="mt-14 border-t border-[var(--border)]">
          {items.map((item, i) => {
            const body = t(`profile.${item}Body`);
            return (
              <li
                key={item}
                data-reveal
                className="grid grid-cols-1 gap-3 border-b border-[var(--border)] py-8 sm:grid-cols-12 sm:gap-8"
              >
                <span className="eyebrow tabular-nums text-[var(--text-faint)] sm:col-span-1">
                  0{i + 1}
                </span>
                <div className="sm:col-span-4">
                  <h3 className="text-xl font-medium sm:text-2xl">{t(`profile.${item}Title`)}</h3>
                  <p className="mt-2 text-sm text-[var(--text-faint)]">{t(`profile.${item}Meta`)}</p>
                </div>
                {body && (
                  <p className="text-base leading-relaxed text-[var(--text-muted)] sm:col-span-7">
                    {body}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
