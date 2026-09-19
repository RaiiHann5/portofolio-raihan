import { useEffect, useMemo, useState } from "react";
import { Search, Check } from "lucide-react";
import { Field, inputBase } from "./Fields";

/**
 * Pemilih ikon dari seluruh katalog simple-icons (3.000-an brand).
 *
 * Pustakanya diimpor secara dinamis dan HANYA di dalam panel admin, jadi
 * pengunjung biasa tidak pernah mengunduhnya. Yang disimpan ke database
 * bukan nama brand-nya, melainkan path SVG dan warnanya — dengan begitu
 * halaman publik bisa menggambar logo apa pun tanpa memuat pustaka ini,
 * termasuk brand yang belum pernah disebut di dalam kode.
 */
export default function IconPicker({ value, onChange }) {
  const [catalog, setCatalog] = useState(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("simple-icons").then((mod) => {
      if (cancelled) return;
      const list = Object.values(mod)
        .filter((icon) => icon && typeof icon === "object" && icon.title && icon.path)
        .map((icon) => ({ title: icon.title, slug: icon.slug, path: icon.path, hex: `#${icon.hex}` }));
      setCatalog(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    if (!catalog) return [];
    const q = query.trim().toLowerCase();
    if (!q) return catalog.slice(0, 60);
    return catalog.filter((icon) => icon.title.toLowerCase().includes(q)).slice(0, 60);
  }, [catalog, query]);

  function choose(icon) {
    onChange({
      icon_name: icon.slug,
      icon_path: icon.path,
      icon_hex: icon.hex,
    });
    setOpen(false);
  }

  return (
    <Field
      label="Ikon"
      hint="Cari nama brand-nya. Kalau tidak ketemu, kosongkan saja — inisial nama link yang akan dipakai."
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--border)]"
          style={{ color: value?.icon_hex || "var(--text-faint)" }}
        >
          {value?.icon_path ? (
            <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d={value.icon_path} />
            </svg>
          ) : (
            <span className="font-mono text-xs">—</span>
          )}
        </span>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="focus-ring flex-1 rounded-lg border border-[var(--border)] px-3.5 py-2.5 text-left text-sm transition-colors hover:border-[var(--border-strong)]"
        >
          {value?.icon_name || "Pilih ikon…"}
        </button>

        {value?.icon_path && (
          <button
            type="button"
            onClick={() => onChange({ icon_name: "", icon_path: "", icon_hex: "" })}
            className="focus-ring rounded-lg px-3 py-2.5 text-xs text-[var(--text-faint)] transition-colors hover:text-[#f87171]"
          >
            Hapus
          </button>
        )}
      </div>

      {open && (
        <div className="mt-2 rounded-lg border border-[var(--border)] p-3">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari brand, misal: notion, whatsapp, tokopedia"
              className={`${inputBase} pl-9`}
            />
          </div>

          {!catalog && (
            <p className="mt-3 text-xs text-[var(--text-faint)]">Memuat katalog ikon…</p>
          )}

          {catalog && results.length === 0 && (
            <p className="mt-3 text-xs text-[var(--text-faint)]">
              Tidak ada brand bernama itu. Kosongkan ikonnya dan inisial nama link akan dipakai.
            </p>
          )}

          <ul className="mt-3 grid max-h-64 grid-cols-2 gap-1 overflow-y-auto sm:grid-cols-3">
            {results.map((icon) => {
              const active = value?.icon_name === icon.slug;
              return (
                <li key={icon.slug}>
                  <button
                    type="button"
                    onClick={() => choose(icon)}
                    className="focus-ring flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill={icon.hex}
                      aria-hidden
                      className="shrink-0"
                    >
                      <path d={icon.path} />
                    </svg>
                    <span className="min-w-0 flex-1 truncate">{icon.title}</span>
                    {active && <Check size={13} className="shrink-0 text-[var(--accent-1)]" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Field>
  );
}
