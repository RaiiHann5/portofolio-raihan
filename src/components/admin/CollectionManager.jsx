import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  AlertCircle,
  EyeOff,
} from "lucide-react";
import { useCollection } from "../../hooks/useCollection";

/**
 * Kerangka pengelola koleksi yang dipakai semua halaman admin.
 *
 * Halaman pemanggil hanya menyediakan:
 *   - `table`       nama tabel di Supabase
 *   - `emptyRecord` nilai awal saat menambah data baru
 *   - `renderForm`  formulirnya, menerima (draft, set)
 *   - `renderRow`   ringkasan satu baris di daftar
 *
 * Semua urusan muat data, simpan, hapus, urutkan, dan penanganan galat
 * ditangani di sini supaya tidak ditulis ulang empat kali.
 */
export default function CollectionManager({
  table,
  title,
  description,
  emptyRecord,
  renderForm,
  renderRow,
  idColumn = "id",
  addLabel = "Tambah baru",
}) {
  const { rows, loading, error, create, update, remove, reorder } = useCollection(table);
  const [draft, setDraft] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  function startCreate() {
    setDraft({ ...emptyRecord, position: rows.length });
    setEditingId(null);
    setFormError(null);
  }

  function startEdit(row) {
    setDraft({ ...row });
    setEditingId(row[idColumn]);
    setFormError(null);
  }

  function cancel() {
    setDraft(null);
    setEditingId(null);
    setFormError(null);
  }

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  async function save() {
    setSaving(true);
    setFormError(null);
    try {
      // `created_at` dan `id` dikelola database; mengirimnya balik saat
      // update cuma bikin galat tipe data.
      const { id: _id, created_at: _createdAt, ...values } = draft;
      if (editingId) await update(editingId, values);
      else await create(values);
      cancel();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await remove(id, idColumn);
      setConfirmId(null);
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-medium tracking-tight">{title}</h2>
          {description && (
            <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-[var(--text-muted)]">
              {description}
            </p>
          )}
        </div>

        {!draft && (
          <button
            type="button"
            onClick={startCreate}
            className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--text)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90"
          >
            <Plus size={15} /> {addLabel}
          </button>
        )}
      </div>

      {error && (
        <p className="flex items-start gap-2 rounded-lg border border-[#f87171]/40 px-4 py-3 text-sm text-[#f87171]">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      {draft && (
        <div className="flex flex-col gap-6 rounded-xl border border-[var(--accent-1)] p-6">
          <h3 className="font-display text-lg font-medium tracking-tight">
            {editingId ? "Ubah data" : addLabel}
          </h3>

          {renderForm(draft, set)}

          {formError && (
            <p className="flex items-start gap-2 rounded-lg border border-[#f87171]/40 px-4 py-3 text-sm text-[#f87171]">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {formError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-5">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-6 py-2.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="focus-ring rounded-full px-4 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="font-mono text-xs text-[var(--text-faint)]">Memuat…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-strong)] p-10 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Belum ada data di sini. Selama tabel ini kosong, situs publik memakai data bawaan
            dari <code className="font-mono text-xs">src/data/</code>.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {rows.map((row, i) => (
            <li
              key={row[idColumn]}
              className="flex items-center gap-4 border-t border-[var(--border)] py-4 last:border-b"
            >
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => reorder(i, -1)}
                  disabled={i === 0}
                  aria-label="Pindah ke atas"
                  className="focus-ring rounded p-0.5 text-[var(--text-faint)] transition-colors hover:text-[var(--text)] disabled:opacity-25"
                >
                  <ChevronUp size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => reorder(i, 1)}
                  disabled={i === rows.length - 1}
                  aria-label="Pindah ke bawah"
                  className="focus-ring rounded p-0.5 text-[var(--text-faint)] transition-colors hover:text-[var(--text)] disabled:opacity-25"
                >
                  <ChevronDown size={15} />
                </button>
              </div>

              <div className="min-w-0 flex-1">{renderRow(row)}</div>

              {row.published === false && (
                <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-[var(--text-faint)]">
                  <EyeOff size={11} /> draft
                </span>
              )}

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(row)}
                  aria-label="Ubah"
                  className="focus-ring rounded-lg p-2 text-[var(--text-faint)] transition-colors hover:text-[var(--accent-1)]"
                >
                  <Pencil size={15} />
                </button>

                {confirmId === row[idColumn] ? (
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(row[idColumn])}
                      className="focus-ring rounded-lg px-2.5 py-1.5 text-xs text-[#f87171] transition-colors hover:bg-[#f87171]/10"
                    >
                      Hapus?
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className="focus-ring rounded-lg px-2 py-1.5 text-xs text-[var(--text-faint)]"
                    >
                      Batal
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmId(row[idColumn])}
                    aria-label="Hapus"
                    className="focus-ring rounded-lg p-2 text-[var(--text-faint)] transition-colors hover:text-[#f87171]"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
