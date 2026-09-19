import { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useCursor } from "../../context/CursorContext";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Galeri tangkapan layar: satu gambar besar, strip thumbnail di bawahnya,
 * dan lightbox penuh layar saat diklik.
 *
 * Kalau gambarnya cuma satu, strip thumbnail otomatis disembunyikan —
 * deretan thumbnail berisi satu item cuma bikin bingung.
 */
export default function Gallery({ images = [], title, fallbackGradient }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const { setCursor, clearCursor } = useCursor();
  const { t } = useLanguage();

  const count = images.length;
  const hasMany = count > 1;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // Lightbox harus bisa ditutup dan dijelajahi tanpa mouse.
  useEffect(() => {
    if (!lightbox) return undefined;

    function onKey(e) {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight" && hasMany) next();
      if (e.key === "ArrowLeft" && hasMany) prev();
    }

    document.addEventListener("keydown", onKey);
    // Kunci scroll body supaya halaman di belakang gak ikut bergeser.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox, hasMany, next, prev]);

  if (!count) {
    return (
      <div
        className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-[var(--border)]"
        style={{ background: fallbackGradient }}
      >
        <span className="font-mono text-xs text-[var(--text-faint)]">
          {t("detail.noImages")}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setLightbox(true)}
        onMouseEnter={() => setCursor(t("detail.expand"), "view")}
        onMouseLeave={clearCursor}
        className="focus-ring group relative block w-full overflow-hidden rounded-2xl border border-[var(--border)]"
        style={{ background: fallbackGradient }}
      >
        <img
          src={images[index]}
          alt={`${title} — ${index + 1}/${count}`}
          className="aspect-[16/10] w-full object-cover object-top"
        />
        <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <Expand size={15} />
        </span>
      </button>

      {hasMany && (
        <ul className="flex flex-wrap gap-3">
          {images.map((src, i) => (
            <li key={`${src}-${i}`}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${t("detail.screenshot")} ${i + 1}`}
                aria-current={i === index}
                className="focus-ring block h-16 w-24 overflow-hidden rounded-lg border transition-all duration-300"
                style={{
                  borderColor: i === index ? "var(--accent-1)" : "var(--border)",
                  opacity: i === index ? 1 : 0.55,
                }}
              >
                <img src={src} alt="" className="h-full w-full object-cover object-top" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setLightbox(false)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-10"
        >
          <button
            type="button"
            aria-label={t("detail.close")}
            onClick={() => setLightbox(false)}
            className="focus-ring absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 sm:right-8 sm:top-8"
          >
            <X size={20} />
          </button>

          {hasMany && (
            <>
              <button
                type="button"
                aria-label={t("detail.previous")}
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="focus-ring absolute left-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 sm:left-8"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                aria-label={t("detail.next")}
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="focus-ring absolute right-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 sm:right-8"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <img
            src={images[index]}
            alt={`${title} — ${index + 1}/${count}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-lg object-contain"
          />

          {hasMany && (
            <p className="absolute bottom-6 font-mono text-xs text-white/60">
              {index + 1} / {count}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
