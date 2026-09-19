import { useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useScrollReveal } from "../hooks/useScrollReveal";
import SectionHeading from "../components/ui/SectionHeading";
import TemplateCard from "../components/marketplace/TemplateCard";
import { useContent } from "../context/ContentContext";

export default function Marketplace() {
  const { t } = useLanguage();
  const containerRef = useScrollReveal({ y: 24 });
  const { templates } = useContent();
  const [activeCategory, setActiveCategory] = useState("All");

  // Kategori diturunkan dari data, bukan daftar tetap — jadi kategori baru
  // yang diketik di panel admin langsung muncul sebagai filter.
  const categories = useMemo(
    () => ["All", ...new Set(templates.map((tpl) => tpl.category).filter(Boolean))],
    [templates]
  );

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? templates
        : templates.filter((tpl) => tpl.category === activeCategory),
    [activeCategory, templates]
  );

  return (
    <section ref={containerRef} className="relative px-6 pb-28 pt-32 sm:px-10 sm:pt-36">
      <div className="mx-auto max-w-[1400px]">
        <div data-reveal>
          <SectionHeading
            index="04"
            label={t("marketplace.label")}
            title={t("marketplace.title")}
            description={t("marketplace.description")}
          />
        </div>

        <div data-reveal className="mt-10 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`focus-ring rounded-full border px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                    : "border-[var(--border-strong)] text-[var(--text-muted)] hover:text-white"
                }`}
              >
                {cat === "All" ? t("marketplace.filterAll") : cat}
              </button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <div data-reveal className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tpl) => (
              <TemplateCard key={tpl.id} template={tpl} />
            ))}
          </div>
        ) : (
          <p data-reveal className="mt-16 text-sm text-[var(--text-muted)]">
            {t("marketplace.empty")}
          </p>
        )}
      </div>
    </section>
  );
}
