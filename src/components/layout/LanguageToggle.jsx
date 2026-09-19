import { useLanguage } from "../../context/LanguageContext";
import { useCursor } from "../../context/CursorContext";

// Emoji bendera dipilih daripada teks "EN/ID" — lebih cepat dikenali
// sekilas dan tidak perlu diterjemahkan sendiri.
const FLAGS = { en: "🇬🇧", id: "🇮🇩" };

export default function LanguageToggle() {
  const { lang, toggleLanguage, targetLang } = useLanguage();
  const { setCursor, clearCursor } = useCursor();
  const isID = lang === targetLang;

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      onMouseEnter={() => setCursor("", "default")}
      onMouseLeave={clearCursor}
      aria-label={`Switch site language to ${isID ? "English" : "Indonesian"}`}
      aria-pressed={isID}
      className="notranslate focus-ring relative flex h-9 w-16 items-center rounded-full border border-[var(--border-strong)] px-1 transition-colors"
    >
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--text)] text-base leading-none transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
        style={{ transform: isID ? "translateX(28px)" : "translateX(0px)" }}
      >
        {isID ? FLAGS.id : FLAGS.en}
      </span>
    </button>
  );
}
