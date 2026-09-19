import { useScrollReveal } from "../../hooks/useScrollReveal";

/**
 * Menampilkan section yang dibuat lewat panel admin.
 *
 * Tiga bentuk saja, dipilih sadar: prose, cards, dan stats. Membiarkan
 * admin mengarang tata letak apa pun ujungnya malah merusak konsistensi
 * visual situs — lebih baik sedikit pilihan yang semuanya terlihat benar.
 */
function Blocks({ layout, blocks }) {
  if (!blocks?.length) return null;

  if (layout === "stats") {
    return (
      <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
        {blocks.map((block, i) => (
          <div key={i} className="flex flex-col gap-2 border-t border-[var(--border)] pt-5">
            <dt className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
              {block.title}
            </dt>
            <dd className="text-sm leading-relaxed text-[var(--text-muted)]">{block.body}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <ul className="mt-14 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {blocks.map((block, i) => (
        <li key={i} className="flex flex-col gap-3 border-t border-[var(--border)] pt-5">
          <h3 className="text-base font-medium tracking-tight">{block.title}</h3>
          <p className="max-w-[44ch] text-sm leading-relaxed text-[var(--text-muted)]">
            {block.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function CustomSection({ section }) {
  const containerRef = useScrollReveal({ y: 24, stagger: 0.08 });

  // Section tanpa judul dan tanpa isi tidak perlu memakan ruang.
  if (!section.title && !section.body && !section.blocks?.length) return null;

  return (
    <section ref={containerRef} className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        {section.eyebrow && (
          <p data-reveal className="eyebrow mb-6">
            {section.eyebrow}
          </p>
        )}

        {section.title && (
          <h2
            data-reveal
            className="font-display max-w-[18ch] text-4xl font-medium leading-[1.06] sm:text-5xl"
          >
            {section.title}
          </h2>
        )}

        {section.body && (
          <p
            data-reveal
            className="mt-6 max-w-[62ch] text-base leading-relaxed text-[var(--text-muted)]"
          >
            {section.body}
          </p>
        )}

        <div data-reveal>
          <Blocks layout={section.layout} blocks={section.blocks} />
        </div>
      </div>
    </section>
  );
}
