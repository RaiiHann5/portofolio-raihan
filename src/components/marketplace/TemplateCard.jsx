import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useCursor } from "../../context/CursorContext";
import { useLanguage } from "../../context/LanguageContext";

const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function TemplateCard({ template }) {
  const { setCursor, clearCursor } = useCursor();
  const { t } = useLanguage();
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] transition-colors hover:border-[var(--border-strong)]">
      <Link
        to={`/marketplace/${template.slug}`}
        className="focus-ring relative block aspect-[4/3] overflow-hidden"
        onMouseEnter={() => setCursor(t("marketplace.preview"), "view")}
        onMouseLeave={clearCursor}
      >
        {template.image && !imgError ? (
          <img
            src={template.image}
            alt={template.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[color-mix(in_srgb,var(--text)_5%,transparent)]">
            <span className="font-display text-4xl font-medium text-[var(--text-faint)]">
              {template.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-wide text-white/80 backdrop-blur-sm">
          {template.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-medium tracking-tight">
          <Link
            to={`/marketplace/${template.slug}`}
            onMouseEnter={() => setCursor(t("marketplace.preview"), "view")}
            onMouseLeave={clearCursor}
            className="focus-ring transition-colors duration-300 hover:text-[var(--accent-1)]"
          >
            {template.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
          {template.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {template.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[var(--border)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-faint)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          <span className="text-base font-semibold">{idrFormatter.format(template.price)}</span>

          <div className="flex items-center gap-4">
            {/* Tombol beli baru muncul kalau link-nya sudah diisi di
                data/templates.js — daripada nampilin tombol yang mati. */}
            {template.buy && (
              <a
                href={template.buy}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCursor("Buy", "label")}
                onMouseLeave={clearCursor}
                className="focus-ring inline-flex items-center gap-1 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent-1)]"
              >
                {t("marketplace.buyNow")} <ArrowUpRight size={14} />
              </a>
            )}

            <Link
              to={`/marketplace/${template.slug}`}
              onMouseEnter={() => setCursor("Open", "label")}
              onMouseLeave={clearCursor}
              className="focus-ring inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--accent-1)]"
            >
              {t("marketplace.details")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
