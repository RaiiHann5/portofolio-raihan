import { useMemo, useState } from "react";
import PageIntro from "../components/ui/PageIntro";
import FilterChips from "../components/ui/FilterChips";
import { TestimonialList } from "../components/sections/Testimonials";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";

const CATEGORIES = ["guru", "teman", "pengguna", "plk"];

/** Testimoni lengkap, bisa difilter: guru pembimbing, teman, pengguna, tempat PLK. */
export default function TestimonialsPage() {
  const { testimonials } = useContent();
  const { t } = useLanguage();
  const [category, setCategory] = useState("all");

  const options = [
    { value: "all", label: t("testi.all") },
    ...CATEGORIES.map((c) => ({ value: c, label: t(`testi.${c}`) })),
  ];

  const items = useMemo(
    () => (category === "all" ? testimonials : testimonials.filter((x) => x.category === category)),
    [testimonials, category]
  );

  return (
    <>
      <PageIntro
        label={t("testi.label")}
        title={t("testi.title")}
        description={t("testi.description")}
      >
        <FilterChips options={options} value={category} onChange={setCategory} />
      </PageIntro>

      {items.length > 0 ? (
        // key = kategori, supaya animasi muncul ulang saat filter berganti.
        <TestimonialList key={category} items={items} showHeading={false} />
      ) : (
        <p className="mx-auto max-w-[1400px] px-6 pb-32 pt-10 text-sm text-[var(--text-muted)] sm:px-10">
          {t("testi.empty")}
        </p>
      )}
    </>
  );
}
