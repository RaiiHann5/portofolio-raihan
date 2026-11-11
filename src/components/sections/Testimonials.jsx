import { Quote } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useContent } from "../../context/ContentContext";
import { useLanguage } from "../../context/LanguageContext";

function Avatar({ name, photo }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        loading="lazy"
        className="h-11 w-11 shrink-0 rounded-full border border-[var(--border)] object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] font-mono text-xs text-[var(--text-faint)]"
    >
      {name?.slice(0, 2).toUpperCase()}
    </span>
  );
}

function TestimonialList({ items }) {
  const containerRef = useScrollReveal({ y: 24, stagger: 0.08 });
  const { t } = useLanguage();

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="relative px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <p data-reveal className="eyebrow mb-6">
          {t("testimonials.label")}
        </p>
        <h2
          data-reveal
          className="font-display max-w-[20ch] text-4xl font-medium leading-[1.06] sm:text-5xl"
        >
          {t("testimonials.title")}
        </h2>

        <ul className="mt-12 grid list-none grid-cols-1 gap-5 p-0 sm:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              data-reveal
              className="flex flex-col gap-6 rounded-2xl border border-[var(--border)] p-6"
              style={{ background: "var(--card-bg)" }}
            >
              <Quote size={20} aria-hidden className="text-[var(--accent-1)]" />
              <p className="flex-1 text-base leading-relaxed text-[var(--text-muted)]">
                {item.message}
              </p>
              <div className="flex items-center gap-3 border-t border-[var(--border)] pt-5">
                <Avatar name={item.name} photo={item.photo} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  {item.role && (
                    <p className="truncate text-xs text-[var(--text-faint)]">{item.role}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Testimonials() {
  const { testimonials } = useContent();
  // Belum ada testimoni = section tidak muncul sama sekali.
  if (!testimonials?.length) return null;
  return <TestimonialList items={testimonials} />;
}
