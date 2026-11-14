import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

/** Tombol melayang "kembali ke atas", muncul setelah halaman digulir. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label={t("more.backToTop")}
      title={t("more.backToTop")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      tabIndex={visible ? 0 : -1}
      className="focus-ring fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text)] shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-1)] hover:text-[var(--accent-1)] print:hidden"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? undefined : "translateY(12px)",
      }}
    >
      <ArrowUp size={18} />
    </button>
  );
}
