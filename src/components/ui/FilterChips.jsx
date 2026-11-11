/** Deretan tombol filter satu-pilihan. options: [{ value, label }] */
export default function FilterChips({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={`focus-ring rounded-full border px-4 py-2 text-sm transition-colors ${
              isActive
                ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                : "border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
