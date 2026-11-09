import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ExternalLink } from "lucide-react";
import { useCollection } from "../../hooks/useCollection";
import { Toggle } from "../../components/admin/Fields";
import {
  sectionGroups,
  HIDDEN_SECTIONS_KEY,
  parseHidden,
} from "../../data/sectionRegistry";

export default function AdminVisibility() {
  const { rows, loading, upsert } = useCollection("settings", { orderBy: "key" });
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(null); // optimistik: daftar yang sedang disimpan

  const saved = useMemo(
    () => parseHidden(rows.find((r) => r.key === HIDDEN_SECTIONS_KEY)?.value),
    [rows]
  );
  const hidden = pending ?? saved;

  // Disimpan langsung begitu saklar digeser — tidak ada tombol simpan yang
  // bisa terlupa, jadi "matikan sekarang" benar-benar berlaku sekarang.
  async function toggle(id, visible) {
    const next = visible ? hidden.filter((h) => h !== id) : [...new Set([...hidden, id])];
    setPending(next);
    setError(null);
    try {
      await upsert(
        { key: HIDDEN_SECTIONS_KEY, value: next.join(","), updated_at: new Date().toISOString() },
        "key"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-xl font-medium tracking-tight">Visibilitas section</h2>
        <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-[var(--text-muted)]">
          Matikan section yang tidak ingin ditampilkan, nyalakan lagi kapan saja. Isinya tidak
          dihapus. Perubahan langsung berlaku, tanpa tombol simpan. Section tambahan buatan
          sendiri punya saklar tersendiri di menu Section tambahan.
        </p>
      </div>

      {loading ? (
        <p className="font-mono text-xs text-[var(--text-faint)]">Memuat…</p>
      ) : (
        <div className="flex flex-col gap-10">
          {sectionGroups.map((group) => (
            <div key={group.page} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  {group.page}
                </h3>
                <Link
                  to={group.path}
                  className="focus-ring inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent-1)]"
                >
                  Lihat halaman <ExternalLink size={11} />
                </Link>
              </div>
              {group.sections.map((s) => (
                <Toggle
                  key={s.id}
                  label={s.label}
                  hint={s.hint}
                  value={!hidden.includes(s.id)}
                  onChange={(v) => toggle(s.id, v)}
                />
              ))}
            </div>
          ))}

          {error && (
            <p className="flex items-start gap-2 rounded-lg border border-[#f87171]/40 px-4 py-3 text-sm text-[#f87171]">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
