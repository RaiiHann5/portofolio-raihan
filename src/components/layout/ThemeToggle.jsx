import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useCursor } from "../../context/CursorContext";
import { useLanguage } from "../../context/LanguageContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { setCursor, clearCursor } = useCursor();
  const { t } = useLanguage();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      onMouseEnter={() => setCursor("", "default")}
      onMouseLeave={clearCursor}
      aria-label={isLight ? t("a11y.toDark") : t("a11y.toLight")}
      aria-pressed={isLight}
      className="focus-ring relative flex h-9 w-16 items-center rounded-full border border-[var(--border-strong)] px-1 transition-colors"
    >
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--text)] text-[var(--bg)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
        style={{ transform: isLight ? "translateX(28px)" : "translateX(0px)" }}
      >
        {isLight ? <Sun size={14} strokeWidth={2.2} /> : <Moon size={14} strokeWidth={2.2} />}
      </span>
    </button>
  );
}
