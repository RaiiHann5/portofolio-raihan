import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { processSteps } from "../../data/services";
import { hasWhatsapp, contactLink } from "../../data/site";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useCursor } from "../../context/CursorContext";
import { useLanguage } from "../../context/LanguageContext";
import MagneticButton from "../ui/MagneticButton";

export default function Process() {
  const containerRef = useScrollReveal({ y: 24, stagger: 0.08 });
  const { setCursor, clearCursor } = useCursor();
  const { t } = useLanguage();

  const waReady = hasWhatsapp();
  const href = contactLink(t("process.prefill"));

  return (
    <section
      id="process"
      ref={containerRef}
      className="relative px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <p data-reveal className="eyebrow mb-6">
          {t("process.label")}
        </p>
        <h2
          data-reveal
          className="font-display max-w-[16ch] text-4xl font-medium leading-[1.06] sm:text-5xl"
        >
          {t("process.title")}
        </h2>
        <p
          data-reveal
          className="mt-6 max-w-[54ch] text-base leading-relaxed text-[var(--text-muted)]"
        >
          {t("process.description")}
        </p>

        {/* Garis tipis yang nyambungin keempat langkah — penanda bahwa ini
            urutan, bukan sekadar empat item sejajar. */}
        <ol className="process-steps mt-16 grid list-none grid-cols-1 gap-0 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <li
              key={step.id}
              data-reveal
              className="process-step relative flex flex-col gap-4 py-8 lg:pr-8"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs tracking-[0.18em] text-[var(--accent-1)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="h-px flex-1 bg-[var(--border)]"
                />
              </div>

              <h3 className="font-display text-xl font-medium leading-tight tracking-tight">
                {t(step.titleKey)}
              </h3>
              <p className="max-w-[38ch] text-sm leading-relaxed text-[var(--text-muted)]">
                {t(step.bodyKey)}
              </p>
            </li>
          ))}
        </ol>

        <div
          data-reveal
          className="mt-20 flex flex-col gap-8 border-t border-[var(--border)] pt-12 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <h3 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
              {t("process.ctaTitle")}
            </h3>
            <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-[var(--text-muted)]">
              {t("process.ctaBody")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton
              as="a"
              href={href}
              target={waReady ? "_blank" : undefined}
              rel={waReady ? "noopener noreferrer" : undefined}
              variant="solid"
              cursorLabel={waReady ? "Chat" : "Email"}
            >
              {waReady ? t("process.ctaPrimary") : t("process.ctaPrimaryFallback")}
              <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden />
            </MagneticButton>

            <Link
              to="/find-me"
              onMouseEnter={() => setCursor("Open", "label")}
              onMouseLeave={clearCursor}
              className="focus-ring text-sm text-[var(--text-faint)] transition-colors duration-300 hover:text-[var(--accent-1)]"
            >
              {t("process.ctaSecondary")}
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        /* Garis pemisah digambar lewat border, bukan gap berwarna, biar
           tetap rapi waktu kolomnya membungkus di layar sempit. */
        .process-step + .process-step {
          border-top: 1px solid var(--border);
        }
        @media (min-width: 640px) {
          .process-step:nth-child(odd) { padding-right: 2rem; }
          .process-step:nth-child(even) {
            padding-left: 2rem;
            border-left: 1px solid var(--border);
          }
          .process-step:nth-child(-n + 2) { border-top: 0; }
          .process-step:nth-child(n + 3) { border-top: 1px solid var(--border); }
        }
        @media (min-width: 1024px) {
          .process-step { padding-left: 2rem; border-top: 0 !important; }
          .process-step:first-child { padding-left: 0; }
          .process-step + .process-step { border-left: 1px solid var(--border); }
          .process-step:nth-child(even) { border-left: 1px solid var(--border); }
        }
      `}</style>
    </section>
  );
}
