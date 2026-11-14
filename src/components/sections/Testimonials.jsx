import { Quote } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useContent } from "../../context/ContentContext";
import SpotlightCard from "../ui/SpotlightCard";
import { useLanguage } from "../../context/LanguageContext";

function Avatar({ name, photo }) {
  if (photo) {
    return (
      <span
        className="shrink-0 rounded-full p-[2px]"
        style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}
      >
      <img
        src={photo}
        alt={name}
        loading="lazy"
        className="h-11 w-11 rounded-full border-2 border-[var(--card-bg)] object-cover"
      />
      </span>
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

export function TestimonialList({ items, showHeading = true }) {
  const containerRef = useScrollReveal({ y: 24, stagger: 0.08 });
  const { t } = useLanguage();

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className={`relative px-6 sm:px-10 ${showHeading ? "py-24 sm:py-32" : "pb-24 pt-10 sm:pb-32"}`}
    >
      <div className="mx-auto max-w-[1400px]">
        {showHeading && (
          <>
            <p data-reveal className="eyebrow mb-6">
              {t("testimonials.label")}
            </p>
            <h2
              data-reveal
              className="font-display max-w-[20ch] text-4xl font-medium leading-[1.06] sm:text-5xl"
            >
              {t("testimonials.title")}
            </h2>
          </>
        )}

        <ul
          className={`grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 lg:grid-cols-3 ${
            showHeading ? "mt-12 sm:mt-16" : ""
          }`}
        >
          {items.map((item) => (
            <SpotlightCard
              as="li"
              key={item.id}
              data-reveal
              className="flex flex-col gap-6 rounded-2xl border border-[var(--border)] p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)] sm:p-7"
              style={{ background: "var(--card-bg)" }}
            >
              <Quote
                size={88}
                strokeWidth={1.2}
                aria-hidden
                className="pointer-events-none absolute -right-3 -top-3 text-[var(--accent-1)] opacity-[0.07] transition-opacity duration-300 group-hover/spot:opacity-[0.14]"
              />
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--accent-1)]">
                <Quote size={16} aria-hidden />
              </span>
              <p className="flex-1 text-base leading-relaxed text-[var(--text)]">
                {item.message}
              </p>
              <div className="flex items-center gap-3 border-t border-[var(--border)] pt-5">
                <Avatar name={item.name} photo={item.photo} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  {item.role && (
                    <p className="truncate text-xs text-[var(--text-faint)]">{item.role}</p>
                  )}
                  {item.category && !showHeading && (
                    <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wider text-[var(--accent-1)]">
                      {t(`testi.${item.category}`)}
                    </p>
                  )}
                </div>
              </div>
            </SpotlightCard>
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
