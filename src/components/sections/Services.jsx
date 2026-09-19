import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { services } from "../../data/services";
import { brands } from "../../data/brands";
import BrandGlyph from "../ui/BrandGlyph";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useCursor } from "../../context/CursorContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

function ServiceRow({ service, isOpen, onToggle, isDark }) {
  const { t } = useLanguage();
  const { setCursor, clearCursor } = useCursor();
  const panelId = useId();

  return (
    <div data-reveal className="border-t border-[var(--border)] last:border-b">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onMouseEnter={() => setCursor(isOpen ? "Close" : "Open", "label")}
          onMouseLeave={clearCursor}
          className="focus-ring group flex w-full items-start justify-between gap-6 py-7 text-left"
        >
          <span className="flex flex-col gap-2">
            <span
              className="font-display text-2xl font-medium leading-tight tracking-tight transition-colors duration-300 group-hover:text-[var(--accent-1)] sm:text-[1.75rem]"
              style={{ color: isOpen ? "var(--accent-1)" : undefined }}
            >
              {t(service.titleKey)}
            </span>
            <span className="max-w-[46ch] text-sm leading-relaxed text-[var(--text-muted)]">
              {t(service.leadKey)}
            </span>
          </span>

          <Plus
            size={20}
            strokeWidth={1.6}
            aria-hidden
            className="mt-1 shrink-0 text-[var(--text-faint)] transition-all duration-300 group-hover:text-[var(--text)]"
            style={{
              transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
              color: isOpen ? "var(--accent-1)" : undefined,
            }}
          />
        </button>
      </h3>

      {/* grid-template-rows 0fr -> 1fr bikin tinggi panel bisa dianimasikan
          tanpa perlu ngukur scrollHeight manual. */}
      <div
        id={panelId}
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className="pb-8 pr-2 transition-opacity duration-300"
            style={{ opacity: isOpen ? 1 : 0 }}
          >
            <p className="max-w-[62ch] border-l border-[var(--border-strong)] pl-5 text-[15px] leading-relaxed text-[var(--text-muted)]">
              {t(service.detailKey)}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2 pl-5">
              {service.stack.map((tech) => {
                const brand = brands[tech];
                const color = brand
                  ? isDark && brand.hexDark
                    ? brand.hexDark
                    : brand.hex
                  : "var(--border-strong)";
                return (
                  <li
                    key={tech}
                    style={{ "--brand": color }}
                    className="group/pill flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 font-mono text-xs text-[var(--text-faint)] transition-colors duration-300 hover:border-[var(--brand)]"
                  >
                    <BrandGlyph
                      name={tech}
                      size={13}
                      className="transition-colors duration-300 group-hover/pill:text-[var(--brand)]"
                    />
                    {tech}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const containerRef = useScrollReveal({ y: 24, stagger: 0.08 });
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme !== "light";
  // Baris pertama dibuka duluan supaya section ini gak kelihatan
  // seperti daftar link yang mati pas pertama masuk viewport.
  const [openId, setOpenId] = useState(services[0].id);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p data-reveal className="eyebrow mb-6">
              {t("services.label")}
            </p>
            <h2
              data-reveal
              className="font-display max-w-[14ch] text-4xl font-medium leading-[1.06] sm:text-5xl"
            >
              {t("services.title")}
            </h2>
            <p
              data-reveal
              className="mt-6 max-w-[42ch] text-base leading-relaxed text-[var(--text-muted)]"
            >
              {t("services.description")}
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {services.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              isOpen={openId === service.id}
              isDark={isDark}
              onToggle={() =>
                setOpenId((current) => (current === service.id ? null : service.id))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
