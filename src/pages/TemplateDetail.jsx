import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowUpRight, ArrowLeft, Check } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { brands } from "../data/brands";
import BrandGlyph from "../components/ui/BrandGlyph";
import Gallery from "../components/ui/Gallery";
import MagneticButton from "../components/ui/MagneticButton";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTheme } from "../context/ThemeContext";
import { useCursor } from "../context/CursorContext";
import { useLanguage } from "../context/LanguageContext";

const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function TemplateDetail() {
  const { slug } = useParams();
  const { getTemplate, loading } = useContent();
  const template = getTemplate(slug);
  const containerRef = useScrollReveal({ y: 24, stagger: 0.07 });
  const { theme } = useTheme();
  const { setCursor, clearCursor } = useCursor();
  const { t } = useLanguage();

  if (!template) {
    if (loading) return null;
    return <Navigate to="/marketplace" replace />;
  }

  const isDark = theme !== "light";
  const gallery = template.gallery?.length
    ? template.gallery
    : template.image
      ? [template.image]
      : [];

  return (
    <article ref={containerRef} className="relative px-6 pb-28 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-[1400px]">
        <Link
          to="/marketplace"
          onMouseEnter={() => setCursor("Back", "label")}
          onMouseLeave={clearCursor}
          className="focus-ring group inline-flex items-center gap-2 text-sm text-[var(--text-faint)] transition-colors duration-300 hover:text-[var(--text)]"
        >
          <ArrowLeft
            size={15}
            strokeWidth={2.2}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          {t("detail.backToMarketplace")}
        </Link>

        <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div data-reveal>
              <Gallery
                images={gallery}
                title={template.title}
                fallbackGradient="linear-gradient(135deg, #1a1a1e, #0a0a0b)"
              />
            </div>

            <section data-reveal className="mt-16">
              <h2 className="font-display text-2xl font-medium tracking-tight">
                {t("detail.overview")}
              </h2>
              <p className="mt-5 max-w-[68ch] text-base leading-relaxed text-[var(--text-muted)]">
                {template.overview}
              </p>
            </section>

            {template.features?.length > 0 && (
              <section data-reveal className="mt-16">
                <h2 className="font-display text-2xl font-medium tracking-tight">
                  {t("detail.features")}
                </h2>
                <ul className="mt-8 flex flex-col">
                  {template.features.map((feature) => (
                    <li
                      key={feature.title}
                      className="flex flex-col gap-2 border-t border-[var(--border)] py-6 last:border-b"
                    >
                      <h3 className="text-base font-medium tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="max-w-[62ch] text-sm leading-relaxed text-[var(--text-muted)]">
                        {feature.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Panel beli dibuat sticky: di halaman sepanjang ini, harga dan
              tombolnya gak boleh ikut hilang begitu orang scroll ke bawah. */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-32">
              <div data-reveal className="flex flex-col gap-5 rounded-2xl border border-[var(--border)] p-6">
                <div className="flex flex-col gap-3">
                  <span className="eyebrow text-[var(--accent-1)]">
                    {template.category}
                  </span>
                  <h1 className="font-display text-3xl font-medium leading-tight tracking-tight">
                    {template.title}
                  </h1>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                    {template.description}
                  </p>
                </div>

                <p className="font-display text-3xl font-medium tracking-tight">
                  {idrFormatter.format(template.price)}
                </p>

                <div className="flex flex-col gap-3">
                  {template.buy ? (
                    <MagneticButton
                      as="a"
                      href={template.buy}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="solid"
                      cursorLabel="Buy"
                      className="w-full"
                    >
                      {t("marketplace.buyNow")}
                      <ArrowUpRight size={16} strokeWidth={2.2} />
                    </MagneticButton>
                  ) : (
                    <p className="rounded-full border border-dashed border-[var(--border-strong)] px-6 py-3.5 text-center text-sm text-[var(--text-faint)]">
                      {t("detail.notForSaleYet")}
                    </p>
                  )}

                  {template.demo && (
                    <MagneticButton
                      as="a"
                      href={template.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      cursorLabel="Preview"
                      className="w-full"
                    >
                      {t("marketplace.preview")}
                      <ArrowUpRight size={16} strokeWidth={2.2} />
                    </MagneticButton>
                  )}
                </div>

                <ul className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-5">
                  {template.stack.map((tech) => {
                    const brand = brands[tech];
                    const color = brand
                      ? isDark && brand.hexDark
                        ? brand.hexDark
                        : brand.hex
                      : "var(--border-strong)";
                    return (
                      <li
                        key={tech}
                        className="stack-pill group flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 transition-colors duration-300 hover:border-[var(--brand)]"
                        style={{ "--brand": color }}
                      >
                        <BrandGlyph
                          name={tech}
                          size={14}
                          className="text-[var(--text-faint)] transition-colors duration-300 group-hover:text-[var(--brand)]"
                        />
                        <span className="font-mono text-xs text-[var(--text-muted)]">
                          {tech}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {template.includes?.length > 0 && (
                <section data-reveal className="mt-8">
                  <h2 className="font-display text-lg font-medium tracking-tight">
                    {t("detail.includes")}
                  </h2>
                  <ul className="mt-5 flex flex-col gap-3">
                    {template.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                        <Check
                          size={15}
                          strokeWidth={2.4}
                          className="mt-0.5 shrink-0 text-[var(--accent-1)]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <dl data-reveal className="mt-8">
                {template.pages && (
                  <div className="flex flex-col gap-1 border-t border-[var(--border)] py-4">
                    <dt className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
                      {t("detail.pages")}
                    </dt>
                    <dd className="text-sm">{template.pages}</dd>
                  </div>
                )}
                {template.license && (
                  <div className="flex flex-col gap-1 border-t border-[var(--border)] py-4">
                    <dt className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
                      {t("detail.license")}
                    </dt>
                    <dd className="text-sm leading-relaxed">{template.license}</dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
