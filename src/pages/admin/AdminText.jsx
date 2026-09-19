import { useMemo, useState } from "react";
import { Search, Loader2, Check, RotateCcw } from "lucide-react";
import { listTextKeys } from "../../i18n/translations";
import { setOverride } from "../../i18n/overrides";
import { useCollection } from "../../hooks/useCollection";
import { inputBase } from "../../components/admin/Fields";

// Nama section teknis -> nama yang berarti buat manusia.
const sectionLabels = {
  nav: "Navigasi",
  hero: "Home — Hero",
  stack: "Home — Tech stack",
  services: "Home — Layanan",
  work: "Home — Karya pilihan",
  process: "Home — Cara kerja",
  about: "Halaman About",
  marketplace: "Halaman Marketplace",
  detail: "Halaman detail proyek & template",
  contact: "Halaman Find Me",
  form: "Formulir kontak",
  accounts: "Kartu akun",
  footer: "Footer",
};

function TextRow({ row, saved, onSave }) {
  const [en, setEn] = useState(saved?.en ?? "");
  const [id, setId] = useState(saved?.id ?? "");
  const [status, setStatus] = useState("idle");

  const changed = en !== (saved?.en ?? "") || id !== (saved?.id ?? "");

  async function save() {
    setStatus("saving");
    try {
      await onSave(row.path, en, id);
      // Halaman publik langsung ikut berubah tanpa perlu muat ulang.
      setOverride(row.path, { en, id });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1600);
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setEn("");
    setId("");
  }

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--border)] py-5">
      <div className="flex items-center justify-between gap-3">
        <code className="font-mono text-xs text-[var(--text-faint)]">{row.path}</code>
        <div className="flex items-center gap-2">
          {(en || id) && (
            <button
              type="button"
              onClick={reset}
              title="Kosongkan untuk kembali ke teks bawaan"
              className="focus-ring inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-[var(--text-faint)] transition-colors hover:text-[var(--text)]"
            >
              <RotateCcw size={12} /> Bawaan
            </button>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!changed || status === "saving"}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-xs transition-colors hover:border-[var(--accent-1)] disabled:opacity-30"
          >
            {status === "saving" && <Loader2 size={11} className="animate-spin" />}
            {status === "saved" && <Check size={11} className="text-[var(--accent-1)]" />}
            {status === "saved" ? "Tersimpan" : "Simpan"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--text-faint)]">
            English
          </span>
          <textarea
            rows={2}
            value={en}
            placeholder={row.defaultEn}
            onChange={(e) => setEn(e.target.value)}
            className={`${inputBase} resize-y text-xs leading-relaxed`}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--text-faint)]">
            Indonesia
          </span>
          <textarea
            rows={2}
            value={id}
            placeholder={row.defaultId}
            onChange={(e) => setId(e.target.value)}
            className={`${inputBase} resize-y text-xs leading-relaxed`}
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminText() {
  const { rows, loading, upsert } = useCollection("site_text", { orderBy: "key" });
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("all");

  const allKeys = useMemo(() => listTextKeys(), []);

  const savedMap = useMemo(() => {
    const map = {};
    for (const row of rows) map[row.key] = { en: row.en, id: row.id };
    return map;
  }, [rows]);

  const sections = useMemo(
    () => ["all", ...new Set(allKeys.map((k) => k.section))],
    [allKeys]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allKeys.filter((row) => {
      if (section !== "all" && row.section !== section) return false;
      if (!q) return true;
      return (
        row.path.toLowerCase().includes(q) ||
        row.defaultEn?.toLowerCase().includes(q) ||
        row.defaultId?.toLowerCase().includes(q)
      );
    });
  }, [allKeys, query, section]);

  async function save(key, en, id) {
    await upsert({ key, en, id, updated_at: new Date().toISOString() }, "key");
  }

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-xl font-medium tracking-tight">Teks halaman</h2>
        <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-[var(--text-muted)]">
          Setiap tulisan di situs bisa diganti di sini, dalam dua bahasa. Kolom yang dibiarkan
          kosong akan memakai teks bawaan — yang tampil abu-abu sebagai contoh. Mengosongkan
          kembali sebuah kolom sama dengan membatalkan perubahan Anda.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari teks atau nama key…"
            className={`${inputBase} pl-9`}
          />
        </div>

        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          aria-label="Saring menurut bagian"
          className={`${inputBase} sm:w-64`}
        >
          {sections.map((s) => (
            <option key={s} value={s} className="bg-[var(--bg-elevated)]">
              {s === "all" ? "Semua bagian" : sectionLabels[s] || s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="font-mono text-xs text-[var(--text-faint)]">Memuat…</p>
      ) : (
        <div className="flex flex-col">
          <p className="pb-2 font-mono text-xs text-[var(--text-faint)]">
            {filtered.length} teks
          </p>
          {filtered.map((row) => (
            <TextRow key={row.path} row={row} saved={savedMap[row.path]} onSave={save} />
          ))}
        </div>
      )}
    </section>
  );
}
