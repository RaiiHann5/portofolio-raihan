import { Search, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function SearchInput({ value, onChange, placeholder }) {
  const { t } = useLanguage();

  return (
    <div className="relative w-full sm:max-w-sm">
      <Search
        size={16}
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="focus-ring w-full rounded-full border border-[var(--border-strong)] bg-transparent py-2.5 pl-10 pr-10 text-sm text-[var(--text)] transition-colors placeholder:text-[var(--text-faint)] hover:border-[var(--text-muted)] focus:border-[var(--accent-1)]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={t("filters.clear")}
          className="focus-ring absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-faint)] transition-colors hover:text-[var(--text)]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
