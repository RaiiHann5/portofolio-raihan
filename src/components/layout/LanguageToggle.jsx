import { useId } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useCursor } from "../../context/CursorContext";

// Emoji bendera tidak dirender di Windows (cuma jadi kotak/lingkaran kosong),
// jadi bendera digambar sebagai SVG supaya konsisten di semua OS.
function FlagID() {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <rect width="60" height="15" fill="#E70011" />
      <rect y="15" width="60" height="15" fill="#FFFFFF" />
    </svg>
  );
}

function FlagGB() {
  const clipId = `gb-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <clipPath id={clipId}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath={`url(#${clipId})`} />
      <path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

export default function LanguageToggle() {
  const { lang, toggleLanguage, targetLang, t } = useLanguage();
  const { setCursor, clearCursor } = useCursor();
  const isID = lang === targetLang;

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      onMouseEnter={() => setCursor("", "default")}
      onMouseLeave={clearCursor}
      aria-label={isID ? t("a11y.langToEn") : t("a11y.langToId")}
      aria-pressed={isID}
      className="notranslate focus-ring relative flex h-9 w-16 items-center rounded-full border border-[var(--border-strong)] px-1 transition-colors"
    >
      <span
        className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full ring-1 ring-black/10 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
        style={{ transform: isID ? "translateX(28px)" : "translateX(0px)" }}
      >
        {isID ? <FlagID /> : <FlagGB />}
      </span>
    </button>
  );
}
